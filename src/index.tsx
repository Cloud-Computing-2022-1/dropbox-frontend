import React from "react"
import ReactDOM from "react-dom/client"
import "antd/dist/antd.min.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import axios from "axios"

axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = "csrftoken"
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.baseURL = "http://localhost:8000/"
axios.interceptors.request.use((config) => {
  if (config.url && config.url[config.url.length - 1] !== "/") {
    config.url += "/"
  }
  return config
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
