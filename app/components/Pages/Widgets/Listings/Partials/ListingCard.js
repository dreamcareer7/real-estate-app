// Widgets/Partials/ListingCard.js
import React, { Component } from 'react'
import S from 'shorti'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'
import FavoriteHeart from '../../../Dashboard/Partials/FavoriteHeart'
import Brand from '../../../../../controllers/Brand'
import ActionBubble from '../../../Partials/ActionBubble'
export default class ListingCard extends Component {
  render() {
    const listing = this.props.listing
    const data = this.props.data
    let property = listing.property
    if (!property)
      property = listing.compact_property
    let address = listing.address
    if (!address)
      address = property.address
    const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
    let listing_card_style = {
      ...S('w-480 h-460 mr-10 ml-10 mb-20 pull-left br-3 pointer relative'),
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    }
    const listing_image_style = {
      ...S(`bg-cover bg-url(${listing_util.getResizeUrl(listing.cover_image_url)}?w=800) bg-center w-480 h-340 relative`)
    }
    let is_mobile
    // Responsive
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      listing_card_style.width = window.innerWidth - 20
      listing_card_style.height = listing_card_style.width * '.4'
      listing_card_style = {
        ...listing_card_style,
        ...S('ml-15')
      }
      if (window.innerWidth < 500) {
        listing_card_style.height = listing_card_style.width * '.6'
        listing_card_style.height = 253
        is_mobile = true
      }
      listing_image_style.width = listing_card_style.width
      listing_image_style.height = listing_card_style.height - 130
    }
    const overlay_style = {
      ...S('bg-000 absolute w-100p h-100p br-3'),
      opacity: '.3'
    }
    const price = helpers.numberWithCommas(listing.price)
    const price_tag_style = {
      ...S(`absolute b-30 p-15 pt-6 h-48 bg-${Brand.color('primary')} font-26 fw-500 color-fff`),
      borderTopRightRadius: '3px',
      borderBottomRightRadius: '3px'
    }
    let action_bubble
    if (data.signup_tooltip && data.signup_tooltip.listing === listing.id) {
      action_bubble = (
        <ActionBubble
          data={data}
          listing={listing}
          handleEmailSubmit={this.props.handleEmailSubmit}
          handleListingInquirySubmit={this.props.handleListingInquirySubmit}
          handleCloseSignupForm={this.props.handleCloseSignupForm}
          handleLoginClick={this.props.handleLoginClick}
          showIntercom={this.props.showIntercom}
        />
      )
    }
    const status_color = listing_util.getStatusColor(listing.status)
    let year_built_area
    if (property.year_built) {
      year_built_area = (
        <span>
          &nbsp;&middot;&nbsp;{ property.year_built ? `Built in ${property.year_built}` : '' }
        </span>
      )
    }
    let agent_image_area
    if (listing.list_agent) {
      let avatar = (
        <div style={S(`bg-url(${Brand.asset('default_avatar')}) w-50 h-50 bg-center bg-cover br-100`)} />
      )
      const profile_image_url = listing.list_agent.profile_image_url
      if (profile_image_url) {
        avatar = (
          <div style={S(`bg-url(${profile_image_url}) w-50 h-50 bg-center bg-cover br-100`)} />
        )
      }
      let online_indicator
      let bg_color = 'dddfe0'
      if (listing.list_agent.online_state) {
        if (listing.list_agent.online_state === 'Online' || listing.list_agent.online_state === 'Background')
          bg_color = '35b863'
      }
      online_indicator = <div style={S(`br-100 bg-${bg_color} w-13 h-13 bw-2 solid bc-fff absolute z-2 t-2n r-2`)} />
      agent_image_area = (
        <div onClick={this.props.handleAgentClick.bind(this, listing)} style={S(`p-0 br-100 border-2-solid-fff absolute r-20 b-${is_mobile ? '103' : '90'} bg-ccc`)}>
          { online_indicator }
          { avatar }
        </div>
      )
    }

    let extra_info = ''
    if (data.resent_email_confirmation) {
      extra_info = (
        <div>
          <div>{ data.new_user.email }</div>
          <div>Confirmation email resent</div>
        </div>
      )
    } else if (data.new_user) {
      extra_info = (
        <div>{ data.new_user.email }</div>
      )
    }

    let signup_confirm_message
    if (data.show_signup_confirm_modal && data.signup_tooltip && data.signup_tooltip.listing === listing.id && !data.new_user.email_confirmed) {
      signup_confirm_message = (
        <div style={S('absolute z-100 w-100p h-100p t-0 bg-fff')}>
          <div onClick={this.props.hideModal} className="close" style={S('font-30 t-10 r-20 absolute')}>&times;</div>
          <div className="text-center">
            <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-30 w-280' : ''}`)}>
              <img style={S('h-68 relative')} src={Brand.asset('site_logo')} />
            </div>
            <div className="din" style={S('color-263445 font-34 mb-10')}>Please verify your email</div>
            <div style={S('color-263445 font-21 mb-20')}>
              { extra_info }
            </div>
          </div>
          <div style={S('bg-e2e6ea p-20 pt-20 absolute w-100p b-0')}>
            <div className="text-center">
              <div style={S('color-9b9b9b font-16 mb-15')}>
                <div>
                  Didn’t get the email?
                </div>

                <div>
                  <a onClick={this.props.resend.bind(this)} href="#">Resend</a> | <a href="mailto:support@rechat.com">Contact support</a>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (data.errors && data.errors.type === 'email-in-use' && data.signup_tooltip.listing === listing.id) {
      signup_confirm_message = (
        <div style={S('absolute z-100 w-100p h-100p t-0 bg-fff')}>
          <div onClick={this.props.hideModal} className="close" style={S('font-30 t-10 r-20 absolute')}>&times;</div>
          <div className="text-center">
            <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-30 w-280' : ''}`)}>
              <img style={S('h-68 relative')} src={Brand.asset('site_logo')} />
            </div>
            <div style={S('color-9b9b9b text-center mb-20 font-21')}>This email address is already in use.</div>
            <div style={S('color-9b9b9b text-center')}>
              <span style={S('pointer')} className="text-primary btn btn-primary" onClick={this.props.handleLoginClick.bind(this, listing.id)}>Log in</span>
            </div>
          </div>
          <div style={S('bg-e2e6ea p-20 pt-20 absolute w-100p b-0')}>
            <div className="text-center">
              <div style={S('color-9b9b9b font-16 mb-15')}>
                <div>
                  <a href="mailto:support@rechat.com">Contact support</a>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (data.errors && data.errors.type === 'bad-request' && data.signup_tooltip.listing === listing.id) {
      signup_confirm_message = (
        <div style={S('absolute z-100 w-100p h-100p t-0 bg-fff')}>
          <div onClick={this.props.hideModal} className="close" style={S('font-30 t-10 r-20 absolute')}>&times;</div>
          <div className="text-center">
            <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-50 w-280' : ''}`)}>
              <img style={S('h-68 relative')} src={Brand.asset('site_logo')} />
            </div>
            <div style={S('color-9b9b9b text-center mb-20 font-21')}>There was an error with this request.</div>
            <div style={S('color-9b9b9b text-center')}>
              <span style={S('pointer')} className="text-primary btn btn-primary" onClick={this.props.handleLoginClick.bind(this, listing.id)}>Log in</span>
            </div>
          </div>
          <div style={S('bg-e2e6ea p-20 pt-20 absolute w-100p b-0')}>
            <div className="text-center">
              <div style={S('color-9b9b9b font-16 mb-15')}>
                <div>
                  <a href="mailto:support@rechat.com">Contact support</a>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={`listing-viewer-${listing.id}-${helpers.randomString(10)}`} style={listing_card_style}>
        <FavoriteHeart
          listing={listing}
        />
        <div style={listing_image_style} onClick={this.props.handleListingClick.bind(this, listing)}>
          <div style={overlay_style} />
          <div style={price_tag_style}>
            ${ price }{ listing.compact_property && listing.compact_property.property_type === 'Residential Lease' ? '/mo' : '' }
          </div>
        </div>
        <div style={S('absolute b-40 h-80 p-10 pl-15 color-000')} onClick={this.props.handleListingClick.bind(this, listing)}>
          <div style={S('font-20')}>{ listing_util.addressTitle(address) }</div>
          <div style={S('font-15')}>
            <div style={S(`mt-8${data.is_mobile ? ' font-14' : ''}`)}>
              <span>{ property.bedroom_count } Beds</span>
              &nbsp;&middot;&nbsp;
              <span>{ property.bathroom_count } Baths</span>
              &nbsp;&middot;&nbsp;
              <span>{ square_feet } Sqft</span>
              { year_built_area }
            </div>
          </div>
          <div style={S('font-15')}>
            <div style={S(`pull-left mr-15 mt-18${data.is_mobile ? ' font-14' : ''}`)}>
              <div style={S(`pull-left w-10 h-10 br-100 mr-8 bg-${status_color}`)} />
              <div style={S(`pull-left mt-5n color-${status_color}`)}>
                { listing.status }
              </div>
            </div>
            <div style={S('pull-left relative t-17 w-1 h-14 bg-e5e5e5 mr-15')} />
            <div style={S('pull-left mr-10 mt-13 color-8696a4')}>
              { Brand.side(listing) }
            </div>
          </div>
        </div>
        { agent_image_area }
        { action_bubble }
        { signup_confirm_message }
      </div>
    )
  }
}
ListingCard.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  handleEmailSubmit: React.PropTypes.func,
  handleListingInquirySubmit: React.PropTypes.func,
  handleCloseSignupForm: React.PropTypes.func,
  handleListingClick: React.PropTypes.func,
  handleAgentClick: React.PropTypes.func,
  handleLoginClick: React.PropTypes.func,
  showIntercom: React.PropTypes.func,
  resend: React.PropTypes.func,
  hideModal: React.PropTypes.func
}