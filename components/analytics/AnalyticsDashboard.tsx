'use client'

import { useEffect, useState } from 'react'
// Simple card components for analytics dashboard
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow border ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

interface AnalyticsData {
  pageViews: number
  uniqueUsers: number
  adRevenue: number
  conversionRate: number
  topPages: Array<{ page: string; views: number }>
  revenueBySource: Array<{ source: string; revenue: number }>
  userJourney: Array<{ stage: string; users: number; conversionRate: number }>
}

interface AnalyticsDashboardProps {
  className?: string
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would call your analytics API
      // For now, we'll simulate data
      const mockData: AnalyticsData = {
        pageViews: 45230,
        uniqueUsers: 12450,
        adRevenue: 847.35,
        conversionRate: 3.2,
        topPages: [
          { page: '/recetas/pollo-keto-mantequilla', views: 5420 },
          { page: '/recetas/pan-keto-sin-harinas', views: 4890 },
          { page: '/recetas/brownies-keto-chocolate', views: 4320 },
          { page: '/blog/beneficios-dieta-keto', views: 3850 },
          { page: '/menu-keto-semanal-completo', views: 3650 }
        ],
        revenueBySource: [
          { source: 'AdSense', revenue: 547.20 },
          { source: 'Libros Digitales', revenue: 234.50 },
          { source: 'Productos Afiliados', revenue: 65.65 }
        ],
        userJourney: [
          { stage: 'Visitantes', users: 12450, conversionRate: 100 },
          { stage: 'Usuarios Comprometidos', users: 3890, conversionRate: 31.2 },
          { stage: 'Suscriptores Newsletter', users: 1240, conversionRate: 10.0 },
          { stage: 'Compradores', users: 156, conversionRate: 1.25 }
        ]
      }
      
      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No hay datos disponibles</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`analytics-dashboard space-y-6 ${className}`}>
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Páginas Vistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+12.5% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuarios Únicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+8.3% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos AdSense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{analyticsData.adRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600 mt-1">+15.7% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tasa de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-blue-600 mt-1">+0.8% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Páginas Más Visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                  <span className="text-sm">{page.page}</span>
                </div>
                <span className="text-sm font-medium">{page.views.toLocaleString()} vistas</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Fuente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.revenueBySource.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm">{source.source}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€{source.revenue.toFixed(2)}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-green-600 rounded-full" 
                        style={{ 
                          width: `${(source.revenue / analyticsData.adRevenue) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Journey Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Embudo de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.userJourney.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{stage.stage}</span>
                    <span className="text-sm font-medium">
                      {stage.users.toLocaleString()} ({stage.conversionRate.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div 
                      className={`h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stage.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-medium">Excelente rendimiento de recetas keto</h4>
                <p className="text-sm text-gray-600">Las recetas de pollo y pan keto están generando el mayor tráfico y engagement. Considera crear más contenido similar.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-medium">Oportunidad de mejora en conversión</h4>
                <p className="text-sm text-gray-600">La tasa de conversión de visitantes a suscriptores puede mejorarse con pop-ups estratégicos y lead magnets.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-medium">AdSense optimización disponible</h4>
                <p className="text-sm text-gray-600">Los anuncios en páginas de recetas están funcionando bien. Considera agregar más unidades en el contenido del blog.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Export utility functions for analytics
export const AnalyticsHelpers = {
  // Calculate RPM (Revenue Per Mille)
  calculateRPM: (revenue: number, impressions: number): number => {
    return (revenue / impressions) * 1000
  },

  // Calculate CTR (Click Through Rate)
  calculateCTR: (clicks: number, impressions: number): number => {
    return (clicks / impressions) * 100
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  // Format percentage
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`
  }
}