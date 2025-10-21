import { redirect } from 'next/navigation'

export default function PracticeSequenceIdPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  // Server-side redirect to the canonical practiceSequences page which
  // handles rendering based on the `sequenceId` search param. This keeps
  // a single client component responsible for UI while enabling
  // user-friendly dynamic URLs.
  redirect(
    `/navigator/flows/practiceSequences?sequenceId=${encodeURIComponent(id)}`
  )
}
