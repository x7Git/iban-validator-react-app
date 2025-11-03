import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="relative z-10">
              <App />
          </div>
      </main>
  </StrictMode>,
)
