import axios, { AxiosResponse } from "axios"
import { sha256 } from "js-sha256"
import React, { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Modal from "../../components/Modal/Modal"

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
    <div className="RegisterBox">
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={handleEmail}
        placeholder="Email"
      />
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
      <button onClick={onClickRegister}>Register</button>
      <Link to="/login">Back to the Login</Link>
      <Modal isOpened={isModalOpened} close={closeModal}>
        <div>Success!</div>
        <div>Go back to the login page</div>
      </Modal>
    </div>
  )
}

export default Register
