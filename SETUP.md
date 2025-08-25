# 🥑 Planeta Keto - Guía de Configuración

## ✅ **Transformación Completada**

Tu sitio web ha sido completamente modernizado y optimizado. Aquí tienes todo lo que se ha implementado:

---

## 🚀 **Características Implementadas**

### **1. Next.js 15 Ultra-Optimizado**
- ✅ Configuración de rendimiento máximo con Turbo
- ✅ Headers de seguridad y cache optimizados  
- ✅ Compresión y minificación avanzada
- ✅ Optimización de imágenes AVIF/WebP
- ✅ Service Worker para cache offline

### **2. SEO Premium con Keywords Keto en Español** 
- ✅ Meta tags con +40 keywords keto top en español
- ✅ Sitemap automático con next-sitemap
- ✅ Datos estructurados (JSON-LD) para recetas
- ✅ Open Graph y Twitter Cards optimizados
- ✅ Soporte multiidioma (ES-MX, ES-AR, ES-CO, ES-ES)

### **3. Sistema de Publicidad Integrado**
- ✅ Componentes para AdSense y Adsterra
- ✅ Tracking automático de clics e impresiones  
- ✅ PopUnders y banners optimizados
- ✅ Analytics integrado con Google Analytics

### **4. Nueva Arquitectura del Sitio**
- ✅ **Página Principal**: Landing optimizado con estadísticas y CTAs
- ✅ **Sección Recetas**: Todo tu contenido actual reestructurado
- ✅ **Servicios y Productos**: Grid de productos + listas Amazon
- ✅ **Navegación Premium**: Responsive con animaciones

### **5. Panel de Administración Completo**
- ✅ **Dashboard**: Estadísticas de visitas, clics en banners y botones
- ✅ **Crear Post**: Modal completo con tabs para recetas keto
- ✅ **Modificar Web**: Editor visual para títulos, colores, imágenes
- ✅ **Crear Producto**: Sistema completo de productos con precios
- ✅ **Lista Amazon**: Gestor de productos afiliados con ASIN automático

### **6. Sistema de Analytics y Tracking**
- ✅ Tracking personalizado de page views
- ✅ Monitoreo de clics en anuncios (AdSense/Adsterra)
- ✅ Tracking de clics en botones y enlaces
- ✅ Core Web Vitals en tiempo real
- ✅ Almacenamiento local y envío a servidor

---

## 🛠️ **Configuración Inicial**

### **Paso 1: Variables de Entorno**
Crea un archivo `.env.local` basado en `.env.example`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local
```

### **Paso 2: Configura tus IDs**
Edita `.env.local` con tus datos reales:

```env
# URLs del sitio
SITE_URL=https://planetaketo.es
NEXT_PUBLIC_SITE_URL=https://planetaketo.es

# Google Analytics (obtén tu ID en analytics.google.com)
NEXT_PUBLIC_GA_ID=G-TU-ID-AQUI

# Google AdSense (obtén en adsense.google.com)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-TU-PUBLISHER-ID
NEXT_PUBLIC_HEADER_AD_ID=tu-ad-slot-id-1
NEXT_PUBLIC_SIDEBAR_AD_ID=tu-ad-slot-id-2
NEXT_PUBLIC_CONTENT_MIDDLE_AD_ID=tu-ad-slot-id-3

# Adsterra (obtén en adsterra.com)
NEXT_PUBLIC_ADSTERRA_SIDEBAR_ID=tu-adsterra-id

# Facebook Pixel (obtén en business.facebook.com)
NEXT_PUBLIC_FB_PIXEL_ID=tu-pixel-id
```

### **Paso 3: Instalar Dependencias**
```bash
npm install
```

### **Paso 4: Ejecutar en Desarrollo**
```bash
npm run dev
```

### **Paso 5: Acceder al Admin Panel**
1. Ve a `http://localhost:3000/admin`
2. Contraseña: `planetaketo2024`
3. ¡Ya puedes gestionar todo desde el panel!

---

## 📊 **Panel de Administración - Funciones**

### **Dashboard**
- **Estadísticas en tiempo real**: Visitas, clics en anuncios, clics en botones
- **Páginas más visitadas** con cambios porcentuales
- **Actividad reciente** en tiempo real
- **Métricas de rendimiento** (Core Web Vitals)

### **Crear Post** 
- **4 Tabs organizados**:
  - Información Básica: título, categoría, descripción
  - Receta: ingredientes, instrucciones, tiempos
  - Nutrición: macros y calorías
  - SEO: keywords y tags específicos
- **Auto-generación de slug** basado en título
- **Vista previa en tiempo real**

### **Modificar Detalles Web**
- **5 Secciones**:
  - General: nombre, descripciones, email
  - Diseño: colores, imágenes, favicon
  - Redes Sociales: enlaces a todas las plataformas
  - SEO & Analytics: keywords, GA, Facebook Pixel
  - Publicidad: IDs de AdSense y Adsterra
- **Vista previa en vivo** de los cambios

### **Crear Producto**
- **Información completa**: nombre, descripción, precios
- **Sistema de descuentos** automático
- **Características** con bullets
- **Ratings y reviews**
- **Badges** (Bestseller, Premium, Nuevo, etc.)
- **Vista previa** del producto

### **Lista Amazon**
- **Gestión por lotes** de productos afiliados
- **Auto-extracción de ASIN** desde URLs
- **Categorización automática**
- **Sistema de beneficios** por producto
- **Vista previa** de la lista completa

---

## 🎯 **SEO y Keywords Implementadas**

### **Keywords Principales** (ya implementadas):
```
recetas keto, dieta keto, dieta cetogénica, keto en español, 
recetas cetogénicas, comida keto, desayuno keto, almuerzo keto, 
cena keto, postres keto, pan keto, pizza keto, galletas keto, 
recetas bajas en carbohidratos, perder peso keto, quemar grasa keto, 
cetosis, macros keto, menu keto, plan keto, keto facil, 
keto para principiantes, alimentos keto, keto mexico, keto argentina, 
keto colombia, keto españa, ayuno intermitente keto, productos keto, 
calculadora keto, macros cetogénicos
```

### **Optimizaciones SEO Activas**:
- Títulos optimizados para CTR alto
- Meta descripciones con emojis y call-to-actions
- Open Graph para redes sociales
- Twitter Cards automáticas
- Sitemap.xml generado automáticamente
- Robots.txt optimizado
- Datos estructurados JSON-LD para recetas

---

## 📱 **Estructura del Sitio**

```
🏠 Página Principal
   ├── Hero con estadísticas
   ├── Categorías de recetas 
   ├── Beneficios de la dieta keto
   └── CTA para conversión

🍽️ Recetas (/recetas)
   ├── Todo tu contenido actual
   ├── Filtros por categoría
   ├── Vista de receta individual
   └── Sistema de comentarios

🛍️ Servicios y Productos (/servicios)
   ├── Grid de productos propios
   ├── Lista de productos Amazon
   ├── Sistema de afiliados
   └── CTAs optimizados

⚙️ Panel Admin (/admin)
   ├── Dashboard con estadísticas
   ├── Gestión de posts
   ├── Configuración web
   └── Gestión de productos
```

---

## 🚀 **Comandos Útiles**

```bash
# Desarrollo con Turbo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Generar sitemap
npx next-sitemap

# Analizar bundle
npm run analyze
```

---

## 📈 **Métricas de Rendimiento**

El sistema incluye monitoreo en tiempo real de:
- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.5s  
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 500ms

---

## 🎨 **Personalización**

### **Cambiar Colores**
En el admin panel > Modificar Web > Diseño:
- Color primario: `#059669` (verde keto)
- Color secundario: `#10b981` (verde claro)

### **Agregar Keywords**
En el admin panel > Modificar Web > SEO:
- Añade keywords específicas separadas por comas
- Se combinan automáticamente con las keywords base

### **Configurar Anuncios**
En el admin panel > Modificar Web > Publicidad:
- Agrega tus IDs de AdSense y Adsterra
- Los anuncios aparecen automáticamente en las posiciones optimizadas

---

## 🔧 **Próximos Pasos Opcionales**

1. **Configurar Sanity Studio** (si quieres CMS completo)
2. **Conectar base de datos** (PostgreSQL recomendado)
3. **Configurar emails automáticos** (comentarios, contacto)
4. **Implementar comentarios con moderación**
5. **Añadir sistema de suscripción email**
6. **Configurar backups automáticos**

---

## 🆘 **Soporte**

### **Contraseña del Admin Panel**
```
planetaketo2024
```

### **Archivos Importantes**
- `next.config.ts` - Configuración de Next.js
- `app/layout.tsx` - Layout principal con SEO
- `components/admin/` - Panel de administración
- `lib/analytics.ts` - Sistema de tracking
- `public/sw.js` - Service Worker para cache

### **Logs y Debugging**
En desarrollo, verás las métricas de rendimiento en la esquina inferior derecha y logs detallados en la consola.

---

## 🎉 **¡Tu Sitio Está Listo!**

Tienes ahora un sitio web keto **ultra-optimizado, completamente gestionable y preparado para monetizar**. 

El sistema está diseñado para:
- ⚡ **Máximo rendimiento y velocidad**  
- 🔍 **SEO perfecto para keywords keto en español**
- 💰 **Monetización optimizada con anuncios**
- 📊 **Analytics completo de todas las interacciones**
- ⚙️ **Gestión total desde el panel admin**

**¡Solo necesitas configurar tus IDs de publicidad y ya estarás generando ingresos!**