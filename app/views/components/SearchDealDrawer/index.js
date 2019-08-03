import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'
import { selectDeals } from 'reducers/deals/list'

import Body from './Body'

const propTypes = {
  ...Drawer.propTypes,
  defaultSearchFilter: PropTypes.string,
  onSelect: PropTypes.func.isRequired
}

const defaultProps = {
  ...Drawer.defaultProps,
  defaultSearchFilter: ''
}

function SearchDealDrawer(props) {
  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <Drawer.Header title={props.title} />
      <Drawer.Body>
        <Body
          isDrawer
          user={props.user}
          deals={props.deals}
          itemRenderer={props.itemRenderer}
          handleSelectedItem={props.onSelect}
          defaultSearchFilter={props.defaultSearchFilter}
        />
      </Drawer.Body>
    </Drawer>
  )
}

SearchDealDrawer.propTypes = propTypes
SearchDealDrawer.defaultProps = defaultProps

function mapStateToProps(state) {
  return {
    user: state.user,
    deals: selectDeals(state.deals.list)
  }
}

export default connect(mapStateToProps)(SearchDealDrawer)
