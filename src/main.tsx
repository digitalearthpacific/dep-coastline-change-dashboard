import { Theme } from '@radix-ui/themes'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@radix-ui/themes/styles.css'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Theme accentColor="blue">
        <App />
      </Theme>
    </BrowserRouter>
  </StrictMode>,
)
