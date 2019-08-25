import React from 'react'
import { render, cleanup } from '@testing-library/react'

import ContactInfo from './index'

describe('ContactInfo tests', function() {
  afterEach(cleanup)

  // Related issue: 2846
  it('should renders a contact with link', function() {
    const item = {
      id: '295c3d1e-83a6-11e9-a74e-0a95998482ac',
      display_name: 'Mojtaba Espari Pour',
      profile_image_url:
        'https://d2dzyv4cb7po1i.cloudfront.net/e58aa965-600f-4b3c-a400-fd0f52a66b6f/087ee010-8455-11e9-ba54-9bd150ac2178.jpeg',
      to: 'esparipour@gmail.com',
      contact: 'e58aa965-600f-4b3c-a400-fd0f52a66b6f',
      unsubscribed: 0,
      failed: 0,
      opened: 0,
      clicked: 0
    }

    const { queryByText } = render(<ContactInfo data={item} />)
    const name_el = queryByText(item.display_name)
    expect(name_el).not.toBeNull()
    // @ts-ignore
    expect(name_el.nodeName).toBe('A')
  })

  // Related issue: 2846
  it('should renders a user without link', function() {
    const item = {
      id: '295c3d1e-13a6-13e9-a74a-0a99998382ac',
      display_name: 'Bahram Nouraei',
      profile_image_url:
        'https://d2dzyv4cb7po1i.cloudfront.net/e58aa965-600f-4b3c-a400-fd0f52a66b6f/087ee010-8455-11e9-ba54-9bd150ac2178.jpeg',
      to: 'bahram@gmail.com',
      contact: null,
      unsubscribed: 0,
      failed: 0,
      opened: 0,
      clicked: 0
    }

    const { container, queryByText } = render(<ContactInfo data={item} />)
    const name_el = queryByText(item.display_name)
    expect(name_el).not.toBeNull()
    // @ts-ignore
    expect(name_el.nodeName).not.toBe('A')
  })

  // Related issue: 2846
  it('should renders just an email', function() {
    const item = {
      id: '295c3b16-83a6-11e9-a74d-0a95998482ac',
      display_name: null,
      profile_image_url: null,
      to: 'booom@ail.com',
      contact: null,
      unsubscribed: 0,
      failed: 0,
      opened: 0,
      clicked: 0
    }

    const { container } = render(<ContactInfo data={item} />)
    const profile_info_el = container.querySelector('.profile-info')
    expect(profile_info_el).not.toBeNull()
    // @ts-ignore
    expect(profile_info_el.childElementCount).toBe(1)
  })
})