import React from 'react'

import { Tooltip } from '@material-ui/core'
import { mdiCrosshairsGps } from '@mdi/js'
import { connect } from 'react-redux'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getUserLocationIsFetching } from '../../../../../../../reducers/listings/map/user-location'
import { getLocation } from '../../../../../../../store_actions/listings/map/user-location'

import { Button } from './styled'

class LocationButton extends React.Component {
  onClick = () => {
    if (!this.props.isFetching) {
      this.props.dispatch(getLocation())
    }
  }

  render() {
    return (
      <Tooltip title="Get your exact location on the map">
        <Button
          isFit
          inverse
          iconSize="large"
          onClick={this.onClick}
          disabled={this.props.isFetching}
        >
          <SvgIcon path={mdiCrosshairsGps} />
        </Button>
      </Tooltip>
    )
  }
}

function mapStateToProps(state) {
  const isFetching =
    getUserLocationIsFetching(state.search.map.userLocation) ||
    state.search.listings.isFetching

  return { isFetching }
}

export default connect(mapStateToProps)(LocationButton)
