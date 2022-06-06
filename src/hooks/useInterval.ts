import { useEffect, useRef } from "react"

const useInterval = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const timeId = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(timeId)
  }, [delay])
}

export default useInterval
