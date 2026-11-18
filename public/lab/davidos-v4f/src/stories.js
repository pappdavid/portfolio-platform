// The bench transcript is fictional. Line numbers are derived from its array order.
export const transcript = [
  'The parcel is waiting at the depot.',
  'A road closure delayed the delivery.',
  'The driver has checked the route.',
  'The parcel will travel on the next van.',
  'The depot has updated the delivery note.',
  'The new delivery time is still unknown.'
];
export const evidence = [
  { line: 2, title: 'Road closure' },
  { line: 4, title: 'Next van' }
];
export const projects = ['client-studio', 'active-companion', 'faultline'];
export const verbs = [
  ['ask', 'review', 'approve', 'activate'],
  transcript.map((_, i) => String(i+1)),
  ['send', 'lose', 'retry', 'retry --key']
];
const captions = [
  ['Ask “What is the API batch limit?” to find the matching excerpt.',
   '“What is the API batch limit?” → “up to 50 records”.',
   'The reviewer checks “up to 50 records” against source v2.',
   'The exact excerpt is approved and ready to activate.',
   'The answer is frozen in a snapshot of source v2.'],
  [],
  ['Send a request to store a receipt at the receiver.',
   'The receiver saves a receipt for the request.',
   'The reply is lost. The sender cannot tell the receipt exists.',
   'Retrying without the key creates a duplicate receipt.',
   'The same key returns the saved receipt. No duplicate is created.']
];
const periods = [3.4, 2.65, 3.5];
const offsets = [4.9, 5.9, 1.8];
export function viewAt(index, time) {
  const clock = time + offsets[index];
  const step = Math.floor(clock / periods[index]) % verbs[index].length + 1;
  return {step, age:clock % periods[index], mode:'auto'};
}
export function caption(index, step) {
  if (index !== 1) return captions[index][step];
  const card=evidence.find(c=>c.line===step);
  if(card)return '“'+card.title+'” becomes a card linked to transcript line '+step+'.';
  return 'Reading line ' + step + ' · “' + transcript[step-1] + '”';
}
export function newBench() {
  const lanes = projects.map(() => ({mode:'auto', step:0, started:0}));
  const receipts = new Map();
  let sequence = 0, duplicates = 0, currentKey, returnedReceipt;
  function apply(index, verb, time) {
    const lane = lanes[index], target = verbs[index].indexOf(verb)+1;
    if (!target) return false;
    if (index===0 && target!==1 && (lane.mode==='auto' || target!==lane.step+1)) return false;
    if (index===2) {
      if (target===1) {
        currentKey = 'request-' + ++sequence;
        receipts.set(currentKey, { id:receipts.size+1, key:currentKey });
        returnedReceipt=null;lane.duplicate=false;
      } else if (!currentKey || (target===2 && lane.step!==1) || (target>2 && lane.step<2)) return false;
      else if (target===3) {
        receipts.set('duplicate-' + ++duplicates, { id:receipts.size+1, key:null });
        lane.duplicate=true;
      } else if (target===4) returnedReceipt=receipts.get(currentKey);
    }
    Object.assign(lane,{mode:'manual',step:target,started:time});
    return true;
  }
  function begin(index,time) {
    const lane=lanes[index];
    if(index===1 && lane.mode==='manual' && lane.step<transcript.length)lane.started=time;
    else apply(index,verbs[index][0],time);
    lane.mode='play';
  }
  function view(index,time,still=false) {
    const lane=lanes[index];
    if (lane.mode==='auto') return viewAt(index,still?2:time);
    if (lane.mode==='play') {
      while (lane.mode==='play' && time-lane.started >= periods[index]) {
        if (lane.step===verbs[index].length) lane.mode='manual';
        else {
          apply(index,verbs[index][lane.step],lane.started+periods[index]);
          lane.mode='play';
        }
      }
    }
    return {mode:lane.mode,step:lane.step,age:still?3:Math.max(0,time-lane.started),duplicate:lane.duplicate,returnedId:index===2&&lane.step===4?returnedReceipt?.id:null};
  }
  return {lanes,apply,begin,view,counts:()=>[receipts.size,duplicates]};
}
