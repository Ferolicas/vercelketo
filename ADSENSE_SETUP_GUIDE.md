# Guía de Configuración AdSense - Planeta Keto

## ✅ Implementación Completada

Se ha implementado un sistema completo de Google AdSense con las siguientes características:

### 🎯 Componentes Creados

1. **GoogleAds.tsx** - Componente base para renderizar anuncios AdSense
2. **AdPlacement.tsx** - Posicionamiento estratégico de anuncios con configuración responsive
3. **ResponsiveAdUnit.tsx** - Unidades de anuncios que se adaptan al tamaño de pantalla
4. **InContentAd.tsx** - Anuncios integrados dentro del contenido
5. **AdOptimizer.tsx** - Optimización de rendimiento y métricas de anuncios
6. **AdScript.tsx** - Script de carga optimizada de AdSense
7. **InArticleAds.tsx** - Inserción inteligente de anuncios en artículos

### 📍 Posiciones de Anuncios Implementadas

- **Header**: Banner horizontal para desktop (728x90, 970x250)
- **Content Top/Middle/Bottom**: Rectángulos dentro del contenido (300x250, 336x280)
- **Sidebar**: Anuncios verticales (160x600, 300x600)
- **Footer**: Banner horizontal inferior
- **Mobile Sticky**: Anuncio fijo en móviles (320x50)

### 🚀 Características de Optimización

#### Rendimiento
- Carga lazy de anuncios usando Intersection Observer
- Prevención de Cumulative Layout Shift (CLS)
- Carga asíncrona de scripts AdSense
- Optimización para Core Web Vitals

#### Experiencia de Usuario
- Diseño responsive automático
- Control de frecuencia (máximo 3 anuncios por página)
- Distancia mínima de scroll antes de mostrar anuncios
- Anuncios contextuales que no interrumpen el contenido

#### Analytics & Tracking
- Métricas de viewability en tiempo real
- Tracking de clicks y tiempo de visualización
- Integración con Google Analytics
- Modo debug para desarrollo

### ⚙️ Configuración Requerida

#### 1. Slots de AdSense
Debes reemplazar los slots de ejemplo en `AdPlacement.tsx`:
```typescript
const adConfig = {
  header: {
    slot: '1234567890', // ← Reemplazar con tu slot real
    // ...
  }
}
```

#### 2. Variables de Entorno
Tu `.env.local` ya tiene configurado:
```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-4510658835174275
NEXT_PUBLIC_GA_ID=G-QHJR9PCWZC
```

### 📱 Implementación en Páginas

#### Homepage (Ya implementada)
```tsx
import AdPlacement from './ads/AdPlacement'

// Anuncio header (solo desktop)
<AdPlacement position="header" showOnMobile={false} showOnDesktop={true} />

// Anuncio content middle
<AdPlacement position="content-middle" className="max-w-4xl mx-auto px-4" />

// Anuncio footer
<AdPlacement position="footer" className="max-w-6xl mx-auto px-4" />

// Anuncio mobile sticky
<AdPlacement position="mobile-sticky" showOnMobile={true} showOnDesktop={false} />
```

#### Para Artículos/Recetas
```tsx
import InContentAd from './ads/InContentAd'

// Dentro del contenido del artículo
<InContentAd 
  adSlot="tu-slot-aqui"
  insertAfterParagraph={3}
  minViewportHeight={600}
/>
```

### 🎛️ Personalización

#### Ajustar Configuración de Anuncios
En `AdOptimizer.tsx` puedes modificar:
```typescript
// Máximo anuncios por página
maxAdsPerPage={3}

// Distancia mínima de scroll
minScrollDistance={1000}

// Umbral de visibilidad (50% = 0.5)
viewabilityThreshold={0.5}
```

#### Responsive Breakpoints
En `ResponsiveAdUnit.tsx`:
```typescript
const getAdSize = (width: number) => {
  if (width >= 1200) return { width: 970, height: 250, format: 'horizontal' }
  else if (width >= 768) return { width: 728, height: 90, format: 'horizontal' }
  // ... más configuraciones
}
```

### 📊 Métricas y Analytics

El sistema tracking automáticamente:
- **Impressions**: Cuando el anuncio se hace visible
- **Viewability**: Porcentaje de visibilidad del anuncio
- **Time Visible**: Tiempo que el anuncio estuvo visible
- **Click Through Rate**: Clicks vs impressions
- **Scroll Depth**: Profundidad de scroll cuando se vio el anuncio

### 🔍 Debugging

En modo desarrollo (`NODE_ENV=development`), los anuncios muestran información de debug:
- Porcentaje de visibilidad
- Tiempo visible en ms
- Número de clicks
- Distancia de scroll

### ⚠️ Importante

1. **Slots de AdSense**: Debes crear tus propios ad units en Google AdSense y reemplazar los slots de ejemplo.

2. **Políticas de AdSense**: Los anuncios implementados cumplen con las políticas de AdSense:
   - No más de 3 anuncios por página inicialmente
   - Separación adecuada entre anuncios y contenido
   - Labels de "Publicidad" claramente visibles
   - No click fraudulento o incentivado

3. **Testing**: Los anuncios no se mostrarán hasta que configures los slots reales en AdSense.

### 🚀 Próximos Pasos

1. Crear ad units en tu cuenta de Google AdSense
2. Reemplazar los slots de ejemplo con tus slots reales
3. Probar en producción y ajustar posiciones según rendimiento
4. Monitore métricas en Google AdSense y Analytics
5. Optimizar basado en datos de rendimiento

El sistema está listo para maximizar tus ingresos por publicidad manteniendo una excelente experiencia de usuario.