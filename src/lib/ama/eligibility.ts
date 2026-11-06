// These facts are used only for a direct question on this subject.
export function asksForWorkEligibility(question: string): boolean {
  return /\b(?:sponsor(?:ship)?|visa|work authori[sz]ation|work permit|right to work|eligib(?:le|ility) to work|citizen(?:ship)?)\b/i.test(
    question
  );
}
export const workEligibilityAnswer =
  'David is a Hungarian citizen with NL/EU work authorization; no sponsorship required.';
