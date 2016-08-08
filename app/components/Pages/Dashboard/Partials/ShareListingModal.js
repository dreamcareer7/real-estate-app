// Dashboard/Partials/ShareListingModal.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Button, Modal, Alert, DropdownButton, MenuItem } from 'react-bootstrap'
import { all_countries } from '../../../../utils/country-data'
import MaskedInput from 'react-maskedinput'
import controller from '../controller'
import ProfileImage from './ProfileImage'
import validator from 'validator'
export default class ShareListingModal extends Component {
  onShow() {
    setTimeout(() => {
      this.refs.message.focus()
    }, 100)
  }
  handleFilterChange(e) {
    const filter_text = e.target.value
    this.props.handleFilterChange(filter_text)
  }
  handleEmailChange(e) {
    if (e.which === 13)
      return this.handleAddEmail()
    const email = e.target.value
    this.props.handleEmailChange(email)
  }
  handleKeyUp(e) {
    if (e.which === 13)
      this.handleAddPhoneNumber()
  }
  handlePhoneNumberChange(e) {
    if (e.which === 13)
      return this.handleAddPhoneNumber()
    const phone_number = e.target.value
    this.props.handlePhoneNumberChange(phone_number)
  }
  handleAddEmail() {
    const email = this.refs.email.value
    if (!email.trim())
      return
    this.props.handleAddEmail(email)
    if (validator.isEmail(email))
      this.refs.email.value = ''
  }
  handleAddPhoneNumber() {
    const data = this.props.data
    const phone_number = data.share_modal.input_phone_number
    this.props.handleAddPhoneNumber(phone_number)
  }
  handleCountryCodeSelect(country) {
    controller.share_modal.handleCountryCodeSelect(country)
  }
  isSharable() {
    const data = this.props.data
    const share_modal = data.share_modal
    if (share_modal) {
      const rooms_added = share_modal.rooms_added
      const contacts_added = share_modal.contacts_added
      const emails_added = share_modal.emails_added
      const phone_numbers_added = share_modal.phone_numbers_added
      if (rooms_added && rooms_added.length)
        return true
      if (contacts_added && contacts_added.length)
        return true
      if (rooms_added && rooms_added.length)
        return true
      if (emails_added && emails_added.length)
        return true
      if (phone_numbers_added && phone_numbers_added.length)
        return true
    }
    return false
  }
  render() {
    const data = this.props.data
    const current_listing = data.current_listing
    const share_modal = data.share_modal
    let rooms_added
    let contacts_added
    let emails_added
    let phone_numbers_added
    let rooms_filtered
    let contacts_filtered
    if (share_modal) {
      rooms_filtered = share_modal.rooms_filtered
      contacts_filtered = share_modal.contacts_filtered
      rooms_added = share_modal.rooms_added
      contacts_added = share_modal.contacts_added
      emails_added = share_modal.emails_added
      phone_numbers_added = share_modal.phone_numbers_added
    }
    let message
    if (data.error) {
      message = (
        <Alert bsStyle="danger" closeButton className="text-left">{ data.error.message }</Alert>
      )
    }
    const contacts_rooms_scroll = {
      overflowY: 'scroll',
      ...S('absolute z-1000 bg-fff t-50 w-100p maxh-380 border-1-solid-ccc br-3')
    }
    let rooms_list
    if (rooms_filtered) {
      rooms_list = rooms_filtered.map(room => {
        // List users
        const users = room.users
        const first_names = _.map(users, 'first_name')
        let first_name_list = ''
        first_names.forEach((first_name, _i) => {
          first_name_list += first_name
          if (_i < first_names.length - 1) first_name_list += ', '
        })
        let author
        let profile_image_div
        if (room.latest_message && room.latest_message.author) {
          author = room.latest_message.author
          profile_image_div = (
            <ProfileImage data={ data } user={ author }/>
          )
        }
        if (!room.latest_message || !room.latest_message.author) {
          profile_image_div = (
            <div style={ S('absolute w-35') }>
              <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
            </div>
          )
        }
        return (
          <div onClick={ controller.share_modal.addToShareList.bind(this, 'rooms', room) } style={ S('relative h-60 pointer p-10') } className="share-item" key={ 'share-alert__room-' + room.id }>
            { profile_image_div }
            <div className="pull-left" style={ S('ml-50 w-90p') }>
              <div className="pull-left">
                <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...' : '' }</b>
              </div>
              <div className="clearfix"></div>
              <div style={ S('color-aaaaaa w-74p') }>{ first_name_list }</div>
            </div>
            <div className="clearfix"></div>
          </div>
        )
      })
    }
    let contacts_list
    if (contacts_filtered) {
      contacts_list = contacts_filtered.map(contact => {
        return (
          <div onClick={ controller.share_modal.addToShareList.bind(this, 'contacts', contact) } style={ S('h-60 relative p-3 pl-0 pr-10 mr-10 w-100p pointer p-10') } className="share-item" key={ 'share-alert__contact-' + contact.id }>
            <div style={ S('l-10 t-10 absolute') }>
              <ProfileImage data={ data } top={11} size={40} user={ contact }/>
            </div>
            <div style={ S('ml-65') }>
              <div>{ contact.first_name } { contact.last_name }</div>
              <div>{ contact.email }</div>
            </div>
          </div>
        )
      })
    }
    let rooms_list_area
    if (rooms_list && rooms_list.length) {
      rooms_list_area = (
        <div>
          <div style={ S('bg-f8f8f8 color-929292 p-10') }>Rooms ({ rooms_list.length })</div>
          { rooms_list }
        </div>
      )
    }
    let contacts_list_area
    if (contacts_list && contacts_list.length) {
      contacts_list_area = (
        <div>
          <div style={ S('bg-f8f8f8 color-929292 p-10') }>Contacts ({ contacts_list.length })</div>
          { contacts_list }
        </div>
      )
    }
    let results
    if (rooms_filtered || contacts_filtered) {
      results = (
        <div style={ contacts_rooms_scroll }>
          { rooms_list_area }
          { contacts_list_area }
        </div>
      )
    }
    let message_input_width = ' w-100p'
    if (data.is_mobile)
      message_input_width = ' w-79p'
    const message_style = {
      ...S('p-0 mb-5 border-1-solid-fff font-28 h-40 w-100p' + message_input_width),
      outline: 'none'
    }
    const pill_style = S('bg-dadada color-4c7dbf pr-10 pl-10 pt-5 pb-5 br-3 pull-left mr-5 mb-5')
    const items_added_pills = []
    let rooms_added_pills = []
    if (rooms_added) {
      rooms_added_pills = rooms_added.map(room => {
        return (
          <div key={ 'pill-room-' + room.id } style={ pill_style }>
            <span style={ S('mr-10') }>{ room.title }</span>
            <span onClick={ this.props.handleRemoveShareItem.bind(this, 'room', room) } className="close">&times;</span>
          </div>
        )
      })
      items_added_pills.push(rooms_added_pills)
    }
    let contacts_added_pills = []
    if (contacts_added) {
      contacts_added_pills = contacts_added.map(contact => {
        return (
          <div key={ 'pill-contact-' + contact.id } style={ pill_style }>
            <span style={ S('mr-10') }>{ contact.first_name } { contact.last_name }</span>
            <span onClick={ this.props.handleRemoveShareItem.bind(this, 'contact', contact) } className="close">&times;</span>
          </div>
        )
      })
      items_added_pills.push(contacts_added_pills)
    }
    let emails_added_pills = []
    if (emails_added) {
      emails_added_pills = emails_added.map(email => {
        return (
          <div key={ 'pill-contact-' + email } style={ pill_style }>
            <span style={ S('mr-10') }>{ email }</span>
            <span onClick={ this.props.handleRemoveShareItem.bind(this, 'email', email) } className="close">&times;</span>
          </div>
        )
      })
      items_added_pills.push(emails_added_pills)
    }
    let phone_numbers_added_pills = []
    if (phone_numbers_added) {
      phone_numbers_added_pills = phone_numbers_added.map(phone_number => {
        return (
          <div key={ 'pill-contact-' + phone_number } style={ pill_style }>
            <span style={ S('mr-10') }>{ phone_number }</span>
            <span onClick={ this.props.handleRemoveShareItem.bind(this, 'phone_number', phone_number) } className="close">&times;</span>
          </div>
        )
      })
      items_added_pills.push(phone_numbers_added_pills)
    }
    let items_added_area
    if (items_added_pills && items_added_pills.length) {
      let items_area_width = ' w-550'
      if (data.is_mobile)
        items_area_width = ' w-100p'
      items_added_area = (
        <div style={ S('pull-left' + items_area_width) }>
          { items_added_pills }
        </div>
      )
    }
    let filter_text
    if (share_modal && share_modal.filter_text)
      filter_text = share_modal.filter_text
    let email_btn_color = 'e5e5e5'
    let phone_number_btn_color = 'e5e5e5'
    if (share_modal) {
      filter_text = share_modal.filter_text
      if (share_modal.email_valid)
        email_btn_color = '006aff'
      if (share_modal.phone_number_valid)
        phone_number_btn_color = '006aff'
    }
    let dialog_class_name = 'modal-800'
    // Check if mobile
    if (data.is_mobile)
      dialog_class_name = 'modal-mobile'
    let phone_country = `+1`
    if (data.phone_country)
      phone_country = `+${data.phone_country.dialCode}`
    const country_codes = (
      <DropdownButton title={ phone_country } id="input-dropdown-country-codes" style={ S('pt-12 pb-13') }>
        <MenuItem key={ 1 } onClick={ this.handleCountryCodeSelect.bind(this, _.find(all_countries, { iso2: 'us' })) }>United States +1</MenuItem>
        {
          all_countries.map((country, i) => {
            if (country.dialCode !== 1)
              return <MenuItem onClick={ this.handleCountryCodeSelect.bind(this, country) } key={ country.iso2 + country.dialCode + i }>{ country.name } +{ country.dialCode }</MenuItem>
          })
        }
      </DropdownButton>
    )
    return (
      <Modal dialogClassName={ dialog_class_name } show={ data.show_share_listing_modal } onHide={ controller.listing_viewer.hideShareListingModal } onShow={ this.onShow.bind(this) }>
        <Modal.Header closeButton style={ S('border-bottom-1-solid-f8f8f8') }>
          <Modal.Title className="tempo" style={ S('font-36 ml-15') }>Share Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ S('p-30') }>
          <div style={ S('mb-20 h-100') }>
            <div style={ S('absolute mr-15') }>
              <div style={ S(`w-100 h-100 bg-cover bg-center bg-url(${ current_listing ? current_listing.cover_image_url : '' })`) }/>
            </div>
            <div style={ S('ml-115 w-85p') }>
              <input style={ message_style } ref="message" type="text" placeholder="Share message..." />
              <div style={ S('color-929292 font-16') }>Share listing</div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div style={ S('mb-10') }>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-14 l-20') } src={`/images/dashboard/mls/share-alert/chat${share_modal && share_modal.chat_valid ? '-active' : ''}.svg`} />
              <input onChange={ this.handleFilterChange.bind(this) } value={ filter_text } style={ S('pl-62 pull-left mr-10') } className="form-control input-lg" type="text" placeholder="Send to chatrooms and contacts"/>
              { results }
              <div className="clearfix"></div>
            </div>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-18 l-15') } src={`/images/dashboard/mls/share-alert/email${share_modal && share_modal.email_valid ? '-active' : ''}.svg`} />
              <input ref="email" onKeyUp={ this.handleEmailChange.bind(this) } style={ S('pl-62 pull-left mr-10') } className="form-control input-lg" type="text" placeholder="Send as an email"/>
              <div onClick={ this.handleAddEmail.bind(this) } style={ S('pointer absolute font-18 r-15 t-11 color-' + email_btn_color) }>Add Email</div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group" style={ S('relative') }>
              <div onClick={ this.handleAddPhoneNumber.bind(this) } style={ S('pointer z-100 absolute font-18 r-15 t-11 color-' + phone_number_btn_color) }>Add Number</div>
              <div className="input-group input-group-lg">
                <div className="input-group-btn input-dropdown--country-codes">
                  { country_codes }
                </div>
                <MaskedInput placeholder="Add phone number" onKeyUp={ this.handleKeyUp.bind(this) } onChange={ this.handlePhoneNumberChange.bind(this) } value={ data.share_modal ? data.share_modal.input_phone_number : '' } className="form-control" type="text" mask="(111)-111-1111" />
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
        </Modal.Body>
        <Modal.Footer style={ S('bg-f8f8f8') }>
          { message }
          { items_added_area }
          <Button onClick={ controller.listing_viewer.hideShareListingModal } bsStyle="link">Cancel</Button>
          <Button className={ share_modal && share_modal.sending_share || !this.isSharable() ? 'disabled' : '' } bsStyle="primary" onClick={ controller.listing_share.shareListing.bind(this) }>{ share_modal && !share_modal.sending_share ? 'Share Listing' : 'Sending...' }&nbsp;&nbsp;<i className="fa fa-share"></i></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
ShareListingModal.propTypes = {
  data: React.PropTypes.object,
  handleFilterChange: React.PropTypes.func,
  handleEmailChange: React.PropTypes.func,
  handlePhoneNumberChange: React.PropTypes.func,
  handleAddEmail: React.PropTypes.func,
  handleAddPhoneNumber: React.PropTypes.func,
  handleRemoveShareItem: React.PropTypes.func
}