// Sidebar.js
import S from 'shorti'
import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Link, browerHistory } from 'react-router'
import Intercom from 'react-intercom'
import { Dropdown } from 'react-bootstrap'

import Brand from '../../../../../controllers/Brand'

// utils
import { hasUserAccess, getUserRoles } from '../../../../../utils/user-acl'

// chatroom stuff
import Inbox from '../../Chatroom/Shared/instant-trigger'

// deals notification badge counter
import DealsNotifications from '../../Deals/components/sidebar-badge'

const ACTIVE_COLOR = `#${Brand.color('primary', '3388ff')}`
const DEFAULT_COLOR = '#8da2b5'

const getActivePath = path => {
  const checkPath = filter => (path.match(filter) || {}).input

  switch (path) {
    case checkPath(/\/dashboard\/mls/):
      return 'MAP'
    case checkPath(/\/dashboard\/contacts/):
      return 'CONTACTS'
    case '/dashboard/notifications':
      return 'NOTIF'
    case '/dashboard/website':
      return 'STORE'
    case checkPath(/\/dashboard\/deals/):
      return 'DEALS'
    default:
      return ''
  }
}

const IntercomCloseButton = ({ onClick }) => (
  <button onClick={onClick} className="intercom__close-btn">
    <svg
      fill="#333"
      height="32"
      viewBox="0 0 24 24"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  </button>
)

const NavbarItem = ({ children, isActive }) => (
  <li className={`c-app-navbar__item ${isActive ? 'is-active' : ''}`}>{children}</li>
)

const appNavbar = ({
  user,
  activePath,
  activeIntercom,
  intercomIsActive,
  unactiveIntercom,
  appNotifications
}) => {
  const intercomUser = {
    user_id: user.id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`
  }

  const roles = getUserRoles(user)
  const hasDealsPermission = roles.includes('Deals')
  const hasBackOfficePermission = roles.includes('BackOffice')

  return (
    <aside className="c-app-navbar">
      <ul className="c-app-navbar__list c-app-navbar__list--top">
        <NavbarItem>
          <Inbox />
        </NavbarItem>

        <NavbarItem isActive={activePath === 'MAP'}>
          <Link to="/dashboard/mls" className="c-app-navbar__item__title">
            MLS
          </Link>
        </NavbarItem>

        {user.user_type !== 'Client' && (
          <NavbarItem isActive={activePath === 'CONTACTS'}>
            <Link to="/dashboard/contacts" className="c-app-navbar__item__title">
              Contacts
            </Link>
          </NavbarItem>
        )}

        {(hasDealsPermission || hasBackOfficePermission) && (
          <NavbarItem isActive={activePath === 'DEALS'}>
            <Link to="/dashboard/deals" className="c-app-navbar__item__title">
              Deals
              <DealsNotifications />
            </Link>
          </NavbarItem>
        )}

        {user.agent &&
          user.user_type === 'Agent' &&
          user.agent.office_mlsid === 'CSTPP01' && (
            <NavbarItem isActive={activePath === 'STORE'}>
              <Link to="/dashboard/website">Store</Link>
            </NavbarItem>
          )}
      </ul>

      <ul className="c-app-navbar__list c-app-navbar__list--bottom">
        <NavbarItem isActive={activePath === 'NOTIF'}>
          <Link to="/dashboard/notifications" className="c-app-navbar__item__title">
            Notifications
            {appNotifications > 0 && (
              <span className="c-app-navbar__notification-badge">
                {appNotifications}
              </span>
            )}
          </Link>
        </NavbarItem>

        <NavbarItem isActive={intercomIsActive}>
          <button
            onClick={activeIntercom}
            className="c-app-navbar__item__title--button"
          >
            Support
          </button>
        </NavbarItem>

        <Dropdown
          dropup
          id="account-dropdown"
          className="c-app-navbar__account-dropdown"
        >
          <Dropdown.Toggle className="c-app-navbar__item__title--button">
            {user.first_name || user.email || user.phone_number}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <li>
              <Link to="/dashboard/account">Account</Link>
            </li>
            {hasBackOfficePermission && (
              <li>
                <Link to="/dashboard/brands">Brands</Link>
              </li>
            )}
            {user.user_type === 'Admin' && (
              <li>
                <Link to="/dashboard/forms">Forms</Link>
              </li>
            )}
            <li role="separator" className="divider" />
            <li>
              <a
                href="/signout"
                onClick={event => {
                  window.localStorage.removeItem('verificationBanner')
                }}
              >
                Sign out
              </a>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </ul>

      {window.INTERCOM_ID && (
        <Intercom appID={window.INTERCOM_ID} {...intercomUser} />
      )}
      {intercomIsActive && <IntercomCloseButton onClick={unactiveIntercom} />}
    </aside>
  )
}

export default compose(
  connect(({ data, user }, { location }) => ({
    user,
    activePath: getActivePath(location.pathname),
    appNotifications: data.new_notifications_count || 0
  })),
  withState('intercomIsActive', 'setIntercomIsActive', false),
  withHandlers({
    activeIntercom: ({ intercomIsActive, setIntercomIsActive }) => () => {
      if (!intercomIsActive) {
        window.Intercom('show')
        setIntercomIsActive(true)
      }
    },
    unactiveIntercom: ({ intercomIsActive, setIntercomIsActive }) => () => {
      window.Intercom('hide')
      setIntercomIsActive(false)
    }
  })
)(appNavbar)
