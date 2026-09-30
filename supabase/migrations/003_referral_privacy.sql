-- Aggregate counters replace request-level visitor metadata. Server-role RPC only.
ALTER TABLE public.ref_links ADD COLUMN legacy_visit_count bigint NOT NULL DEFAULT 0;
ALTER TABLE public.ref_links ADD COLUMN consented_visit_count bigint NOT NULL DEFAULT 0;
ALTER TABLE public.ref_links ADD COLUMN first_visit_date date;
ALTER TABLE public.ref_links ADD COLUMN latest_visit_date date;

CREATE TABLE public.ref_count_receipts (
  receipt_hash text PRIMARY KEY,
  link_id uuid NOT NULL REFERENCES public.ref_links(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours'
);
ALTER TABLE public.ref_count_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ref_count_receipts FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.ref_count_receipts TO service_role;

CREATE FUNCTION public.purge_expired_ref_count_receipts() RETURNS void
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  DELETE FROM public.ref_count_receipts WHERE expires_at < now();
$$;

CREATE FUNCTION public.count_referral_with_consent(p_token text, p_receipt_hash text) RETURNS boolean
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE ref_id uuid;
BEGIN
  PERFORM public.purge_expired_ref_count_receipts();
  UPDATE public.ref_links SET consented_visit_count=consented_visit_count+1,
    first_visit_date=coalesce(first_visit_date,current_date), latest_visit_date=current_date
    WHERE token=p_token RETURNING id INTO ref_id;
  IF ref_id IS NULL THEN RETURN false; END IF;
  INSERT INTO public.ref_count_receipts(receipt_hash,link_id) VALUES(p_receipt_hash,ref_id);
  RETURN true;
END;
$$;

CREATE FUNCTION public.withdraw_referral_count(p_receipt_hash text) RETURNS boolean
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE ref_id uuid;
BEGIN
  DELETE FROM public.ref_count_receipts WHERE receipt_hash=p_receipt_hash AND expires_at >= now()
    RETURNING link_id INTO ref_id;
  IF ref_id IS NULL THEN RETURN false; END IF;
  UPDATE public.ref_links SET consented_visit_count=greatest(0,consented_visit_count-1),
    first_visit_date=CASE WHEN legacy_visit_count+consented_visit_count <= 1 THEN NULL ELSE first_visit_date END,
    latest_visit_date=CASE WHEN legacy_visit_count+consented_visit_count <= 1 THEN NULL ELSE latest_visit_date END
    WHERE id=ref_id;
  PERFORM public.purge_expired_ref_count_receipts();
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_ref_count_receipts() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.count_referral_with_consent(text,text) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.withdraw_referral_count(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_ref_count_receipts() TO service_role;
GRANT EXECUTE ON FUNCTION public.count_referral_with_consent(text,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.withdraw_referral_count(text) TO service_role;

-- Preserve only truthful historical totals and coarse dates, explicitly legacy.
UPDATE public.ref_links l SET legacy_visit_count=e.n,first_visit_date=e.first_day,latest_visit_date=e.last_day
FROM (SELECT link_id,count(*) n,min(created_at)::date first_day,max(created_at)::date last_day
      FROM public.ref_events WHERE event_type='visit' GROUP BY link_id) e WHERE l.id=e.link_id;
DELETE FROM public.ref_events;
DROP POLICY IF EXISTS "Allow insert ref_events" ON public.ref_events;
REVOKE INSERT ON public.ref_events FROM anon,authenticated;

-- Block old deployment code from reintroducing request-level records.
CREATE FUNCTION public.reject_legacy_ref_event() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN RAISE EXCEPTION 'Referral request-level events retired'; END;
$$;
CREATE TRIGGER block_legacy_ref_event BEFORE INSERT ON public.ref_events
FOR EACH ROW EXECUTE FUNCTION public.reject_legacy_ref_event();
REVOKE ALL ON FUNCTION public.reject_legacy_ref_event() FROM PUBLIC,anon,authenticated;

-- No direct browser usage exists for these server-owned legacy tables.
-- Preserve every row and privileged server access while closing public exposure.
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.documents,public.connectors FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.documents,public.connectors TO service_role;
