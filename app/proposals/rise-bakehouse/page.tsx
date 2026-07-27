import type { Metadata } from 'next'
import RiseBakehouseProposal from './RiseBakehouseProposal'

export const metadata: Metadata = {
  title: 'Rise Bakehouse Acoustic Treatment Proposal',
  description: 'A private acoustic treatment proposal prepared for Rise Bakehouse, Chinatown.',
  robots: { index: false, follow: false },
}

export default function RiseBakehouseProposalPage() {
  return <RiseBakehouseProposal />
}
