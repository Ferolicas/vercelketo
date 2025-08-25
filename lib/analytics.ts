// Sistema de analytics y tracking personalizado para Planeta Keto

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface PageView {
  page_title: string;
  page_location: string;
  page_path: string;
  user_id?: string;
  session_id: string;
  timestamp: string;
  user_agent: string;
  referrer: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  country?: string;
  region?: string;
}

interface AdClick {
  ad_type: 'adsense' | 'adsterra' | 'affiliate';
  ad_position: string;
  ad_id: string;
  page_path: string;
  timestamp: string;
  session_id: string;
  click_coordinates?: { x: number; y: number };
}

interface ButtonClick {
  button_text: string;
  button_id?: string;
  button_class?: string;
  page_path: string;
  section: string;
  timestamp: string;
  session_id: string;
  user_action: string;
}

class PlanetaKetoAnalytics {
  private sessionId: string;
  private userId?: string;
  private isInitialized = false;
  private queue: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUser();
    
    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeUser(): void {
    if (typeof window === 'undefined') return;
    
    // Obtener o crear user ID
    let userId = localStorage.getItem('pketo_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('pketo_user_id', userId);
    }
    this.userId = userId;
  }

  private async initializeTracking(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configurar Google Analytics si está disponible
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
          custom_map: {
            custom_user_id: 'user_id',
            custom_session_id: 'session_id'
          },
          user_id: this.userId,
          session_id: this.sessionId
        });
      }

      // Configurar Facebook Pixel si está disponible
      if (window.fbq) {
        window.fbq('init', process.env.NEXT_PUBLIC_FB_PIXEL_ID!);
        window.fbq('track', 'PageView');
      }

      // Configurar tracking de clicks automático
      this.setupAutoTracking();
      
      this.isInitialized = true;
      
      // Procesar queue de eventos pendientes
      while (this.queue.length > 0) {
        const event = this.queue.shift()!;
        this.sendEvent(event);
      }

    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  private setupAutoTracking(): void {
    // Tracking automático de clicks en botones y enlaces
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Tracking de botones
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button')!;
        this.trackButtonClick({
          button_text: button.textContent?.trim() || 'Unknown Button',
          button_id: button.id,
          button_class: button.className,
          page_path: window.location.pathname,
          section: this.getPageSection(button),
          timestamp: new Date().toISOString(),
          session_id: this.sessionId,
          user_action: 'click'
        });
      }

      // Tracking de enlaces externos
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a')!;
        const href = link.href;
        
        if (href && !href.includes(window.location.hostname)) {
          this.trackEvent('external_link_click', {
            category: 'engagement',
            action: 'click',
            label: href,
            custom_parameters: {
              link_text: link.textContent?.trim(),
              page_path: window.location.pathname
            }
          });
        }
      }

      // Tracking específico de anuncios
      if (target.closest('.ad-container') || target.closest('[class*="ad"]')) {
        const adElement = target.closest('.ad-container') || target.closest('[class*="ad"]')!;
        this.trackAdClick({
          ad_type: adElement.classList.contains('adsense') ? 'adsense' : 
                    adElement.classList.contains('adsterra') ? 'adsterra' : 'affiliate',
          ad_position: this.getAdPosition(adElement as HTMLElement),
          ad_id: adElement.id || 'unknown',
          page_path: window.location.pathname,
          timestamp: new Date().toISOString(),
          session_id: this.sessionId,
          click_coordinates: { x: event.clientX, y: event.clientY }
        });
      }
    });

    // Tracking de tiempo en página
    let startTime = Date.now();
    let isActive = true;
    
    // Detectar cuando el usuario se vuelve inactivo
    const trackInactivity = () => {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      let inactivityTimer: NodeJS.Timeout;
      
      const resetTimer = () => {
        clearTimeout(inactivityTimer);
        isActive = true;
        inactivityTimer = setTimeout(() => {
          isActive = false;
        }, 30000); // 30 segundos de inactividad
      };
      
      events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
      });
      
      resetTimer();
    };
    
    trackInactivity();

    // Enviar datos de tiempo en página antes de salir
    window.addEventListener('beforeunload', () => {
      if (isActive) {
        const timeSpent = Date.now() - startTime;
        this.trackEvent('page_time_spent', {
          category: 'engagement',
          action: 'time_spent',
          value: Math.round(timeSpent / 1000), // segundos
          custom_parameters: {
            page_path: window.location.pathname,
            active_time: isActive
          }
        });
      }
    });
  }

  private getPageSection(element: Element): string {
    // Determinar sección de la página basada en clases o posición
    const closestSection = element.closest('section, header, footer, main, aside');
    if (closestSection) {
      if (closestSection.id) return closestSection.id;
      if (closestSection.className) {
        const classes = closestSection.className.split(' ');
        const sectionClass = classes.find(c => 
          c.includes('hero') || c.includes('header') || c.includes('footer') || 
          c.includes('nav') || c.includes('content') || c.includes('sidebar')
        );
        if (sectionClass) return sectionClass;
      }
    }
    return 'unknown_section';
  }

  private getAdPosition(element: Element): string {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    if (rect.top < viewportHeight * 0.2) return 'top';
    if (rect.top < viewportHeight * 0.8) return 'middle';
    return 'bottom';
  }

  // Método público para tracking de page views
  trackPageView(pageData?: Partial<PageView>): void {
    if (typeof window === 'undefined') return;

    const pageView: PageView = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      device_type: this.getDeviceType(),
      ...pageData
    };

    // Enviar a Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageView.page_title,
        page_location: pageView.page_location,
        custom_user_id: pageView.user_id,
        custom_session_id: pageView.session_id
      });
    }

    // Guardar localmente para estadísticas
    this.saveToLocalStorage('page_views', pageView);
    
    // Enviar a servidor (en producción)
    this.sendToServer('page_view', pageView);
  }

  // Método público para tracking de eventos personalizados
  trackEvent(eventName: string, eventData: Partial<AnalyticsEvent>): void {
    const event: AnalyticsEvent = {
      event: eventName,
      category: 'general',
      action: 'unknown',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      ...eventData
    } as any;

    if (this.isInitialized) {
      this.sendEvent(event);
    } else {
      this.queue.push(event);
    }
  }

  // Método específico para tracking de clicks en anuncios
  trackAdClick(adData: AdClick): void {
    // Enviar a Google Analytics
    if (window.gtag) {
      window.gtag('event', 'ad_click', {
        event_category: 'advertisement',
        event_label: adData.ad_type,
        ad_id: adData.ad_id,
        ad_position: adData.ad_position,
        value: 1
      });
    }

    // Enviar a Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'AdClick', {
        ad_type: adData.ad_type,
        ad_position: adData.ad_position,
        page_path: adData.page_path
      });
    }

    // Guardar localmente
    this.saveToLocalStorage('ad_clicks', adData);
    
    // Enviar a servidor
    this.sendToServer('ad_click', adData);

    // Mostrar notificación al admin si está presente
    this.notifyAdmin('ad_click', adData);
  }

  // Método específico para tracking de clicks en botones
  trackButtonClick(buttonData: ButtonClick): void {
    // Enviar a Google Analytics
    if (window.gtag) {
      window.gtag('event', 'button_click', {
        event_category: 'engagement',
        event_label: buttonData.button_text,
        button_section: buttonData.section,
        page_path: buttonData.page_path
      });
    }

    // Guardar localmente
    this.saveToLocalStorage('button_clicks', buttonData);
    
    // Enviar a servidor
    this.sendToServer('button_click', buttonData);
  }

  private sendEvent(event: AnalyticsEvent): void {
    // Enviar a Google Analytics
    if (window.gtag) {
      window.gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Guardar localmente
    this.saveToLocalStorage('custom_events', event);
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private saveToLocalStorage(type: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `pketo_${type}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);
      
      // Mantener solo los últimos 1000 registros para evitar llenar localStorage
      if (existing.length > 1000) {
        existing.splice(0, existing.length - 1000);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private async sendToServer(type: string, data: any): Promise<void> {
    try {
      // En producción, enviar a tu API
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            data,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Error sending analytics to server:', error);
    }
  }

  private notifyAdmin(type: string, data: any): void {
    // Notificar al admin si está logueado
    if (typeof window !== 'undefined' && localStorage.getItem('admin_access')) {
      const event = new CustomEvent('admin_analytics_update', {
        detail: { type, data, timestamp: new Date().toISOString() }
      });
      window.dispatchEvent(event);
    }
  }

  // Método para obtener estadísticas locales
  getLocalStats(): {
    pageViews: any[];
    adClicks: any[];
    buttonClicks: any[];
    customEvents: any[];
  } {
    if (typeof window === 'undefined') {
      return { pageViews: [], adClicks: [], buttonClicks: [], customEvents: [] };
    }

    return {
      pageViews: JSON.parse(localStorage.getItem('pketo_page_views') || '[]'),
      adClicks: JSON.parse(localStorage.getItem('pketo_ad_clicks') || '[]'),
      buttonClicks: JSON.parse(localStorage.getItem('pketo_button_clicks') || '[]'),
      customEvents: JSON.parse(localStorage.getItem('pketo_custom_events') || '[]')
    };
  }

  // Método para limpiar datos locales
  clearLocalStats(): void {
    if (typeof window === 'undefined') return;
    
    const keys = ['pketo_page_views', 'pketo_ad_clicks', 'pketo_button_clicks', 'pketo_custom_events'];
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Método para exportar datos
  exportData(): string {
    const stats = this.getLocalStats();
    return JSON.stringify(stats, null, 2);
  }
}

// Crear instancia global
let analytics: PlanetaKetoAnalytics | undefined;

if (typeof window !== 'undefined') {
  analytics = new PlanetaKetoAnalytics();
  (window as any).planetaKetoAnalytics = analytics;
}

export default analytics || {} as PlanetaKetoAnalytics;

// Tipos para window global
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    planetaKetoAnalytics: PlanetaKetoAnalytics;
  }
}