"use client"
import { useEffect, useState } from "react";

import { TimerGroupT } from "@/app/types/timer";
import { successSchedule } from "./data/timers";


export default function Home() {
  // const [isAudioMute, setAudioMute] = useState(false)
  const [playingSound, setPlayingSound] = useState<HTMLAudioElement | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerHours, setNewTimerHours] = useState(0);
  const [newTimerMinutes, setNewTimerMinutes] = useState(0);
  const [newTimerSeconds, setNewTimerSeconds] = useState(0);

  const initialTimerGroups = Array.isArray(successSchedule) ? successSchedule : [];


  const getInitialTimerGroups = () => {
    if (typeof window !== 'undefined') {
      const storedTimerGroups = JSON.parse(localStorage.getItem('timerGroups') || '[]');
      if (storedTimerGroups.length === 0) {
        localStorage.setItem('timerGroups', JSON.stringify(initialTimerGroups));
        return initialTimerGroups;
      } else {
        return storedTimerGroups;
      }
    } else {
      return initialTimerGroups;
    }
  }

  const [timerGroups, setTimerGroups] = useState<TimerGroupT[]>(getInitialTimerGroups)

  useEffect(() => {
    localStorage.setItem('timerGroups', JSON.stringify(timerGroups));
  }, [timerGroups]);

  ////
  const addGroup = () => {
    setTimerGroups([...timerGroups, { id: Date.now(), name: newGroupName, timers: [] }]);
    setNewGroupName('');
  };

  const addTimer = (groupId: number) => {
    const duration = newTimerHours * 3600 + newTimerMinutes * 60 + newTimerSeconds;
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: [...group.timers, { id: Date.now(), name: newTimerName, duration, remaining: duration, active: false }]
    } : group));
    setNewTimerName('');
    setNewTimerHours(0);
    setNewTimerMinutes(0);
    setNewTimerSeconds(0);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = (groupId: number, timerId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.map(timer => timer.id === timerId ? { ...timer, active: true } : timer)
    } : group));
  };

  const stopTimer = (groupId: number, timerId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.map(timer => timer.id === timerId ? { ...timer, active: false } : timer)
    } : group))
  };

  const resetTimer = (groupId: number, timerId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.map(timer => timer.id === timerId ? { ...timer, remaining: timer.duration, active: false } : timer)
    } : group))
  }

  const startGroup = (groupId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.map((timer, index) => ({ ...timer, active: index === 0 }))
    } : group));
  };

  const stopGroup = (groupId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.map(timer => ({ ...timer, active: false }))
    } : group))
  }

  const resetGroup = (groupId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.map(timer => ({ ...timer, remaining: timer.duration, active: false }))
    } : group));
  };

  const removeGroup = (groupId: number) => {
    setTimerGroups(timerGroups.filter(group => group.id !== groupId));
  };

  const removeTimer = (groupId: number, timerId: number) => {
    setTimerGroups(timerGroups.map(group => group.id === groupId ? {
      ...group,
      timers: group.timers.filter(timer => timer.id !== timerId)
    } : group));
  };




  useEffect(() => {
    // Load the sound
    const sound = new Audio(
      "/sounds/536421__rudmer_rotteveel__setting-electronic-timer-multiple-beeps.mp3"
    );

    const interval = setInterval(() => {
      setTimerGroups(timerGroups.map(group => ({
        ...group,
        timers: group.timers.map((timer, index, timers) => {
          if (timer.active && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          } else if (timer.active && timer.remaining === 0) {
            // Stop the currently playing sound
            if (playingSound) {
              playingSound.pause();
              playingSound.currentTime = 0;
            }
            // Start a new sound
            sound.play();
            setPlayingSound(sound);
            return { ...timer, active: false };
          } else if (!timer.active && timers[index - 1]?.remaining === 0) {
            return { ...timer, active: true };
          } else {
            return timer;
          }
        })
      })));
    }, 1000);

    return () => {
      clearInterval(interval);
      if (playingSound) {
        playingSound.pause();
        playingSound.currentTime = 0;
      }
    };
  }, [timerGroups, playingSound]);





  return (
    <main className="p-4">
      <h1 className="text-4xl mb-4">Next Timeboxing</h1>
      <div>
        {/* <button onClick={() => setAudioMute(!isAudioMute)}>
          {isAudioMute ? "Unmute" : "Mute"}
        </button> */}
      </div>
      <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="New group name" />

      <button type="button" onClick={addGroup}>Add Group</button>
      {timerGroups.map((group) => (
        <div key={group.id} className="mb-4">
          <h2 className="text-2xl mb-2">{group.name}</h2>
          <button type="button" onClick={() => startGroup(group.id)}>
            Start Group
          </button>
          <button type="button" onClick={() => stopGroup(group.id)} >
            Stop Group
          </button>
          <button type="button" onClick={() => resetGroup(group.id)} >
            Reset Group
          </button>
          <button type="button" onClick={() => removeGroup(group.id)} >
            Remove Group
          </button>

          <input value={newTimerName} onChange={(e) => setNewTimerName(e.target.value)} placeholder="New timer name" />
          <input type="number" value={newTimerHours} onChange={(e) => setNewTimerHours(Number(e.target.value))} placeholder="Hours" />
          <input type="number" value={newTimerMinutes} onChange={(e) => setNewTimerMinutes(Number(e.target.value))} placeholder="Minutes" />
          <input type="number" value={newTimerSeconds} onChange={(e) => setNewTimerSeconds(Number(e.target.value))} placeholder="Seconds" />

          <button type="button" onClick={() => addTimer(group.id)}>Add Timer</button>
          {group.timers.map((timer) => (
            <div key={timer.id} className="mb-2">
              <h3 className="text-xl">{timer.name}</h3>
              <p>Duration: {formatTime(timer.duration)}</p>
              <p>Remaining: {formatTime(timer.remaining)}</p>

              <button type="button" onClick={() => startTimer(group.id, timer.id)}>Start Timer</button>
              <button type="button" onClick={() => stopTimer(group.id, timer.id)}>
                Stop Timer
              </button>
              <button type="button" onClick={() => resetTimer(group.id, timer.id)}>
                Reset Timer
              </button>
              <button type="button" onClick={() => removeTimer(group.id, timer.id)}>
                Remove Timer
              </button>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}