import { Children, useEffect, useRef, useState } from "react"
import { useCountDown } from "./useCountdown"
function App() {
  const [timerClearing, setTimerClearing] = useState(false)
  const [timer, newTimer, clearNewTimer, pauseTimer] = useCountDown()
  const [action, setAction] = useState("study")
  const [studyTime, setStudyTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [currentTime, setCurrentTime] = useState(25)
  const soundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    newTimer(studyTime * 60)
    setCurrentTime(studyTime * 60)
  }, [])

  function soundEnd() {
    if (action === "study") {
      setAction("break")
      clearNewTimer(breakTime * 60)
    } else {
      setAction("study")
      clearNewTimer(studyTime * 60)
    }
  }

  // useEffect(() => {
  //   soundRef.current?.addEventListener("ended", soundEnd)

  //   return () => soundRef.current?.removeEventListener("ended", soundEnd)
  // })

  useEffect(() => {
    if (!timerClearing) {
      return
    }

    if (timer.every((time) => time === 0)) {
      soundRef.current?.play()

      setTimeout(() => {
        if (action === "study") {
          setAction("break")
          clearNewTimer(breakTime * 60)
        } else {
          setAction("study")
          clearNewTimer(studyTime * 60)
        }
      }, 1000)

      // if (action === "study") {
      //   setAction("break")
      //   setTimeout(() => {
      //     clearNewTimer(breakTime * 60)
      //   }, 1000)
      // } else {
      //   setAction("study")
      //   setTimeout(() => {
      //     clearNewTimer(studyTime * 60)
      //   }, 1000)
      // }
    }
  }, [timer])

  useEffect(() => {
    if (action === "study") {
      setCurrentTime(studyTime * 60)
      newTimer(studyTime * 60)

      // currentTime.curre = studyTime * 60
    }
  }, [studyTime])

  useEffect(() => {
    if (action === "break") {
      setCurrentTime(breakTime * 60)
      newTimer(breakTime * 60)

      // currentTime.current = breakTime * 60
    }
  }, [breakTime])

  function increase(setTime: (value: React.SetStateAction<number>) => void) {
    // currentTime.current = currentTime.current + 60
    setTime((prev) => (prev + 1 > 60 ? prev : prev + 1))
  }

  function decrease(setTime: (value: React.SetStateAction<number>) => void) {
    // currentTime.current = currentTime.current - 60

    setTime((prev) => (prev - 1 <= 0 ? prev : prev - 1))
  }

  function start() {
    clearNewTimer(currentTime)
    setTimerClearing(true)
  }

  function pause() {
    if (timer[0] > 0) {
      setCurrentTime(timer[0] * 0.001)
      // currentTime.current = timer[0] * 0.001
      pauseTimer()
      setTimerClearing(false)
    }
  }

  function restart() {
    setStudyTime(25)
    setBreakTime(5)
    newTimer(studyTime * 60)
    setTimerClearing(false)
    setAction("study")
    soundRef.current?.pause()
    if (!soundRef.current) {
      throw new TypeError("there is no sound")
    }
    soundRef.current.currentTime = 0
  }

  return (
    <div className="App w-screen h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-xl flex flex-col">
        <h1
          id="timer-label"
          className=" text-3xl capitalize text-gray-900 text-center"
        >
          {action}
        </h1>
        <div
          id="time-left"
          className="text-6xl font-medium text-center mt-4 font-mono"
        >
          {timer[2] === 0 && timer[1] === 1
            ? "60:"
            : timer[2] === 0
            ? "00:"
            : timer[2] < 10
            ? "0" + timer[2] + ":"
            : timer[2] + ":"}
          {timer[3] === 0 ? "00" : timer[3] < 10 ? "0" + timer[3] : timer[3]}
        </div>
        <div className=" flex justify-around mt-4">
          <Time
            decrease={decrease}
            increase={increase}
            setTime={setStudyTime}
            time={studyTime}
            timeClearing={timerClearing}
            type="Study Time"
          />
          <Time
            decrease={decrease}
            increase={increase}
            setTime={setBreakTime}
            time={breakTime}
            timeClearing={timerClearing}
            type="Break Time"
          />
        </div>
        <button
          className={`py-2 px-6 mt-4 rounded-xl hover:-translate-y-1 text-yellow-50 capitalize m-auto transition-all ${
            timerClearing
              ? " bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/50 "
          }`}
          onClick={timerClearing ? pause : start}
          id="start_stop"
        >
          {timerClearing ? "pause" : "start"}
        </button>
        <audio
          ref={soundRef}
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>

        <button
          className="py-2 px-6 mt-16 rounded-xl bg-gray-400 mx-auto text-yellow-50"
          onClick={restart}
          id="reset"
        >
          restart
        </button>
      </div>
    </div>
  )
}

type time = {
  decrease: (setTime: React.Dispatch<React.SetStateAction<number>>) => void
  increase: (setTime: React.Dispatch<React.SetStateAction<number>>) => void
  setTime: React.Dispatch<React.SetStateAction<number>>
  time: number
  timeClearing: boolean
  type: string
}

function Time({ decrease, increase, time, setTime, timeClearing, type }: time) {
  return (
    <div className=" flex flex-col w-fit  py-4 px-2 rounded-sm">
      <p
        className=" font-medium"
        id={type === "Break Time" ? "break-label" : "session-label"}
      >
        {type}
      </p>
      <div className=" flex justify-between">
        <button
          onClick={() => decrease(setTime)}
          disabled={timeClearing}
          className="btn-change-time "
          id={type === "Break Time" ? "break-decrement" : "session-decrement"}
        >
          -
        </button>
        <div
          className=" font-mono text-lg"
          id={type === "Break Time" ? "break-length" : "session-length"}
        >
          {time}
        </div>
        <button
          onClick={() => increase(setTime)}
          disabled={timeClearing}
          className="btn-change-time "
          id={type === "Break Time" ? "break-increment" : "session-increment"}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default App
