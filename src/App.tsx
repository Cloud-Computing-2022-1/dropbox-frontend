import React from "react"
import "./App.css"
import Footer from "./components/Footer/Footer"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Main from "./pages/Main/Main"
import Register from "./pages/Register/Register"

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
