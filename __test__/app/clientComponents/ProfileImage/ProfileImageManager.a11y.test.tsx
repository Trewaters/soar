import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ProfileImageManager } from '@app/clientComponents/ProfileImage/ProfileImageManager'
// import { ProfileImageManager } from '@/app/clientComponents/ProfileImage/ProfileImageManager'

expect.extend(toHaveNoViolations)

describe('ProfileImageManager accessibility', () => {
  it('has no axe-core accessibility violations', async () => {
    const { container } = render(
      <ProfileImageManager
        images={['/img1.png']}
        active={'/img1.png'}
        placeholder={'/placeholder.png'}
        onChange={jest.fn()}
        onUpload={jest.fn(() => Promise.resolve())}
        onDelete={jest.fn(() => Promise.resolve())}
        onSelect={jest.fn(() => Promise.resolve())}
        loading={false}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
