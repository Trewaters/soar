import { Box, Stack, Typography } from '@node_modules/@mui/material'
import React from 'react'

const glossary = [
  {
    term: 'Asana',
    meaning: 'A Sanskrit term for a physical yoga posture or pose.',
    whyMatters:
      'Asanas help build strength, flexibility, and focus. They are just one component of the broader yoga tradition.',
  },
  {
    term: 'Ahimsa',
    meaning: 'Often translated as “non-harming” or “non-violence.”',
    whyMatters:
      'One of the key Yamas (ethical observances) in the Eight-Limb Path; encourages kindness and compassion toward all beings, including oneself.',
  },
  {
    term: 'Bandha',
    meaning:
      'An “energy lock” in the body, often referring to muscular engagements that direct the flow of energy (prana).',
    whyMatters:
      'Practicing bandhas can help maintain stability, support healthy posture, and intensify the energetic benefits of an asana.',
  },
  {
    term: 'Chakra',
    meaning:
      'Literally “wheel” or “disk” in Sanskrit, referring to energy centers along the spine.',
    whyMatters:
      'Balancing chakras is believed to promote physical, emotional, and spiritual well-being.',
  },
  {
    term: 'Dharana',
    meaning: '“Concentration,” the sixth limb of the Eight-Limb Path.',
    whyMatters:
      'Prepares the mind for deeper meditation by training it to focus on a single point or object.',
  },
  {
    term: 'Dhyana',
    meaning: '“Meditation,” the seventh limb of the Eight-Limb Path.',
    whyMatters:
      'A state of uninterrupted flow of concentration, leading to heightened awareness and tranquility.',
  },
  {
    term: 'Drishti',
    meaning: 'A focused gaze or visual point used in many yoga postures.',
    whyMatters:
      'Helps cultivate concentration, balance, and proper alignment in poses.',
  },
  {
    term: 'Mantra',
    meaning:
      'A word, sound, or phrase repeated to aid concentration in meditation.',
    whyMatters:
      'Mantras help calm the mind and can carry significant spiritual or emotional resonance (e.g., “Om” or “Aum”).',
  },
  {
    term: 'Mudra',
    meaning:
      'A hand gesture or bodily position believed to direct energy flow within the body.',
    whyMatters:
      'Often used in meditation and pranayama to enhance focus and energetic balance.',
  },
  {
    term: 'Namaste',
    meaning:
      'A respectful greeting that can be translated as “I bow to you,” or “the divine in me acknowledges the divine in you.”',
    whyMatters:
      'Typically said at the end of class, Namaste symbolizes the mutual respect and shared experience between teacher and student.',
  },
  {
    term: 'Niyama',
    meaning:
      'Personal observances or practices; the second limb of the Eight-Limb Path.',
    whyMatters: 'Guiding principles for self-discipline and personal growth.',
  },
  {
    term: 'Om (Aum)',
    meaning:
      'A sacred sound and spiritual symbol commonly used in yoga and meditation.',
    whyMatters:
      'Represents the essence of ultimate reality and universal consciousness.',
  },
  {
    term: 'Pranayama',
    meaning: '“Breath control,” the fourth limb of the Eight-Limb Path.',
    whyMatters:
      'Regulates energy flow, calms the mind, and prepares the body for meditation.',
  },
  {
    term: 'Pratyahara',
    meaning:
      '“Withdrawal of the senses,” the fifth limb of the Eight-Limb Path.',
    whyMatters:
      'By controlling how you engage with external stimuli, you develop deeper focus and reduce mental distractions.',
  },
  {
    term: 'Samadhi',
    meaning:
      '“Enlightenment,” the eighth and final limb of the Eight-Limb Path.',
    whyMatters:
      'A state of oneness or total absorption, often described as the ultimate goal of yoga practice.',
  },
  {
    term: 'Savasana',
    meaning:
      'Also called “Corpse Pose,” typically the final relaxation posture of a yoga practice.',
    whyMatters:
      'Integrates the benefits of practice, allowing both mind and body to rest and reset.',
  },
  {
    term: 'Sutra',
    meaning:
      'A short, aphoristic statement or manual; in yoga, Patanjali’s Yoga Sutras are a core philosophical text.',
    whyMatters:
      'Provides in-depth guidance on the mental and spiritual aspects of the yogic path.',
  },
  {
    term: 'Vinyasa',
    meaning:
      'A style of yoga characterized by flowing from one pose to another in coordination with the breath.',
    whyMatters:
      'Builds heat, endurance, and promotes a moving meditation as breath and movement synchronize.',
  },
  {
    term: 'Yama',
    meaning:
      'Ethical guidelines or restraints; the first limb of the Eight-Limb Path.',
    whyMatters:
      'Encourages ethical living and harmonious relationships with others.',
  },
]

export default function GlossaryPage() {
  return (
    <Box sx={{ mx: 4, mt: 4 }}>
      {glossary.map((item, index) => (
        <Stack key={index} sx={{ mb: 4 }}>
          <Typography variant={'h2'}>{item.term}</Typography>
          <Typography variant={'body1'}>
            <strong>Meaning:</strong> {item.meaning}
          </Typography>
          <Typography variant={'body1'}>
            <strong>Why it matters:</strong> {item.whyMatters}
          </Typography>
        </Stack>
      ))}
    </Box>
  )
}
