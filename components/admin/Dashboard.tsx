'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  onOpenModal: (modalId: string) => void;
}

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  totalBannerClicks: number;
  todayBannerClicks: number;
  totalButtonClicks: number;
  todayButtonClicks: number;
  totalPosts: number;
  totalProducts: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: { page: string; visits: number; change: number }[];
  recentActivity: { type: string; description: string; time: string }[];
}

export default function Dashboard({ onOpenModal }: DashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    // Simular datos de analytics - en producción esto vendría de tu API
    const mockData: AnalyticsData = {
      totalVisits: 12847,
      todayVisits: 342,
      totalBannerClicks: 1283,
      todayBannerClicks: 28,
      totalButtonClicks: 2156,
      todayButtonClicks: 45,
      totalPosts: 127,
      totalProducts: 24,
      bounceRate: 32.5,
      avgSessionDuration: '3m 42s',
      topPages: [
        { page: '/recetas/pan-keto', visits: 1247, change: 12.3 },
        { page: '/servicios', visits: 892, change: -2.1 },
        { page: '/recetas/pizza-keto', visits: 756, change: 8.7 },
        { page: '/', visits: 634, change: 15.2 },
        { page: '/recetas/postres-keto', visits: 523, change: -5.4 },
      ],
      recentActivity: [
        { type: 'visit', description: 'Nueva visita desde México', time: '2 min' },
        { type: 'click', description: 'Click en banner superior', time: '5 min' },
        { type: 'visit', description: 'Nueva visita desde España', time: '8 min' },
        { type: 'click', description: 'Click en "Ver Recetas"', time: '12 min' },
        { type: 'visit', description: 'Nueva visita desde Argentina', time: '15 min' },
      ]
    };

    setAnalyticsData(mockData);
  }, [dateRange]);

  if (!analyticsData) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const quickActions = [
    { id: 'create-post', name: 'Crear Post', icon: DocumentTextIcon, color: 'bg-blue-500' },
    { id: 'edit-web', name: 'Modificar Web', icon: ChartBarIcon, color: 'bg-green-500' },
    { id: 'create-product', name: 'Crear Producto', icon: ShoppingCartIcon, color: 'bg-purple-500' },
    { id: 'create-amazon', name: 'Lista Amazon', icon: PlusIcon, color: 'bg-orange-500' },
  ];

  const stats = [
    {
      name: 'Visitas Totales',
      value: analyticsData.totalVisits.toLocaleString(),
      change: '+12.3%',
      changeType: 'positive',
      icon: EyeIcon,
      subtitle: `${analyticsData.todayVisits} hoy`
    },
    {
      name: 'Clicks en Banners',
      value: analyticsData.totalBannerClicks.toLocaleString(),
      change: '+8.1%',
      changeType: 'positive',
      icon: CursorArrowRaysIcon,
      subtitle: `${analyticsData.todayBannerClicks} hoy`
    },
    {
      name: 'Clicks en Botones',
      value: analyticsData.totalButtonClicks.toLocaleString(),
      change: '+15.7%',
      changeType: 'positive',
      icon: CursorArrowRaysIcon,
      subtitle: `${analyticsData.todayButtonClicks} hoy`
    },
    {
      name: 'Tasa de Rebote',
      value: `${analyticsData.bounceRate}%`,
      change: '-3.2%',
      changeType: 'positive',
      icon: TrendingDownIcon,
      subtitle: 'Último mes'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu sitio web y estadísticas</p>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => onOpenModal(action.id)}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center">{action.name}</h3>
          </motion.button>
        ))}
      </div>

      {/* Filtros de fecha */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setDateRange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === period
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {period === '24h' ? '24 horas' : 
               period === '7d' ? '7 días' : 
               period === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-gray-400" />
              <div className={`flex items-center text-sm ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <TrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.name}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Páginas más visitadas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Páginas Más Visitadas</h3>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{page.page}</p>
                  <p className="text-sm text-gray-600">{page.visits.toLocaleString()} visitas</p>
                </div>
                <div className={`flex items-center text-sm ${
                  page.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {page.change >= 0 ? (
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(page.change)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'visit' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">hace {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Métricas adicionales */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <DocumentTextIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h4 className="text-2xl font-bold text-gray-900">{analyticsData.totalPosts}</h4>
          <p className="text-sm text-gray-600">Total de Posts</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <ShoppingCartIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <h4 className="text-2xl font-bold text-gray-900">{analyticsData.totalProducts}</h4>
          <p className="text-sm text-gray-600">Productos Creados</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <CalendarDaysIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h4 className="text-2xl font-bold text-gray-900">{analyticsData.avgSessionDuration}</h4>
          <p className="text-sm text-gray-600">Duración Promedio</p>
        </div>
      </div>
    </div>
  );
}