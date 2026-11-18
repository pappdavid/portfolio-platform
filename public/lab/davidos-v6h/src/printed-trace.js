// Frozen engine records for the static reader.
export const printedTrace = [
  {
    "showcase": "Faultline",
    "modelVersion": 1,
    "disclosure": "Executed deterministic browser simulation. Seeded booking. In-memory receiver, no network or real booking. Atomic effect + receipt is an explicit model assumption; not proof of durable distributed behavior.",
    "config": {
      "adapter": "fixed",
      "fault": "after",
      "stableKey": true,
      "retries": 1
    },
    "phase": "sent",
    "attempts": 1,
    "visits": [
      {
        "id": "VIS-742",
        "key": "WORK-318",
        "operation": "WORK-318",
        "service": "Boiler inspection",
        "slot": "09:30–10:00",
        "location": "Demo workshop"
      }
    ],
    "receipts": {
      "WORK-318": {
        "fingerprint": "[\"WORK-318\",\"Boiler inspection\",\"09:30–10:00\",\"Demo workshop\"]",
        "id": "VIS-742"
      }
    },
    "trace": [
      {
        "sequence": 1,
        "attempt": 1,
        "kind": "request",
        "title": "POST /visits · attempt 1",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 2,
        "attempt": 1,
        "kind": "commit",
        "title": "Committed · VIS-742",
        "detail": "Visit and idempotency receipt committed atomically in the model."
      },
      {
        "sequence": 3,
        "attempt": 1,
        "kind": "drop",
        "title": "Response lost · after commit",
        "detail": "The visit exists. The client times out and cannot tell whether it committed."
      }
    ],
    "observedId": null,
    "conflict": false,
    "assertions": {
      "completion": false,
      "uniqueness": true
    }
  },
  {
    "showcase": "Faultline",
    "modelVersion": 1,
    "disclosure": "Executed deterministic browser simulation. Seeded booking. In-memory receiver, no network or real booking. Atomic effect + receipt is an explicit model assumption; not proof of durable distributed behavior.",
    "config": {
      "adapter": "baseline",
      "fault": "after",
      "stableKey": true,
      "retries": 1
    },
    "phase": "sent",
    "attempts": 1,
    "visits": [
      {
        "id": "VIS-742",
        "key": "WORK-318",
        "operation": "WORK-318",
        "service": "Boiler inspection",
        "slot": "09:30–10:00",
        "location": "Demo workshop"
      }
    ],
    "receipts": {},
    "trace": [
      {
        "sequence": 1,
        "attempt": 1,
        "kind": "request",
        "title": "POST /visits · attempt 1",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 2,
        "attempt": 1,
        "kind": "commit",
        "title": "Committed · VIS-742",
        "detail": "Receiver creates a visit. It does not remember the operation key."
      },
      {
        "sequence": 3,
        "attempt": 1,
        "kind": "drop",
        "title": "Response lost · after commit",
        "detail": "The visit exists. The client times out and cannot tell whether it committed."
      }
    ],
    "observedId": null,
    "conflict": false,
    "assertions": {
      "completion": false,
      "uniqueness": true
    }
  },
  {
    "showcase": "Faultline",
    "modelVersion": 1,
    "disclosure": "Executed deterministic browser simulation. Seeded booking. In-memory receiver, no network or real booking. Atomic effect + receipt is an explicit model assumption; not proof of durable distributed behavior.",
    "config": {
      "adapter": "baseline",
      "fault": "after",
      "stableKey": true,
      "retries": 1
    },
    "phase": "retried",
    "attempts": 2,
    "visits": [
      {
        "id": "VIS-742",
        "key": "WORK-318",
        "operation": "WORK-318",
        "service": "Boiler inspection",
        "slot": "09:30–10:00",
        "location": "Demo workshop"
      },
      {
        "id": "VIS-743",
        "key": "WORK-318",
        "operation": "WORK-318",
        "service": "Boiler inspection",
        "slot": "09:30–10:00",
        "location": "Demo workshop"
      }
    ],
    "receipts": {},
    "trace": [
      {
        "sequence": 1,
        "attempt": 1,
        "kind": "request",
        "title": "POST /visits · attempt 1",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 2,
        "attempt": 1,
        "kind": "commit",
        "title": "Committed · VIS-742",
        "detail": "Receiver creates a visit. It does not remember the operation key."
      },
      {
        "sequence": 3,
        "attempt": 1,
        "kind": "drop",
        "title": "Response lost · after commit",
        "detail": "The visit exists. The client times out and cannot tell whether it committed."
      },
      {
        "sequence": 4,
        "attempt": 2,
        "kind": "request",
        "title": "POST /visits · attempt 2",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 5,
        "attempt": 2,
        "kind": "commit",
        "title": "Committed · VIS-743",
        "detail": "Receiver creates a visit. It does not remember the operation key."
      },
      {
        "sequence": 6,
        "attempt": 2,
        "kind": "response",
        "title": "201 received · VIS-743",
        "detail": "Client can now confirm this visit against receiver state."
      }
    ],
    "observedId": "VIS-743",
    "conflict": false,
    "assertions": {
      "completion": true,
      "uniqueness": false
    }
  },
  {
    "showcase": "Faultline",
    "modelVersion": 1,
    "disclosure": "Executed deterministic browser simulation. Seeded booking. In-memory receiver, no network or real booking. Atomic effect + receipt is an explicit model assumption; not proof of durable distributed behavior.",
    "config": {
      "adapter": "fixed",
      "fault": "after",
      "stableKey": true,
      "retries": 1
    },
    "phase": "retried",
    "attempts": 2,
    "visits": [
      {
        "id": "VIS-742",
        "key": "WORK-318",
        "operation": "WORK-318",
        "service": "Boiler inspection",
        "slot": "09:30–10:00",
        "location": "Demo workshop"
      }
    ],
    "receipts": {
      "WORK-318": {
        "fingerprint": "[\"WORK-318\",\"Boiler inspection\",\"09:30–10:00\",\"Demo workshop\"]",
        "id": "VIS-742"
      }
    },
    "trace": [
      {
        "sequence": 1,
        "attempt": 1,
        "kind": "request",
        "title": "POST /visits · attempt 1",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 2,
        "attempt": 1,
        "kind": "commit",
        "title": "Committed · VIS-742",
        "detail": "Visit and idempotency receipt committed atomically in the model."
      },
      {
        "sequence": 3,
        "attempt": 1,
        "kind": "drop",
        "title": "Response lost · after commit",
        "detail": "The visit exists. The client times out and cannot tell whether it committed."
      },
      {
        "sequence": 4,
        "attempt": 2,
        "kind": "request",
        "title": "POST /visits · attempt 2",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 5,
        "attempt": 2,
        "kind": "replay",
        "title": "Replay stored result · VIS-742",
        "detail": "Same key + same payload. Return the original visit without another effect."
      },
      {
        "sequence": 6,
        "attempt": 2,
        "kind": "response",
        "title": "200 received · VIS-742",
        "detail": "Client can now confirm this visit against receiver state."
      }
    ],
    "observedId": "VIS-742",
    "conflict": false,
    "assertions": {
      "completion": true,
      "uniqueness": true
    }
  },
  {
    "showcase": "Faultline",
    "modelVersion": 1,
    "disclosure": "Executed deterministic browser simulation. Seeded booking. In-memory receiver, no network or real booking. Atomic effect + receipt is an explicit model assumption; not proof of durable distributed behavior.",
    "config": {
      "adapter": "fixed",
      "fault": "after",
      "stableKey": true,
      "retries": 1
    },
    "phase": "retried",
    "attempts": 3,
    "visits": [
      {
        "id": "VIS-742",
        "key": "WORK-318",
        "operation": "WORK-318",
        "service": "Boiler inspection",
        "slot": "09:30–10:00",
        "location": "Demo workshop"
      }
    ],
    "receipts": {
      "WORK-318": {
        "fingerprint": "[\"WORK-318\",\"Boiler inspection\",\"09:30–10:00\",\"Demo workshop\"]",
        "id": "VIS-742"
      }
    },
    "trace": [
      {
        "sequence": 1,
        "attempt": 1,
        "kind": "request",
        "title": "POST /visits · attempt 1",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 2,
        "attempt": 1,
        "kind": "commit",
        "title": "Committed · VIS-742",
        "detail": "Visit and idempotency receipt committed atomically in the model."
      },
      {
        "sequence": 3,
        "attempt": 1,
        "kind": "drop",
        "title": "Response lost · after commit",
        "detail": "The visit exists. The client times out and cannot tell whether it committed."
      },
      {
        "sequence": 4,
        "attempt": 2,
        "kind": "request",
        "title": "POST /visits · attempt 2",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 5,
        "attempt": 2,
        "kind": "replay",
        "title": "Replay stored result · VIS-742",
        "detail": "Same key + same payload. Return the original visit without another effect."
      },
      {
        "sequence": 6,
        "attempt": 2,
        "kind": "response",
        "title": "200 received · VIS-742",
        "detail": "Client can now confirm this visit against receiver state."
      },
      {
        "sequence": 7,
        "attempt": 3,
        "kind": "request",
        "title": "POST /visits · attempt 3",
        "detail": "Idempotency-Key: WORK-318"
      },
      {
        "sequence": 8,
        "attempt": 3,
        "kind": "conflict",
        "title": "409 · Key reused with a different payload",
        "detail": "Receiver rejects the mutation. No extra visit is created."
      }
    ],
    "observedId": "VIS-742",
    "conflict": true,
    "assertions": {
      "completion": true,
      "uniqueness": true
    }
  }
];
