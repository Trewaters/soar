import { redirect } from 'next/navigation'

export default function PracticeSequenceIdPage({ params }: { params: any }) {
  const { id } = params as { id: string }

  // Server-side redirect to the canonical practiceSequences page which
  // handles rendering based on the `sequenceId` search param. This keeps
  // a single client component responsible for UI while enabling
  // user-friendly dynamic URLs.
  redirect(`/flows/practiceSequences?sequenceId=${encodeURIComponent(id)}`)
}
