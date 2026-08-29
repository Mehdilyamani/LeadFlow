import type { Metadata } from 'next'
import AgencyHome from './AgencyHome'

export const metadata: Metadata = {
  title: 'LeadFlow — Studio de design & développement web',
  description: 'LeadFlow conçoit et développe des sites web premium, rapides et pensés pour convertir. Studio web basé au Maroc.',
}

export default function Home() {
  return <AgencyHome />
}
