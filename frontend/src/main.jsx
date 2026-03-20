import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles/toast.css";
import "./styles/navbar.css";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" />
  </StrictMode>,
)
