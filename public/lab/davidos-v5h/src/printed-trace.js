// Printed from the bundled engine for the reduced-motion reader.
export const printedTrace = [
  {
    count: 1,
    unique: true,
    events: ['POST /visits · attempt 1', 'Committed · VIS-742'],
  },
  {
    count: 1,
    unique: true,
    events: [
      'POST /visits · attempt 1',
      'Committed · VIS-742',
      'Response lost · after commit',
    ],
  },
  {
    count: 2,
    unique: false,
    events: [
      'POST /visits · attempt 2',
      'Committed · VIS-743',
      '201 received · VIS-743',
    ],
  },
  {
    count: 1,
    unique: true,
    events: [
      'POST /visits · attempt 2',
      'Replay stored result · VIS-742',
      '200 received · VIS-742',
    ],
  },
  {
    count: 1,
    unique: true,
    events: [
      '200 received · VIS-742',
      'POST /visits · attempt 3',
      '409 · Key reused with a different payload',
    ],
  },
];
