import axios, { AxiosResponse } from "axios"
import { sha256 } from "js-sha256"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  Status: string
  Username: string
}

const ALREADY_LOGIN = "이미 로그인된 상태입니다."

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleUsername = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value)
    },
    []
  )

  const handlePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
    },
    []
  )

  const onClickLogin = useCallback(() => {
    const req: LoginRequest = {
      username: username,
      password: sha256(password + sha256(username)),
    }
    if (req.username && req.password) {
      axios
        .post("login", req)
        .then((res: AxiosResponse<LoginResponse | string>) => {
          if (typeof res.data === "string") {
            if (res.data === ALREADY_LOGIN) {
              navigate("/explorer/")
            }
          } else if (res.data.Status === "Success") {
            navigate("/explorer/")
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [username, password, navigate])

  useEffect(() => {
    // To check if a httpOnly cookie already exists
    const reqTemp: LoginRequest = {
      username: "",
      password: "",
    }
    axios
      .post("login", reqTemp)
      .then((res: AxiosResponse<LoginResponse | string>) => {
        if (typeof res.data === "string" && res.data === ALREADY_LOGIN) {
          navigate("/explorer/")
        }
      })
  }, [navigate])

  return (
    <div className="LoginBox">
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={handleUsername}
        placeholder="Username"
      />
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
