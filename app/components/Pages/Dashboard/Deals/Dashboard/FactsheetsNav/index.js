import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import FactsheetSection from '../Factsheet'
import Roles from '../../components/Roles'

import { Card } from './styled'
import { FactsheetDivider } from '../Factsheet/styled'

function FactsheetsSideNav(props) {
  const { deal, isBackOffice } = props

  return (
    <Card
      style={{
        padding: '1.5rem 0'
      }}
    >
      <FactsheetSection
        showDivider={props.showCriticalDatesDivider}
        display={props.showCriticalDates}
        deal={deal}
        isFetchingContexts={props.isFetchingContexts}
        isBackOffice={isBackOffice}
        section="Dates"
        title="Critical Dates"
      />

      {props.showContacts && (
        <Fragment>
          <Roles deal={deal} allowDeleteRole />
          <FactsheetDivider />
        </Fragment>
      )}

      <FactsheetSection
        showDivider
        display={props.showCDAInformation}
        deal={deal}
        isFetchingContexts={props.isFetchingContexts}
        isBackOffice={isBackOffice}
        section="CDA"
        title="CDA Information"
      />

      <FactsheetSection
        display={props.showListingInformation}
        deal={deal}
        isFetchingContexts={props.isFetchingContexts}
        isBackOffice={isBackOffice}
        section="Listing"
        title="Listing Information"
      />
    </Card>
  )
}

FactsheetsSideNav.propTypes = {
  showCriticalDates: PropTypes.bool,
  showCriticalDatesDivider: PropTypes.bool,
  showCDAInformation: PropTypes.bool,
  showListingInformation: PropTypes.bool,
  showContacts: PropTypes.bool
}

FactsheetsSideNav.defaultProps = {
  showCriticalDates: true,
  showCriticalDatesDivider: true,
  showCDAInformation: true,
  showListingInformation: true,
  showContacts: true
}

export default FactsheetsSideNav
