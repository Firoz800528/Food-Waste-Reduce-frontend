import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './hooks/useAuth.jsx'
import { DarkModeProvider } from './hooks/useDarkMode.jsx' // <--- import

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
)
