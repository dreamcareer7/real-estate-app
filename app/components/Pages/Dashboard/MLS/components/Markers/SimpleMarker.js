import React from 'react'

import ButtonBase from '@material-ui/core/ButtonBase'

import { changeUrl } from '@app/utils/change-url'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

import ListingMarker from '../ListingMarker'

const setMarkerCssPosition = listing => {
  const position = {
    position: 'absolute',
    top: 0,
    left: 0
  }

  if (listing.cssPosition) {
    const { left, top } = listing.cssPosition

    return {
      ...position,
      top,
      left
    }
  }

  return position
}

const SimpleMarker = ({ listing, isWidget }) => {
  const [isHoverd, setIsHoverd] = React.useState(false)
  const [isListingOpen, setIsListingOpen] = React.useState(false)

  const closeListing = () => {
    if (!isWidget) {
      window.history.back()
    }

    setIsListingOpen(false)
  }

  const handleClick = React.useCallback(() => {
    if (!isWidget) {
      changeUrl(`/dashboard/mls/${listing.id}`)
    }

    setIsListingOpen(true)
  }, [listing.id, isWidget])

  return (
    <>
      <ButtonBase
        className="single-marker"
        onMouseLeave={() => setIsHoverd(false)}
        onMouseEnter={() => setIsHoverd(true)}
        onClick={handleClick}
        style={setMarkerCssPosition(listing)}
      >
        <ListingMarker
          context="map"
          listing={listing}
          popupIsActive={isHoverd}
        />
      </ButtonBase>
      <ListingDetailsModal
        isWidget={!!isWidget}
        isOpen={isListingOpen}
        listingId={listing.id}
        closeHandler={closeListing}
      />
    </>
  )
}
export default SimpleMarker
