import { LoginOutlined, UserAddOutlined } from "@ant-design/icons"
import { Button, Input, Typography } from "antd"
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
          // To ignore blank error
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
    <div style={{ width: "30%", margin: "3em auto" }}>
      <Typography.Title level={2}>Login</Typography.Title>
      <Input
        type="text"
        value={username}
        onChange={handleUsername}
        placeholder="Username"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="Password"
        required
        style={{ margin: "1em 0" }}
      />
      <Button
        onClick={onClickLogin}
        icon={<LoginOutlined />}
        style={{ width: "40%", margin: "0 0.5em 0 0" }}
      >
        Login
      </Button>
      <Link to="/register" style={{ width: "max-content" }}>
        <Button icon={<UserAddOutlined />} style={{ width: "40%" }}>
          Register
        </Button>
      </Link>
    </div>
  )
}

export default Login
