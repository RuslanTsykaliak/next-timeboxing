export type TimerT = {
  id: number,
  name: string,
  duration: number, // in seconds
  remaining: number,
  active: boolean,
}

export type TimerGroupT = {
  id: number,
  name: string,
  timers: TimerT[],
}