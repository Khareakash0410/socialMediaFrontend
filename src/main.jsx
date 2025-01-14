import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserState from './context/UserState.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserState>
    <App />
  </UserState>,
)
