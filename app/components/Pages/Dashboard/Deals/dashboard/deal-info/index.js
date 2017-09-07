import React from 'react'
import ListingCard from '../listing-card'
import ListingViewer from '../listing-viewer'
import FactSheet from '../factsheet'
import Roles from '../roles'

export default ({
  deal,
  showBackButton = true
}) => (
  <div>
    <ListingCard
      deal={deal}
      showBackButton={showBackButton}
    />

    <ListingViewer
      deal={deal}
    />

    <div className="scrollable">
      <Roles deal={deal} />
      <FactSheet deal={deal} />
    </div>
  </div>
)
