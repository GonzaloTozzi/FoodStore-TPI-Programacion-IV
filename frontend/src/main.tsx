
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import App from './App.tsx'
import ThemeProvider from '@/shared/components/ThemeProvider'

import { setupInterceptors } from '@/shared/api/setupInterceptors'

// Registrar los interceptores una sola vez
setupInterceptors()

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>  
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
