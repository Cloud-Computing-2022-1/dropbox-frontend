import { RollbackOutlined, UserAddOutlined } from "@ant-design/icons"
import { Button, Input, Modal, Typography } from "antd"
import axios, { AxiosResponse } from "axios"
import { sha256 } from "js-sha256"
import React, { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface RegisterRequest {
  username: string
  password: string
  email: string
}

interface RegisterResponse {
  Status: string
  Username: string
}

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isModalOpened, setModalOpened] = useState(false)

  const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

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

  const closeModal = useCallback(() => {
    setModalOpened(false)
    navigate("/login")
  }, [navigate])

  const onClickRegister = useCallback(() => {
    const req: RegisterRequest = {
      email: email,
      username: username,
      password: sha256(password + sha256(username)),
    }
    if (req.username && req.password) {
      axios
        .post("user", req)
        .then((res: AxiosResponse<RegisterResponse>) => {
          if (res.data.Status === "Success") {
            setModalOpened(true)
          }
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    }
  }, [email, username, password])

  return (
    <div style={{ width: "30%", margin: "3em auto" }}>
      <Typography.Title level={2}>Register</Typography.Title>
      <Input
        type="email"
        value={email}
        onChange={handleEmail}
        placeholder="Email"
        required
      />
      <Input
        type="text"
        value={username}
        onChange={handleUsername}
        placeholder="Username"
        required
        style={{ margin: "1em 0" }}
      />
      <Input
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="Password"
        required
        style={{ margin: "0 0 1em" }}
      />
      <Button
        onClick={onClickRegister}
        icon={<UserAddOutlined />}
        style={{ width: "40%", margin: "0 0.5em 0 0" }}
      >
        Register
      </Button>
      <Link to="/login" style={{ width: "max-content" }}>
        <Button icon={<RollbackOutlined />} style={{ width: "40%" }}>
          Get Back
        </Button>
      </Link>
      <Modal
        title="Register"
        visible={isModalOpened}
        onCancel={closeModal}
        footer={null}
      >
        <Typography.Text>Success! Go back to the login page.</Typography.Text>
      </Modal>
    </div>
  )
}

export default Register
