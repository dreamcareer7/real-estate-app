import React from 'react'

import { items } from './data'
import { ActiveItem } from './ActiveItem'
import { ComingSoonItem } from './ComingSoonItem'
import IconAllDesigns from '../components/IconAllDesigns/IconAllDesigns'
import IconMyDesigns from '../components/IconMyDesigns/IconMyDesigns'

export function Menu() {
  return (
    <React.Fragment>
      <div style={{ marginBottom: '2.5em' }}>
        <ActiveItem
          indexed
          text="All Designs"
          Icon={IconAllDesigns}
          to="/dashboard/marketing"
        />
        <ActiveItem
          text="My Designs"
          Icon={IconMyDesigns}
          to="/dashboard/marketing/history"
        />
      </div>

      {items.map(({ title, url }, index) =>
        url ? (
          <ActiveItem
            key={index}
            indexed={url === '/'}
            text={title}
            to={`/dashboard/marketing${url}`}
          />
        ) : (
          <ComingSoonItem text={title} key={index} />
        )
      )}
    </React.Fragment>
  )
}
