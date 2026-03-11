/** Fuente única de verdad para datos de contacto y redes sociales de MEGACABLE */

export const WHATSAPP_NUMBER = "51930854814"
export const PHONE_DISPLAY   = "+51 930 854 814"
export const EMAIL            = "contacto@megacable.pe"
export const ADDRESS          = "Jr. Independencia 123, Otuzco, La Libertad, Perú"
export const BUSINESS_NAME    = "MEGACABLE Otuzco"

export const SOCIAL = {
  facebook:  "https://www.facebook.com/megacableotuzco",
  instagram: "https://www.instagram.com/megacableotuzco",
  whatsapp:  `https://wa.me/${WHATSAPP_NUMBER}`,
}

export const HOURS = [
  "Lunes a Sábado: 8:00 am – 1:00 pm",
  "Lunes a Sábado: 3:00 pm – 7:00 pm",
]

/** Mensaje pre-cargado para el botón flotante de WhatsApp */
export const WA_DEFAULT_MSG = encodeURIComponent(
  "Hola, estoy interesado en los paquetes de MEGACABLE. ¿Me pueden dar más información?"
)
