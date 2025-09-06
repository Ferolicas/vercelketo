'use client'

import { memo, useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, BarChart3, Settings, RefreshCw, AlertCircle } from 'lucide-react'

interface AdPerformanceData {
  position: string
  slot: string
  impressions: number
  clicks: number
  ctr: number
  revenue: number
  viewability: number
  rpm: number
  fillRate: number
  lastUpdated: string
}

interface DashboardProps {
  className?: string
  refreshInterval?: number
  showControls?: boolean
}

const mockPerformanceData: AdPerformanceData[] = [
  {
    position: 'header',
    slot: 'header-banner',
    impressions: 12450,
    clicks: 156,
    ctr: 1.25,
    revenue: 23.45,
    viewability: 89,
    rpm: 1.88,
    fillRate: 94,
    lastUpdated: '2025-09-06T10:30:00Z'
  },
  {
    position: 'sidebar',
    slot: 'sidebar-vertical',
    impressions: 8930,
    clicks: 201,
    ctr: 2.25,
    revenue: 34.67,
    viewability: 76,
    rpm: 3.88,
    fillRate: 87,
    lastUpdated: '2025-09-06T10:30:00Z'
  },
  {
    position: 'content-middle',
    slot: 'content-rectangle',
    impressions: 15670,
    clicks: 298,
    ctr: 1.90,
    revenue: 45.23,
    viewability: 92,
    rpm: 2.89,
    fillRate: 96,
    lastUpdated: '2025-09-06T10:30:00Z'
  },
  {
    position: 'mobile-sticky',
    slot: 'mobile-banner',
    impressions: 23890,
    clicks: 597,
    ctr: 2.50,
    revenue: 67.89,
    viewability: 85,
    rpm: 2.84,
    fillRate: 91,
    lastUpdated: '2025-09-06T10:30:00Z'
  }
]

function AdSensePerformanceDashboard({ 
  className = '', 
  refreshInterval = 300000, // 5 minutos
  showControls = true 
}: DashboardProps) {
  const [performanceData, setPerformanceData] = useState<AdPerformanceData[]>(mockPerformanceData)
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto refresh data
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // En producción, aquí se llamaría a la API de AdSense
      // const response = await fetch('/api/adsense/performance')
      // const data = await response.json()
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular nuevos datos con variaciones aleatorias
      const updatedData = mockPerformanceData.map(item => ({
        ...item,
        impressions: item.impressions + Math.floor(Math.random() * 100),
        clicks: item.clicks + Math.floor(Math.random() * 10),
        ctr: Number((item.ctr + (Math.random() - 0.5) * 0.2).toFixed(2)),
        revenue: Number((item.revenue + Math.random() * 2).toFixed(2)),
        viewability: Math.max(70, Math.min(95, item.viewability + Math.floor((Math.random() - 0.5) * 10))),
        lastUpdated: new Date().toISOString()
      }))

      setPerformanceData(updatedData)
      setLastRefresh(new Date())
      
      // Enviar a analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'adsense_dashboard_refresh', {
          event_category: 'monetization',
          event_label: 'performance_data_updated'
        })
      }
      
    } catch (error) {
      console.error('Error refreshing AdSense data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalMetrics = performanceData.reduce((acc, item) => ({
    impressions: acc.impressions + item.impressions,
    clicks: acc.clicks + item.clicks,
    revenue: acc.revenue + item.revenue
  }), { impressions: 0, clicks: 0, revenue: 0 })

  const averageCTR = totalMetrics.impressions > 0 
    ? (totalMetrics.clicks / totalMetrics.impressions * 100).toFixed(2)
    : '0.00'

  const averageRPM = totalMetrics.impressions > 0
    ? (totalMetrics.revenue / totalMetrics.impressions * 1000).toFixed(2)
    : '0.00'

  const getTrendColor = (value: number, threshold: number) => {
    if (value >= threshold * 1.1) return 'text-green-600'
    if (value <= threshold * 0.9) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              AdSense Performance
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Última actualización: {lastRefresh.toLocaleTimeString('es-ES')}
            </p>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="1h">Última hora</option>
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
              </select>
              
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={autoRefresh ? 'Desactivar auto-refresh' : 'Activar auto-refresh'}
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Actualizar datos"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Impresiones</p>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(totalMetrics.impressions)}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Clicks</p>
                <p className="text-2xl font-bold text-green-900">{formatNumber(totalMetrics.clicks)}</p>
              </div>
              <MousePointer className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">CTR</p>
                <p className="text-2xl font-bold text-purple-900">{averageCTR}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Ingresos</p>
                <p className="text-2xl font-bold text-orange-900">€{totalMetrics.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Posición</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Posición</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Impresiones</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Clicks</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">CTR</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">RPM</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Viewability</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((item, index) => (
                <tr key={item.position} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="capitalize font-medium text-gray-900">{item.position.replace('-', ' ')}</span>
                      <span className="ml-2 text-xs text-gray-500">({item.slot})</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900">{formatNumber(item.impressions)}</td>
                  <td className="text-right py-3 px-4 text-gray-900">{item.clicks}</td>
                  <td className={`text-right py-3 px-4 font-medium ${getTrendColor(item.ctr, 2.0)}`}>
                    {item.ctr}%
                  </td>
                  <td className={`text-right py-3 px-4 font-medium ${getTrendColor(item.rpm, 2.5)}`}>
                    €{item.rpm}
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        item.viewability >= 85 ? 'bg-green-500' : 
                        item.viewability >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className={getTrendColor(item.viewability, 80)}>{item.viewability}%</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-green-600">
                    €{item.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights y Recomendaciones</h3>
        
        <div className="space-y-3">
          {performanceData.map((item) => {
            const insights = []
            
            if (item.ctr > 2.5) {
              insights.push({
                type: 'success',
                message: `Excelente CTR en ${item.position.replace('-', ' ')} (${item.ctr}%)`
              })
            }
            
            if (item.viewability < 75) {
              insights.push({
                type: 'warning',
                message: `Baja viewability en ${item.position.replace('-', ' ')} (${item.viewability}%)`
              })
            }
            
            if (item.rpm > 3.0) {
              insights.push({
                type: 'success',
                message: `Alto RPM en ${item.position.replace('-', ' ')} (€${item.rpm})`
              })
            }
            
            return insights.map((insight, index) => (
              <div
                key={`${item.position}-${index}`}
                className={`flex items-center p-3 rounded-lg ${
                  insight.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <AlertCircle className={`w-4 h-4 mr-3 ${
                  insight.type === 'success' ? 'text-green-600' : 
                  insight.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <span className={`text-sm ${
                  insight.type === 'success' ? 'text-green-800' : 
                  insight.type === 'warning' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {insight.message}
                </span>
              </div>
            ))
          }).flat()}
          
          {performanceData.every(item => item.ctr > 2.0 && item.viewability > 80) && (
            <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <TrendingUp className="w-4 h-4 mr-3 text-blue-600" />
              <span className="text-sm text-blue-800">
                🎉 Excelente rendimiento general! Todos los anuncios superan los objetivos.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(AdSensePerformanceDashboard)