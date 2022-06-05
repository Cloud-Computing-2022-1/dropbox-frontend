import axios, { AxiosResponse } from "axios"
import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SERVER_URL } from "../../constants"

interface LogoutResponse {
  Status: string
  Username: string
}

const ExplorerHeader = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const handleInputQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const onClickSearch = useCallback(() => {
    if (query !== "") {
      navigate("/search?q=" + query)
    }
  }, [query, navigate])

  const onClickLogout = useCallback(() => {
    axios
      .post(SERVER_URL + "logout")
      .then((res: AxiosResponse<LogoutResponse>) => {
        if (res.data.Status && res.data.Status === "Success") {
          navigate("/login")
        }
      })
    // logout anyway
    // navigate("/login")
  }, [navigate])

  return (
    <header>
      <button onClick={() => navigate(-1)}>← Back</button>
      <input
        type="text"
        value={query}
        onChange={handleInputQuery}
        placeholder="Enter a keyword to search"
      />
      <button onClick={onClickSearch}>Search</button>
      <button onClick={onClickLogout}>Logout</button>
    </header>
  )
}

export default ExplorerHeader
