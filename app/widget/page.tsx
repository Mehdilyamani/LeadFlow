import LeadWidget from '../CSR/LeadWidget'

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ agency?: string }>
}) {
  const { agency } = await searchParams
  const agencyName = agency ? decodeURIComponent(agency) : 'Prestige Immobilier'

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
      <LeadWidget agencyName={agencyName} />
    </>
  )
}
