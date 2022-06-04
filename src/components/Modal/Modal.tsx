import React from "react"

interface Props {
  children: React.ReactNode
  close: () => void
  isOpened: boolean
}

const Modal = ({ children, close, isOpened }: Props) => {
  return (
    <div className={isOpened ? "Modal Opened" : "Modal Closed"}>
      {isOpened ? (
        <div>
          <button onClick={close}>X</button>
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default Modal
