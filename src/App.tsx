import React from "react"
import "./App.css"
import Footer from "./components/Footer/Footer"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Explorer from "./pages/Explorer/Explorer"
import Register from "./pages/Register/Register"

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explorer/*" element={<Explorer />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
