import React from 'react'
import Glossary from '../../glossary/Glossary'
import { GlossaryProvider } from '../../glossary/GlossaryContext'

const NavigatorGlossaryPage = () => {
  return (
    <GlossaryProvider>
      <Glossary />
    </GlossaryProvider>
  )
}

export default NavigatorGlossaryPage
