// data/timers.ts
import { TimerT, TimerGroupT } from '../types/timer';

const defaultTimers: TimerT[] = [
  { id: 1, name: "Deep Work", duration: 30 * 60, remaining: 30 * 60, active: false },
  { id: 2, name: "Short Break", duration: 5 * 60, remaining: 5 * 60, active: false },
  { id: 3, name: "Deep Work", duration: 30 * 60, remaining: 30 * 60, active: false },
  { id: 4, name: "Long Break", duration: 15 * 60, remaining: 15 * 60, active: false },
  { id: 5, name: "Deep Work", duration: 30 * 60, remaining: 30 * 60, active: false },
  { id: 6, name: "Short Break", duration: 5 * 60, remaining: 5 * 60, active: false },
  { id: 7, name: "Deep Work", duration: 30 * 60, remaining: 30 * 60, active: false },
];

export const successSchedule: TimerGroupT = {
  id: 1,
  name: "2-Hour Success Schedule",
  timers: defaultTimers,
};
