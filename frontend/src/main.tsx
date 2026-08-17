import { Component, StrictMode, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css'
import App from './app/App'
import { AuthProvider } from './context/AuthContext'

class AppErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 text-center">
          <div className="max-w-md space-y-3">
            <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-600">Please reload the page. Your session remains protected by the server.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"
            >
              Reload application
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
