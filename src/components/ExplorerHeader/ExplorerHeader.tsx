import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

const ExplorerHeader = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const handleInputQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const onClickSearch = useCallback(() => {
    navigate("?q=" + query)
  }, [query, navigate])

  return (
    <header>
      <input
        type="text"
        value={query}
        onChange={handleInputQuery}
        placeholder="Enter a keyword to search"
      />
      <button onClick={onClickSearch}>Search</button>
    </header>
  )
}

export default ExplorerHeader
