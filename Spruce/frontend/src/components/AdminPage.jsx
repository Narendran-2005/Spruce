import React, { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import { 
  Shield, 
  Activity, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Server,
  Users,
  MessageSquare,
  Key,
  Clock
} from 'lucide-react'

function AdminPage() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchData()
    
    if (autoRefresh) {
      const interval = setInterval(() => {
          fetchData()
        }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch logs and stats in parallel
      const [logsResponse, statsResponse] = await Promise.all([
        apiService.getLogs(100),
        apiService.getStats()
      ])
      
      if (logsResponse.success) {
        setLogs(logsResponse.logs)
      }
      
      if (statsResponse.success) {
        setStats(statsResponse)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the system? This will clear all data.')) {
      try {
        await apiService.resetSystem()
        await fetchData()
      } catch (error) {
        console.error('Failed to reset system:', error)
      }
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getLogLevel = (logEntry) => {
    if (logEntry.includes('[HANDSHAKE]')) return 'handshake'
    if (logEntry.includes('[SIGNATURE]')) return 'signature'
    if (logEntry.includes('[SESSION]')) return 'session'
    if (logEntry.includes('[MESSAGE]')) return 'message'
    if (logEntry.includes('[CRYPTO]')) return 'crypto'
    return 'info'
  }

  const getLogIcon = (level) => {
    switch (level) {
      case 'handshake':
        return <Key className="h-4 w-4 text-yellow-400" />
      case 'signature':
        return <Shield className="h-4 w-4 text-blue-400" />
      case 'session':
        return <Activity className="h-4 w-4 text-green-400" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-400" />
      case 'crypto':
        return <Key className="h-4 w-4 text-cyan-400" />
      default:
        return <Server className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-quantum-900">
      {/* Header */}
      <div className="bg-quantum-800 border-b border-quantum-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-spruce-400" />
            <div>
              <h1 className="text-xl font-bold text-quantum-100">Spruce Admin Console</h1>
              <p className="text-sm text-quantum-400">System Monitoring & Logs</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-quantum-300">
                Auto Refresh
              </label>
            </div>
            
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleReset}
              className="btn-secondary bg-red-600 hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset System</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Stats Sidebar */}
        <div className="w-80 bg-quantum-800 border-r border-quantum-700 p-6">
          <div className="space-y-6">
            {/* System Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-quantum-100 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Statistics
              </h3>
              
              {stats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-quantum-300">Total Messages:</span>
                    <span className="text-sm font-medium text-spruce-400">
                      {stats.totalMessages || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-quantum-300">Total Handshakes:</span>
                    <span className="text-sm font-medium text-spruce-400">
                      {stats.totalHandshakes || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-quantum-300">Active Users:</span>
                    <span className="text-sm font-medium text-spruce-400">
                      {Object.keys(stats.messageQueues || {}).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-quantum-300">Last Updated:</span>
                    <span className="text-xs text-quantum-500">
                      {formatTimestamp(stats.timestamp)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-quantum-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spruce-400 mx-auto"></div>
                  <p className="mt-2 text-sm">Loading stats...</p>
                </div>
              )}
            </div>

            {/* Message Queues */}
            {stats?.messageQueues && Object.keys(stats.messageQueues).length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-quantum-100 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Message Queues
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(stats.messageQueues).map(([user, count]) => (
                    <div key={user} className="flex items-center justify-between text-sm">
                      <span className="text-quantum-300">{user}</span>
                      <span className="text-spruce-400 font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Handshake Queues */}
            {stats?.handshakeQueues && Object.keys(stats.handshakeQueues).length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-quantum-100 mb-4 flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Handshake Queues
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(stats.handshakeQueues).map(([user, count]) => (
                    <div key={user} className="flex items-center justify-between text-sm">
                      <span className="text-quantum-300">{user}</span>
                      <span className="text-yellow-400 font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logs Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-quantum-800 border-b border-quantum-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-quantum-100 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                System Logs
              </h2>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-quantum-400">
                  {logs.length} entries
                </span>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-quantum-400" />
                  <span className="text-sm text-quantum-400">
                    {autoRefresh ? 'Auto-refreshing' : 'Manual refresh'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Display */}
          <div className="flex-1 overflow-y-auto p-6">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Server className="h-12 w-12 text-quantum-600 mx-auto mb-4" />
                  <p className="text-quantum-400">No logs available</p>
                  <p className="text-quantum-500 text-sm">System logs will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((logEntry, index) => {
                  const level = getLogLevel(logEntry)
                  const icon = getLogIcon(level)
                  
                  return (
                    <div
                      key={index}
                      className="terminal flex items-start space-x-3 p-3 hover:bg-quantum-800 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-quantum-200 text-sm break-all">
                          {logEntry}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage








