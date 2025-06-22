'use client'
import dynamic from 'next/dynamic'

// Dynamically import to avoid hydration issues
const QuickTimerExamples = dynamic(
  () => import('@app/clientComponents/quickTimer/examples'),
  {
    ssr: false,
  }
)

export default function TimerTestPage() {
  return <QuickTimerExamples />
}
