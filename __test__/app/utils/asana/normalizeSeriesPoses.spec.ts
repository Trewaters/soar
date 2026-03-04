import { normalizeSeriesPoses } from '@app/utils/asana/normalizeSeriesPoses'

describe('normalizeSeriesPoses', () => {
  it('should normalize legacy string entries', () => {
    const result = normalizeSeriesPoses(['Mountain Pose; Tadasana'])

    expect(result).toEqual([
      {
        sort_english_name: 'Mountain Pose',
        secondary: 'Tadasana',
      },
    ])
  })

  it('should normalize object entries with metadata', () => {
    const result = normalizeSeriesPoses([
      {
        sort_english_name: 'Warrior II',
        secondary: 'Virabhadrasana II',
        sanskrit_names: ['Virabhadrasana II'],
        alignment_cues: 'Ground through feet',
        breathSeries: 'Inhale',
        poseId: 'pose-1',
      },
    ])

    expect(result).toEqual([
      {
        sort_english_name: 'Warrior II',
        secondary: 'Virabhadrasana II',
        sanskrit_names: ['Virabhadrasana II'],
        alignment_cues: 'Ground through feet',
        breathSeries: 'Inhale',
        poseId: 'pose-1',
      },
    ])
  })

  it('should support mixed arrays and filter malformed items', () => {
    const result = normalizeSeriesPoses([
      'Tree Pose; Vrikshasana',
      {
        sort_english_name: 'Chair Pose',
        alignment_cues: 'Sit hips back',
      },
      {
        sort_english_name: '   ',
      },
      null,
      undefined,
    ])

    expect(result).toHaveLength(2)
    expect(result[0].sort_english_name).toBe('Tree Pose')
    expect(result[1].sort_english_name).toBe('Chair Pose')
  })

  it('should return empty array for nullish input', () => {
    expect(normalizeSeriesPoses(undefined)).toEqual([])
    expect(normalizeSeriesPoses(null)).toEqual([])
  })
})
