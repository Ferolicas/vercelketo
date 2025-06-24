export const GA_MEASUREMENT_ID = 'G-M4LRXB5MM0';

// Registra un pageview
export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Registra eventos personalizados (opcional)
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
