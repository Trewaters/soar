import React from 'react'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/navigator')
  return (
    <>
      {/* 
      Notes (2024-09-06 18:30:38):
      moved to "framed" so I can control when I show the menu navigation. 
      */}
    </>
  )
}
