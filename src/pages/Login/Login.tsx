import { sha256 } from "js-sha256"
import React, { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onClickLogin = () => {
    console.log(id, sha256(password + sha256(id)), "are pushed")
  }

  return (
    <div className="LoginBox">
      <h2>Login</h2>
      <input type="text" value={id} onChange={handleId} placeholder="ID" />
      <input
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="Password"
      />
      <button onClick={onClickLogin}>Login</button>
      <Link to="/register">Register</Link>
    </div>
  )
}

export default Login
