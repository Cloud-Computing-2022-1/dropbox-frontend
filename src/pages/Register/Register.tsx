import axios, { AxiosResponse } from "axios"
import { sha256 } from "js-sha256"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Modal from "../../components/Modal/Modal"
import { SERVER_URL } from "../../constants"

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

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const closeModal = () => {
    setModalOpened(false)
    navigate("/login")
  }

  const onClickRegister = () => {
    const req: RegisterRequest = {
      email: email,
      username: username,
      password: sha256(password + sha256(username)),
    }
    if (req.username && req.password) {
      axios
        .post(SERVER_URL + "user", req)
        .then((res: AxiosResponse<RegisterResponse>) => {
          if (res.data.Status === "Success") {
            setModalOpened(true)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

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
