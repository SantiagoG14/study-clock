import { useRef, useState } from "react"

export const useCountDown = (): [
  number[],
  (toDeadLineSeconds: number) => void,
  (toDeadLineSeconds: number) => void,
  () => void
] => {
  const Ref = useRef<number | null>(null)
  const [timer, setTimer] = useState<number[]>([])

  const getTimeRemaining = (e: any) => {
    const total = Date.parse(e) - Date.parse(new Date().toString())
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / 1000 / 60 / 60) % 24)
    return {
      total,
      hours,
      minutes,
      seconds,
    }
  }

  const startTimer = (e: any) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e)
    // console.log(total, hours, minutes, seconds)
    if (total >= 0) {
      setTimer([total, hours, minutes, seconds])
    }
  }

  const clearTimer = (e: any) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      setTimer([total, hours, minutes, seconds])
    }

    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  const getDeadTime = (seconds = 60) => {
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + seconds)
    return deadline
  }

  const newTimer = (toDeadLineSeconds: number) => {
    resetTimer()
    startTimer(getDeadTime(toDeadLineSeconds))
  }

  const clearNewTimer = (toDeadLineSeconds: number) => {
    clearTimer(getDeadTime(toDeadLineSeconds))
  }

  const resetTimer = () => {
    clearNewTimer(0)
  }

  const pausetimer = () => {
    clearInterval(Ref.current)
  }

  return [timer, newTimer, clearNewTimer, pausetimer]
}
