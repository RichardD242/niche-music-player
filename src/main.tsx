import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Tutorial from './Tutorial.tsx'
import Info from './Info.tsx'

const path = window.location.pathname;
const page = path === '/tutorial' ? 'tutorial' : path === '/info' ? 'info' : 'app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page === 'tutorial' ? <Tutorial /> : page === 'info' ? <Info /> : <App />}
  </StrictMode>,
)
