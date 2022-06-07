import React from "react"
import "./App.css"
import Footer from "./components/Footer/Footer"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Explorer from "./pages/Explorer/Explorer"
import Register from "./pages/Register/Register"
import SearchedExplorer from "./pages/SearchedExplorer/SearchedExplorer"

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explorer/*" element={<Explorer />} />
          <Route path="/search" element={<SearchedExplorer />} />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
