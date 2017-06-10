import _ from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Loading from '../components/Loading'
import SearchToolbar from './components/SearchToolbar'
import { selectListings } from '../../../../../reducers/listings'

import getFavorites from
  '../../../../../store_actions/listings/favorites/get-favorites'
import getListings from
  '../../../../../store_actions/listings/search/get-listings'

const actions = {
  getListings,
  getFavorites
}

let mapOnChangeDebounce = 0

class Search extends Component {
  componentDidMount() {
    this._fetchFavorites()
  }

  componentWillReceiveProps(nextProps) {
    this._fetchSearchListings(nextProps)
  }

  _fetchSearchListings(nextProps) {
    const { mapProps: nextMapProps } = nextProps
    const { mapProps, getListings } = this.props

    if (!_.isEqual(mapProps, nextMapProps)) {
      if (!mapOnChangeDebounce) {
        mapOnChangeDebounce = 1
        getListings(nextMapProps)
      } else {
        clearTimeout(mapOnChangeDebounce)
        mapOnChangeDebounce = setTimeout(() => {
          getListings(nextMapProps)
          clearTimeout(mapOnChangeDebounce)
        }, 300)
      }
    }
  }

  _fetchFavorites() {
    const {
      user,
      getFavorites,
      favoritesListings
    } = this.props

    if (!favoritesListings.length) {
      getFavorites(user)
    }
  }

  render() {
    return (
      <div>
        {this.props.isFetching && <Loading text="MLS®" />}
        <Map {...this.props} />
        <SearchToolbar />
      </div>
    )
  }
}

const mapStateToProps = ({
  data,
  search,
  favorites
}) => {
  const { listings: searchListings, map } = search
  const { listings: favoritesListings } = favorites
  return ({
    map,
    user: data.user,
    mapProps: map.props,
    isFetching: searchListings.isFetching,
    markers: selectListings(searchListings),
    favoritesListings: selectListings(favoritesListings)
  })
}

export default connect(
  mapStateToProps,
  actions
)(Search)
