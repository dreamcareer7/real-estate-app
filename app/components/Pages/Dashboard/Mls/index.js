// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import GoogleMap from 'google-map-react'
import { ButtonGroup, Button } from 'react-bootstrap'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from '../controller'
import SideBar from '../Partials/SideBar'
import ShareAlertModal from './Partials/ShareAlertModal'
import ListingViewer from '../Partials/ListingViewer'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'
import ListingMarker from '../Partials/ListingMarker'
export default class Mls extends Component {
  componentWillMount() {
    const data = this.props.data
    const user = data.user
    AppStore.data.user = user
    AppStore.emitChange()
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      controller.listing_map.initMap()
    delete AppStore.data.current_listing
    delete AppStore.data.share_list
    delete AppStore.data.listing_map.saving_alert
    // Set switch states
    if (!AppStore.data.listing_map.filter_options) {
      AppStore.data.listing_map.filter_options = {
        sold: false,
        active: true,
        other: false,
        open_houses: false,
        listing_types: ['house'],
        status_options: {
          active: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
        }
      }
    }
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'get-rooms',
      user
    })
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
    })
  }
  componentDidUpdate() {
    const data = this.props.data
    if (!data.current_listing && data.path !== '/dashboard/mls') {
      const history = require('../../../../utils/history')
      history.replaceState(null, '/dashboard/mls')
      delete AppStore.data.current_listing
      AppStore.emitChange()
    }
  }
  componentWillUnmount() {
    controller.listing_map.hideModal()
    controller.listing_viewer.hideListingViewer()
  }
  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    const main_style = S('absolute h-100p l-70')
    let map_listing_markers
    let loading
    if (listing_map && listing_map.listings) {
      const listings = listing_map.listings
      map_listing_markers = listings.map(listing => {
        return (
          <div onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) } onMouseOut={ controller.listing_map.hideListingPopup.bind(this) } key={ 'map-listing-' + listing.id } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            <ListingMarker
              key={ 'listing-marker' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.compact_property }
              address={ listing.address }
              context={ 'map' }
            />
          </div>
        )
      })
    }
    if (listing_map && listing_map.is_loading) {
      loading = (
        <div style={ S('z-1 center-block relative h-0 w-400 t-20') }>
          <div style={ S('bg-3388ff br-20 color-fff w-190 h-29 pt-5 center-block text-center') }>Loading MLS&reg; Listings...</div>
        </div>
      )
    }
    let listing_viewer
    if (data.show_listing_viewer) {
      listing_viewer = (
        <ListingViewer
          data={ data }
          listing={ data.current_listing }
          hideModal={ controller.listing_map.hideModal }
          hideListingViewer={ controller.listing_viewer.hideListingViewer }
          showModalGallery={ controller.listing_viewer.showModalGallery }
          handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
          showShareListingModal={ controller.listing_viewer.showShareListingModal }
        />
      )
    }
    let main_class = 'listing-map'
    if (data.show_listing_panel)
      main_class = main_class + ' active'
    const default_center = {
      lat: 32.7767,
      lng: -96.7970
    }
    const default_zoom = 13
    const toolbar_style = {
      ...S('h-62 p-10'),
      borderBottom: '1px solid #dcd9d9'
    }
    // TODO move to ENV_VAR
    const bootstrap_url_keys = {
      key: 'AIzaSyDagxNRLRIOsF8wxmuh1J3ysqnwdDB93-4',
      libraries: ['drawing'].join(',')
    }
    let map_id
    if (listing_map && listing_map.map_id)
      map_id = listing_map.map_id
    let remove_drawing_button
    if (window.poly) {
      let right_value = 80
      if (data.listing_panel)
        right_value = 910
      remove_drawing_button = (
        <Button
          onClick={ controller.listing_map.removeDrawing.bind(this) }
          bsStyle="danger"
          className="transition"
          style={ S('absolute z-1000 t-80 br-100 w-50 h-50 color-fff pt-1 font-30 text-center r-' + right_value) }
        >
          &times;
        </Button>
      )
    }
    let zoom_right = 'r-20'
    if (data.show_listing_panel)
      zoom_right = 'r-860'
    const zoom_controls = (
      <ButtonGroup className="transition" vertical style={ S('absolute b-25 ' + zoom_right) }>
        <Button bsSize="large" onClick={ controller.listing_map.handleZoomClick.bind(this, 'in') }><i style={ S('color-929292') } className="fa fa-plus"></i></Button>
        <Button bsSize="large" onClick={ controller.listing_map.handleZoomClick.bind(this, 'out') }><i style={ S('color-929292') } className="fa fa-minus"></i></Button>
      </ButtonGroup>
    )
    let results_actions
    if (listing_map && listing_map.listings) {
      results_actions = (
        <div style={ S('absolute r-10 mt-2') }>
          <span style={ S('bg-a5c0e5 br-3 p-10 color-fff mr-10 relative t-1') }>
            { listing_map.listings.length } Matches
            &nbsp;&nbsp;&nbsp;<span style={ S('pointer') } onClick={ controller.listing_map.handleRemoveListings.bind(this) }>&times;</span>&nbsp;
          </span>
          <Button bsStyle="primary" type="button" onClick={ controller.listing_map.showShareModal.bind(this) }>
            Share ({ listing_map.listings.length })
            &nbsp;&nbsp;<i className="fa fa-share"></i>
          </Button>
        </div>
      )
    }
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <div className={ main_class } style={ main_style }>
            <nav style={ toolbar_style }>
              <div style={ S('pull-left mr-10') }>
                <form onSubmit={ controller.listing_map.handleSearchSubmit.bind(this) }>
                  <img src="/images/dashboard/mls/search.svg" style={ S('w-22 h-22 absolute l-18 t-18') } />
                  <input ref="search_input" className="form-control" type="text" style={ S('font-18 bg-dfe3e8 w-400 pull-left pl-40') } placeholder="Search location or MLS#" />
                </form>
              </div>
              <div style={ S('pull-left') }>
                <Button onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { ...S('mr-10'), outline: 'none' } }>
                  <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
                  <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
                </Button>
                <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ { ...S('mr-10'), outline: 'none' } }>
                  <img src={ `/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
                </Button>
                <ButtonGroup style={ S('mr-10') }>
                  <Button style={ { outline: 'none' } } onClick={ controller.listing_panel.showPanelView.bind(this, 'list') }>
                    <img src={ `/images/dashboard/mls/list${data.listing_panel && data.listing_panel.view === 'list' ? '-active' : ''}.svg` } style={ S('w-20') }/>
                  </Button>
                  <Button style={ { outline: 'none' } } onClick={ controller.listing_panel.showPanelView.bind(this, 'photos') }>
                    <img src={ `/images/dashboard/mls/photos${data.listing_panel && data.listing_panel.view === 'photos' ? '-active' : ''}.svg` } style={ S('w-18') }/>
                  </Button>
                </ButtonGroup>
              </div>
              { results_actions }
            </nav>
            { loading }
            <div style={ S('h-' + (window.innerHeight - 62)) }>
              { remove_drawing_button }
              <GoogleMap
                key={ 'map-' + map_id }
                bootstrapURLKeys={ bootstrap_url_keys }
                center={ listing_map ? listing_map.center : default_center }
                zoom={ listing_map ? listing_map.zoom : default_zoom }
                onBoundsChange={ controller.listing_map.handleBoundsChange.bind(this) }
                options={ controller.listing_map.createMapOptions.bind(this) }
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={ controller.listing_map.handleGoogleMapApi.bind(this) }
              >
              { map_listing_markers }
              </GoogleMap>
            </div>
          </div>
          { listing_viewer }
          <ListingPanel
            data={ data }
            toggleListingPanel={ controller.listing_panel.toggleListingPanel }
            showListingViewer={ controller.listing_viewer.showListingViewer }
            sortListings={ controller.listing_panel.sortListings }
            setActiveListing={ controller.listing_map.setActiveListing }
            removeActiveListing={ controller.listing_map.removeActiveListing }
          />
          <FilterForm
            data={ data }
            handleFilterSwitch={ controller.listing_filter.handleFilterSwitch }
            handleFilterButton={ controller.listing_filter.handleFilterButton }
            resetFilterOptions={ controller.listing_filter.resetFilterOptions }
            setFilterOptions={ controller.listing_filter.setFilterOptions }
            handleOptionChange={ controller.listing_filter.handleOptionChange }
            toggleListingStatusDropdown={ controller.listing_filter.toggleListingStatusDropdown }
            handleFilterStatusOptionSelect={ controller.listing_filter.handleFilterStatusOptionSelect }
          />
          { zoom_controls }
          <ShareAlertModal
            data={ data }
            shareAlert={ controller.listing_share.shareAlert }
            handleShareFilter={ controller.share_modal.handleShareFilter }
            handleEmailChange={ controller.share_modal.handleEmailChange }
            handlePhoneNumberChange={ controller.share_modal.handlePhoneNumberChange }
            handleAddEmail={ controller.share_modal.handleAddEmail }
            handleAddPhoneNumber={ controller.share_modal.handleAddPhoneNumber }
            handleRemoveShareItem={ controller.share_modal.handleRemoveShareItem }
          />
        </main>
      </div>
    )
  }
}
Mls.propTypes = {
  data: React.PropTypes.object
}