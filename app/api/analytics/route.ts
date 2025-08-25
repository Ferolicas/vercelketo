import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsData {
  type: string;
  data: any;
  timestamp: string;
}

// Simulación de base de datos en memoria (en producción usar una DB real)
let analyticsStore: AnalyticsData[] = [];

export async function POST(request: NextRequest) {
  try {
    const { type, data, timestamp }: AnalyticsData = await request.json();
    
    // Validar datos básicos
    if (!type || !data || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Obtener información del request
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';

    // Crear registro completo
    const analyticsRecord: AnalyticsData & {
      ip: string;
      userAgent: string;
      referer: string;
      id: string;
    } = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: {
        ...data,
        server_timestamp: new Date().toISOString(),
      },
      timestamp,
      ip,
      userAgent,
      referer
    };

    // Guardar en store (en producción: guardar en base de datos)
    analyticsStore.push(analyticsRecord);
    
    // Mantener solo los últimos 10,000 registros en memoria
    if (analyticsStore.length > 10000) {
      analyticsStore = analyticsStore.slice(-10000);
    }

    // Log para debugging
    console.log(`[ANALYTICS] ${type}:`, {
      timestamp,
      ip: ip.substring(0, 8) + '...', // Partially hide IP for privacy
      userAgent: userAgent.substring(0, 50) + '...',
      dataType: typeof data,
      hasSessionId: !!data.session_id
    });

    // En producción, aquí podrías:
    // 1. Guardar en base de datos (MongoDB, PostgreSQL, etc.)
    // 2. Enviar a servicios de analytics (Mixpanel, Amplitude, etc.)
    // 3. Procesar datos en tiempo real
    // 4. Enviar notificaciones para eventos importantes

    return NextResponse.json({
      success: true,
      message: 'Analytics data received',
      id: analyticsRecord.id
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Verificar autorización (simple check, en producción usar JWT o similar)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ANALYTICS_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let filteredData = analyticsStore;

    // Filtrar por tipo si se especifica
    if (type) {
      filteredData = analyticsStore.filter(record => record.type === type);
    }

    // Aplicar paginación
    const paginatedData = filteredData
      .slice(offset, offset + limit)
      .map(record => ({
        id: record.id,
        type: record.type,
        data: record.data,
        timestamp: record.timestamp,
        // No incluir IP completa por privacidad
        ip: record.ip.substring(0, 8) + '...',
        userAgent: record.userAgent
      }));

    // Calcular estadísticas básicas
    const stats = {
      total: filteredData.length,
      byType: analyticsStore.reduce((acc, record) => {
        acc[record.type] = (acc[record.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      last24Hours: analyticsStore.filter(record => {
        const recordTime = new Date(record.timestamp);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return recordTime > yesterday;
      }).length
    };

    return NextResponse.json({
      success: true,
      data: paginatedData,
      stats,
      pagination: {
        limit,
        offset,
        total: filteredData.length,
        hasMore: offset + limit < filteredData.length
      }
    });

  } catch (error) {
    console.error('Analytics GET API Error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener estadísticas en tiempo real
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({
    methods: ['GET', 'POST'],
    endpoints: {
      POST: 'Send analytics data',
      GET: 'Retrieve analytics data (requires auth)',
    },
    parameters: {
      GET: {
        type: 'Filter by event type (optional)',
        limit: 'Number of records to return (default: 100)',
        offset: 'Number of records to skip (default: 0)'
      }
    }
  });
}