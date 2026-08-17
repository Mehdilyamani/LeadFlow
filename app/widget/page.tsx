import LeadWidget from '../CSR/LeadWidget'

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ agency?: string; client?: string; context?: string; pid?: string; ptitle?: string }>
}) {
  const { agency, client, context, pid, ptitle } = await searchParams
  const agencyName = agency ? decodeURIComponent(agency) : 'Démo LeadFlow'
  const clientId = client ? decodeURIComponent(client) : undefined
  const agencyContext = context ? decodeURIComponent(context) : undefined
  const propertyContext =
    pid && ptitle
      ? { id: decodeURIComponent(pid), title: decodeURIComponent(ptitle) }
      : null

  return (
    <>
      <style>{`
        html, body {
          background: transparent !important;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        /* always clickable — pointer-events on the iframe is managed by embed script */
        * { pointer-events: auto !important; }
      `}</style>
      <LeadWidget agencyName={agencyName} clientId={clientId} agencyContext={agencyContext} propertyContext={propertyContext} />
    </>
  )
}
