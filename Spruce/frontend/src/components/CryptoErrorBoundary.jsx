import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class CryptoErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Crypto Error Boundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Clear crypto state
    localStorage.removeItem('spruce_session_components')
    localStorage.removeItem('spruce_private_keys')
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-quantum-900 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-300 mb-2">
                Cryptographic Error
              </h2>
              <p className="text-red-200 mb-4">
                A cryptographic operation failed. This could be due to:
              </p>
              <ul className="text-sm text-red-300 text-left mb-6 space-y-1">
                <li>• Session key mismatch</li>
                <li>• Invalid encryption parameters</li>
                <li>• Corrupted session data</li>
              </ul>
              <button
                onClick={this.handleReset}
                className="btn-primary flex items-center justify-center space-x-2 mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset & Reload</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default CryptoErrorBoundary
