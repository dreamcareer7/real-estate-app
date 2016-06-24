// Search.js
import React, { Component } from 'react'
import { Input } from 'react-bootstrap'
import S from 'shorti'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import listing_util from '../../../../utils/listing'
export default class Search extends Component {
  handleListingClick(id) {
    window.open('https://rechat.com/dashboard/mls/' + id)
  }
  handleOnChange(e) {
    // Reset up / down
    if (AppStore.data.widget) {
      delete AppStore.data.widget.active_listing
      AppStore.emitChange()
    }
    const q = e.target.value
    if (!q.trim()) {
      delete AppStore.data.widget.listings
      AppStore.emitChange()
      return
    }
    ListingDispatcher.dispatch({
      action: 'search-listing-widget',
      q
    })
  }
  handleSubmit(q) {
    const data = this.props.data
    const widget = data.widget
    // Send to full listing
    if (widget && widget.listings && typeof widget.active_listing !== 'undefined') {
      const id = widget.listings[widget.active_listing].id
      window.open('https://rechat.com/dashboard/mls/' + id)
      return
    }
    // Send to search map
    if (q)
      window.open('http://claystapp.com/search?q=' + q)
  }
  handleKeyDown(e) {
    const data = AppStore.data
    const q = encodeURIComponent(e.target.value)
    if (!data.widget)
      return
    if (e.which === 13)
      this.handleSubmit(q)
    const listings = data.widget.listings
    if (typeof data.widget.active_listing === 'undefined')
      AppStore.data.widget.active_listing = 0
    // Down
    if (e.which === 40) {
      if (data.widget.active_listing === listings.length - 1)
        AppStore.data.widget.active_listing = 0
      else
        AppStore.data.widget.active_listing = data.widget.active_listing + 1
    }
    // Up
    if (e.which === 38) {
      if (!data.widget.active_listing)
        AppStore.data.widget.active_listing = listings.length - 1
      else
        AppStore.data.widget.active_listing = data.widget.active_listing - 1
    }
    AppStore.emitChange()
  }
  render() {
    const data = this.props.data
    const widget = data.widget
    let listing_list
    if (widget && widget.listings) {
      const listings = widget.listings
      const active_listing = widget.active_listing
      listing_list = listings.map((listing, i) => {
        let bg_color = ''
        if (active_listing === i)
          bg_color = ' bg-EDF7FD'
        let cover_image = <div style={ S('bg-929292 w-87 h-50 color-fff text-center pt-15') }>No Image</div>
        if (listing.cover_image_url) {
          cover_image = (
            <div style={ S(`w-87 h-50 bg-cover bg-center bg-url(${listing.cover_image_url})`) }></div>
          )
        }
        return (
          <div onClick={ this.handleListingClick.bind(this, listing.id) } key={ listing.id } className="search-listings__listing" style={ S('br-3 h-62 relative pointer p-5 ' + bg_color) }>
            <div className="pull-left" style={ S('mr-10') }>{ cover_image }</div>
            <div style={ S('mt-5') } className="pull-left">
              <span style={ S('color-666') }>
                <span style={ S('mr-10') }><b>{ listing.address.street_number } { listing.address.street_name } { listing.address.street_suffix }</b></span>
                <span style={ S('mr-10 font-12 color-929292') }>
                  <span style={ S('font-20 t-5 absolute color-' + listing_util.getStatusColor(listing.status)) }>&#8226;</span>
                  <span style={ S('ml-12') }>{ listing.status }</span>
                </span>
                <br/>
                <span style={ S('color-929292 font-10') }>{ listing.address.city }, { listing.address.state }</span>
              </span>
            </div>
            <div className="clearfix"></div>
          </div>
        )
      })
    }
    let listing_area
    if (listing_list) {
      listing_area = (
        <div style={ { overflow: 'scroll', ...S('bg-fff br-3 maxh-250') } }>{ listing_list }</div>
      )
    }
    return (
      <div>
        <div style={ S('absolute z-0 t-0 l-0 w-100p h-100p bg-cover bg-center bg-url(/images/widgets/stapp-search.jpg)') }></div>
        <div style={ S('absolute z-1 t-0 l-0 w-100p h-100p bg-000 op-.5') }></div>
        <div style={ S('relative z-2 p-10') }>
          <div style={ S('relative t-250 maxw-770 center-block') }>
            <Input onKeyDown={ this.handleKeyDown.bind(this) } onChange={ this.handleOnChange } style={ S('h-76') } type="text" bsSize="large" placeholder="Search for an address, neighborhood, or MLS#" />
            { listing_area }
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
Search.propTypes = {
  data: React.PropTypes.object
}