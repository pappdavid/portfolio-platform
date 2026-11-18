import {
  createRun,
  sendFirst,
  retry,
  replayFixed,
  probeConflict,
  receipt,
} from './engine.mjs';

export function bookingRecords() {
  const first = sendFirst(createRun({ adapter: 'fixed' }));
  const plainFirst = sendFirst(createRun());
  const plain = retry(plainFirst);
  const fixed = replayFixed(plain);
  return [first, plainFirst, plain, fixed, probeConflict(fixed)].map(receipt);
}
