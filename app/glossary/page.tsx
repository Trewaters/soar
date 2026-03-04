import React from 'react'
import Glossary from './Glossary'
import { GlossaryProvider } from './GlossaryContext'

const GlossaryPage = () => {
  return (
    <GlossaryProvider>
      <Glossary />
    </GlossaryProvider>
  )
}

export default GlossaryPage
