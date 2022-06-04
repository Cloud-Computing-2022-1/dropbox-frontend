import { sha256 } from "js-sha256"
import React, { useState } from "react"
import { Link } from "react-router-dom"

const Register = () => {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onClickRegister = () => {
    console.log(id, sha256(password + sha256(id)), "are pushed")
  }

  return (
    <div className="RegisterBox">
      <h2>Register</h2>
      <input type="text" value={id} onChange={handleId} placeholder="ID" />
      <input
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="Password"
      />
      <button onClick={onClickRegister}>Register</button>
      <Link to="/login">Back to the Login</Link>
    </div>
  )
}

export default Register
