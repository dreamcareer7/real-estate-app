// Listings.js
import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import S from 'shorti'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import Loading from '../../../Partials/Loading'
import ListingCard from './Partials/ListingCard'
import AppStore from '../../../../stores/AppStore'
import validator from 'validator'
import { randomString } from '../../../../utils/helpers'
import CheckEmailModal from '../../../Partials/CheckEmailModal'
export default class Listings extends Component {
  componentDidMount() {
    const data = this.props.data
    // Testing
    const user = data.user
    const location = data.location
    const brokerage = location.query.brokerage
    const options = this.initOptions(brokerage)
    ListingDispatcher.dispatch({
      action: 'get-valerts-widget',
      user,
      options
    })
  }
  initOptions(brokerage) {
    const options = {
      maximum_price: 900000001,
      limit: '75',
      maximum_lot_square_meters: 100000000,
      minimum_bathrooms: 1,
      maximum_square_meters: 10000000,
      location: {
        longitude: -96.79698789999998,
        latitude: 32.7766642
      },
      horizontal_distance: 2830,
      property_type: 'Residential',
      vertical_distance: 2830,
      minimum_square_meters: 0,
      listing_statuses: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract'],
      minimum_lot_square_meters: 0,
      currency: 'USD',
      maximum_year_built: 2016,
      minimum_year_built: 0,
      points: null,
      minimum_bedrooms: 0,
      minimum_price: 0,
      open_house: false,
      property_subtypes: ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse'],
      list_offices: [brokerage]
    }
    return options
  }
  handleButtonClick(type) {
    const data = this.props.data
    const user = data.user
    const location = data.location
    const brokerage = location.query.brokerage
    const options = this.initOptions(brokerage)
    AppStore.data.widget.is_loading_listings = true
    if (type === 'sold') {
      options.listing_statuses = ['Sold']
      AppStore.data.widget.is_showing_sold = true
    } else {
      options.listing_statuses = ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
      delete AppStore.data.widget.is_showing_sold
    }
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts-widget',
      user,
      options
    })
  }
  showIntercom(e) {
    e.preventDefault()
    window.Intercom('show')
  }
  handleEmailSubmit(e) {
    // If clicked
    setTimeout(() => {
      this.refs.email.refs.input.focus()
    }, 100)
    e.preventDefault()
    delete AppStore.data.errors
    AppStore.emitChange()
    const data = this.props.data
    const email = this.refs.email.refs.input.value
    // If no email or double submit
    if (!email || data.submitting)
      return
    const random_password = randomString(9)
    if (!email.trim())
      return
    if (!validator.isEmail(email)) {
      AppStore.data.errors = {
        type: 'email-invalid'
      }
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.errors
        AppStore.emitChange()
      }, 3000)
      return
    }
    AppStore.data.submitting = true
    AppStore.emitChange()
    const user = {
      first_name: email,
      email,
      user_type: 'Client',
      password: random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
  hideModal() {
    delete AppStore.data.show_signup_confirm_modal
    AppStore.emitChange()
  }
  resend() {
    const data = this.props.data
    const new_user = data.new_user
    const user = {
      first_name: new_user.email,
      email: new_user.email,
      user_type: 'Client',
      password: new_user.random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppStore.data.resent_email_confirmation = true
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
  render() {
    // Data
    const data = this.props.data
    const widget = data.widget
    if (!widget || widget.loading) {
      return (
        <div style={ S('text-center') }>
          <Loading />
        </div>
      )
    }
    const listings = widget.listings
    let listings_area = listings.map(listing => {
      return (
        <ListingCard
          handleEmailSubmit={ this.handleEmailSubmit }
          key={ listing.id }
          data={ data }
          listing={ listing }
        />
      )
    })
    if (widget.is_loading_listings)
      listings_area = <Loading />
    const header_style = S('text-center')
    const status_buttons_area_style = S('text-center mb-20')
    return (
      <div style={ S('pt-20') }>
        <div style={ header_style }>
          <h1 className="din" style={ S('font-50 color-263445') }>Our Exclusive Listings</h1>
          <span style={ S('h-1 bg-e2e2e2 w-80 m-20 inline-block') }></span>
        </div>
        <div style={ status_buttons_area_style }>
          <ButtonGroup>
            <Button onClick={ this.handleButtonClick.bind(this, 'active')} bsStyle={ widget && widget.is_showing_sold ? 'default' : 'primary'}>Active</Button>
            <Button onClick={ this.handleButtonClick.bind(this, 'sold')} bsStyle={ widget && widget.is_showing_sold ? 'primary' : 'default'}>Sold</Button>
          </ButtonGroup>
        </div>
        { listings_area }
        <CheckEmailModal
          data={ data }
          hideModal={ this.hideModal }
          showIntercom={ this.showIntercom }
          resend={ this.resend }
        />
      </div>
    )
  }
}

// PropTypes
Listings.propTypes = {
  data: React.PropTypes.object
}