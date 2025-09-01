import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const sendPurchaseEmail = async (
  email: string,
  name: string,
  ketoCode: string,
  productTitle: string,
  downloadUrl?: string
) => {
  if (!resend) {
    console.warn('Resend not configured, email not sent')
    return null
  }

  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `¡Gracias por tu compra! - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">¡Gracias ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Tu compra se ha procesado exitosamente</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de tu compra:</h2>
          <p><strong>Producto:</strong> ${productTitle}</p>
          <p><strong>Código de transacción:</strong> ${ketoCode}</p>
          <p><strong>Contraseña de acceso:</strong> KETOPAGO1234*</p>
          
          ${downloadUrl ? `
            <div style="margin: 30px 0; text-align: center;">
              <a href="${downloadUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold;">
                Descargar ${productTitle}
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                Este enlace es válido para 2 descargas únicamente
              </p>
            </div>
          ` : `
            <div style="margin: 30px 0; padding: 20px; background: #e3f2fd; border-radius: 5px;">
              <p><strong>Próximos pasos:</strong></p>
              <p>Nos pondremos en contacto contigo en las próximas 24 horas para coordinar tu ${productTitle}.</p>
              <p>Si tienes alguna duda, puedes contactarnos respondiendo a este email.</p>
            </div>
          `}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="font-size: 14px; color: #666;">
            <strong>¿Necesitas ayuda?</strong><br>
            Responde a este email o contacta con nuestro equipo de soporte.
          </p>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Este email fue enviado desde Planeta Keto. Si no realizaste esta compra, 
            por favor contacta con nosotros inmediatamente.
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }

  return data
}

export const sendPurchaseEmailWithNewsletter = async (
  email: string,
  name: string,
  ketoCode: string,
  productTitle: string,
  password: string,
  subscribeNewsletter: boolean,
  downloadUrl?: string
) => {
  if (!resend) {
    console.warn('Resend not configured, email not sent')
    return null
  }

  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `¡Gracias por tu compra! - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">¡Gracias ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Tu compra se ha procesado exitosamente</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de tu compra:</h2>
          <p><strong>Producto:</strong> ${productTitle}</p>
          <p><strong>Código de transacción:</strong> ${ketoCode}</p>
          <p><strong>Contraseña de acceso:</strong> ${password}</p>
          
          ${downloadUrl ? `
            <div style="margin: 30px 0; text-align: center;">
              <a href="${downloadUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold;">
                Descargar ${productTitle}
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                Este enlace es válido para 2 descargas únicamente
              </p>
            </div>
          ` : ''}
          
          ${subscribeNewsletter ? `
            <div style="margin: 30px 0; padding: 20px; background: #e8f5e8; border-radius: 5px;">
              <p><strong>¡Bienvenido a nuestro Newsletter!</strong></p>
              <p>Te has suscrito exitosamente a nuestro newsletter. Recibirás contenido exclusivo, 
                 recetas keto, tips de nutrición y ofertas especiales directamente en tu correo.</p>
            </div>
          ` : ''}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="font-size: 14px; color: #666;">
            <strong>¿Necesitas ayuda?</strong><br>
            Responde a este email o contacta con nuestro equipo de soporte.
          </p>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Este email fue enviado desde Planeta Keto.
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }

  return data
}

export const sendServicePurchaseEmail = async (
  email: string,
  name: string,
  ketoCode: string,
  productTitle: string,
  password: string,
  subscribeNewsletter: boolean,
  calendlyUrl: string
) => {
  if (!resend) {
    console.warn('Resend not configured, email not sent')
    return null
  }

  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: [email],
    subject: `¡Asesoría Keto Confirmada! - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">¡Hola ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Tu asesoría keto ha sido confirmada</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Detalles de tu asesoría:</h2>
          <p><strong>Servicio:</strong> ${productTitle}</p>
          <p><strong>Código de transacción:</strong> ${ketoCode}</p>
          <p><strong>Contraseña de acceso:</strong> ${password}</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${calendlyUrl}" 
               style="background: #00a854; color: white; padding: 18px 35px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0,168,84,0.3);">
              📅 Agendar mi Asesoría Keto
            </a>
            <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">
              Haz clic para seleccionar tu fecha y hora preferida
            </p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #e3f2fd; border-radius: 5px;">
            <p><strong>¿Qué puedes esperar de tu asesoría?</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
              <li>Plan nutricional keto personalizado</li>
              <li>Evaluación de tus objetivos y necesidades</li>
              <li>Resolución de dudas sobre la dieta cetogénica</li>
              <li>Tips y estrategias para el éxito</li>
            </ul>
          </div>
          
          ${subscribeNewsletter ? `
            <div style="margin: 30px 0; padding: 20px; background: #e8f5e8; border-radius: 5px;">
              <p><strong>¡Bienvenido a nuestro Newsletter!</strong></p>
              <p>Recibirás contenido exclusivo sobre dieta keto, recetas y tips de nuestros expertos.</p>
            </div>
          ` : ''}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="font-size: 14px; color: #666;">
            <strong>¿Tienes preguntas antes de tu sesión?</strong><br>
            Responde a este email y te ayudaremos con cualquier duda.
          </p>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Este email fue enviado desde Planeta Keto.
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending service email:', error)
    throw new Error('Failed to send service email')
  }

  return data
}

export const sendAdminAdvisoryNotification = async (
  customerName: string,
  customerEmail: string,
  productTitle: string,
  ketoCode: string
) => {
  if (!resend) {
    console.warn('Resend not configured, admin notification not sent')
    return null
  }

  const { data, error } = await resend.emails.send({
    from: 'Planeta Keto <noreply@planetaketo.es>',
    to: ['admin@planetaketo.es'], // Cambia por tu email de admin
    subject: `Nueva Asesoría Contratada - ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Nueva Asesoría Keto</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Detalles del cliente:</h2>
          <p><strong>Nombre:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Servicio:</strong> ${productTitle}</p>
          <p><strong>Código:</strong> ${ketoCode}</p>
          
          <p><strong>Acción requerida:</strong> Contactar al cliente para programar la sesión de asesoría.</p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending admin notification:', error)
    throw new Error('Failed to send admin notification')
  }

  return data
}