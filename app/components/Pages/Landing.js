// Landing.js
import React, { Component } from 'react'
import { Col, Input, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import S from 'shorti'
import validator from 'validator'
import { randomString } from '../../utils/helpers'
import emojify from 'emojify.js'
import config from '../../../config/public'
emojify.setConfig({
  img_dir: '/images/emoji'
})
import AppDispatcher from '../../dispatcher/AppDispatcher'
import AppStore from '../../stores/AppStore'
import CheckEmailModal from '../Partials/CheckEmailModal'
export default class Landing extends Component {
  componentWillMount() {
    if (process.env.NODE_ENV === 'development')
      this.getContent()
  }
  componentDidMount() {
    AppStore.data.blinking_cursor = true
    AppStore.data.animation_started = true
    AppStore.data.current_text = 'smarter'
    AppStore.emitChange()
    setTimeout(() => {
      AppDispatcher.dispatch({
        action: 'landing-text-animation'
      })
    }, 3000)
    const branch = require('branch-sdk')
    branch.init(config.branch.key)
    branch.banner({
      icon: '/images/logo-big.png',
      title: 'Download the Rechat iOS app',
      description: 'For a better mobile experience',
      showDesktop: false,
      showAndroid: false,
      forgetHide: false,
      downloadAppButtonText: 'GET',
      openAppButtonText: 'OPEN',
      customCSS: '#branch-banner .button { color:  #3388ff; border-color: #3388ff; }'
    }, {})
  }
  getContent() {
    AppDispatcher.dispatch({
      action: 'get-content',
      slug: 'landing-page',
      rendered: 'client'
    })
  }
  showIntercom(e) {
    e.preventDefault()
    window.Intercom('show')
  }
  toggleNavBarLinks() {
    if (AppStore.data.navbar_in)
      delete AppStore.data.navbar_in
    else
      AppStore.data.navbar_in = true
    AppStore.emitChange()
  }
  setSignupEmail(e) {
    const email = e.target.value
    AppStore.data.signup_email = email
    AppStore.emitChange()
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
    const email = data.signup_email
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
  hideModal() {
    delete AppStore.data.show_signup_confirm_modal
    AppStore.emitChange()
  }
  render() {
    // Data
    const data = this.props.data
    let blinking_cursor = AppStore.data.blinking_cursor
    let video_src = AppStore.data.video_src
    if (!video_src)
      video_src = 'young_agent'
    let current_text = data.initial_text
    if (AppStore.data.animation_started)
      current_text = AppStore.data.current_text
    // Blinking cursor
    if (typeof blinking_cursor === 'undefined')
      blinking_cursor = true
    if (blinking_cursor)
      blinking_cursor = 'blinking-cursor'
    else
      blinking_cursor = ''

    // Content from data props
    // Styles
    const page_style = {
      position: 'relative',
      height: '100%',
      background: '#000',
      color: '#ffffff'
    }
    const navbar_style = {
      border: 'none',
      background: 'none'
    }
    const collapse_style = {
      ...S('mt-20'),
      border: 'none',
      boxShadow: 'none'
    }
    const headline_style = S('mb-35')
    const footer_style = {
      ...S('absolute b-0 w-100p mb-20 pt-20 color-ededed font-13  z-2'),
      borderTop: '1px solid rgba(168,168,168, 0.3)'
    }
    const current_text_style = {
      fontStyle: 'italic'
    }
    // Get video and text from random number
    const headline_text = (
      <div>
        From search to close be<br/><span style={ current_text_style }>{ current_text }</span><span className={ blinking_cursor }>|</span>
      </div>
    )
    const video = (
      <video style={ S('z-0 absolute') } autoPlay="true" loop="true" className="fullscreen-bg__video">
        <source src={'/videos/landing/' + video_src + '.webm'} type="video/webm"/>
        <source src={'/videos/landing/' + video_src + '.mp4'} type="video/mp4"/>
        <source src={'/videos/landing/' + video_src + '.ogv'} type="video/ogg"/>
      </video>
    )
    let login_btn_li_style
    let login_btn_style
    let signup_input_style = {
      ...S('h-37'),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
    const signup_btn_style = {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      login_btn_style = ' w-100p'
      login_btn_li_style = S('pl-15 pr-15')
      signup_input_style = {
        ...signup_input_style,
        width: window.innerWidth - 125
      }
    }
    let popover = <Popover id="popover" className="hidden" />
    if (data.errors) {
      if (data.errors.type === 'email-invalid') {
        popover = (
          <Popover id="popover" title="">You must enter a valid email</Popover>
        )
      }
      if (data.errors.type === 'email-in-use') {
        popover = (
          <Popover id="popover" title="">This email is already in use.  Follow the <a href="/password/forgot">forgot password process</a> or <a href="#" onClick={ this.showIntercom }>contact support</a>.</Popover>
        )
      }
      if (data.errors.type === 'bad-request') {
        popover = (
          <Popover id="popover" title="">Bad request.</Popover>
        )
      }
    }
    return (
      <div className="page-landing page-bg-video" style={ page_style }>
        <div className="overlay"></div>
        { video }
        <header style={ S('absolute w-100p z-3') }>
          <nav className="navbar navbar-default" style={ navbar_style }>
            <div className="container-fluid">
              <div className="navbar-header">
                <button onClick={ this.toggleNavBarLinks.bind(this) } style={ S('mt-15') } type="button" className="navbar-toggle collapsed" data-toggle="collapse" aria-expanded={ data.navbar_in ? 'true' : 'false' }>
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <div className="tk-calluna-sans pull-left" style={ S('font-28 mt-12 color-fff') }>Rechat</div>
              </div>
              <div style={ collapse_style } className={ `collapse navbar-collapse text-center${data.navbar_in ? ' in' : ''}` }>
                <ul className="nav navbar-nav navbar-right">
                  <li style={ login_btn_li_style }>
                    <a className="btn btn-default" href="/signin" style={ S('color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 mr-15' + login_btn_style) }>Log in</a>
                  </li>
                  <li>
                    <div style={ S('ml-15') }>
                      <form onSubmit={ this.handleEmailSubmit.bind(this) }>
                        <div style={ S('pull-left') }>
                          <OverlayTrigger trigger="focus" placement="bottom" overlay={ popover }>
                            <Input ref="email" onChange={ this.setSignupEmail } style={ signup_input_style } type="text" placeholder="Enter email address" value={ data.signup_email } />
                          </OverlayTrigger>
                        </div>
                        <div style={ S('pull-left') }>
                          <Button className={ data.submitting ? 'disabled' : '' } bsStyle="primary" style={ signup_btn_style } type="submit">{ data.submitting ? 'Submitting...' : 'Get started' }</Button>
                        </div>
                      </form>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main className="container" style={ S('h-100p z-2 relative') }>
          <div className="landing-main text-center" style={ S('h-100p') }>
            <div className="center-block" style={ S('maxw-750 mt-50n') }>
              <h1 className="tempo headline" style={ headline_style }>
                { headline_text }
              </h1>
            </div>
          </div>
        </main>
        <footer className="footer" style={ footer_style }>
          <div className="container">
            <Col className="footer-text footer-text--left" sm={6}>
              Made with <img src="/images/landing/heart.png" /> by Rechat | <a onClick={ this.showIntercom } href="#">Contact Us</a>
            </Col>
            <Col className="footer-text footer-text--right" sm={6}>
              Rechat Inc. &copy; { new Date().getFullYear() }. All Rights Reserved. <a href="/terms">Terms of Service</a> | <a href="/terms/mls">MLS Terms</a> | <a href="/privacy">Privacy Policy</a>
            </Col>
          </div>
        </footer>
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
Landing.propTypes = {
  data: React.PropTypes.object
}