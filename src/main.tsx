import { Theme } from '@radix-ui/themes'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme accentColor="blue">
      <App />
    </Theme>
  </StrictMode>,
)
