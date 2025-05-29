import { Metadata } from "next"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con el Club de Aguas Abiertas Chiloé',
  keywords: ['contacto', 'club', 'natación', 'aguas abiertas', 'chiloé'],
}

const ContactoPage = () => {
  return <ContactForm />
}

export default ContactoPage 