import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import styled from 'styled-components'

import PageHeader from 'components/PageHeader'

import { confirmation } from 'actions/confirmation'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import SendDealPromotionCard from 'components/InstantMarketing/adapters/SendDealPromotion'

import { showAttachments } from 'actions/deals'

import DealEmail from '../deal-email'

const agentNetworkValidUsers = [
  'shayan.hamidi@gmail.com',
  'snhasani+a@gmail.com',
  'bpitchford@briggsfreeman.com'
]

const Button = styled(ActionButton)`
  margin-left: 0.5em;
`

const Header = ({ user, deal, showAttachments, confirmation }) => (
  <PageHeader title="Deals" backUrl="/dashboard/deals">
    <PageHeader.Menu>
      <DealEmail dealEmail={deal.email} />
      {deal.deal_type === 'Selling' && (
        <Button
          onClick={() => {
            if (deal.has_active_offer) {
              return confirmation({
                description:
                  'Primary offers accepted. Backup Offers may be uploaded after the Primary terminates.',
                hideCancelButton: true,
                confirmLabel: 'Ok'
              })
            }

            browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)
          }}
        >
          Add New Offer
        </Button>
      )}

      <Button
        appearance="outline"
        onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}/files`)}
      >
        View & Upload Files
      </Button>

      <Button
        appearance="outline"
        onClick={() => showAttachments()}
        style={{ marginRight: '0.5rem' }}
      >
        Get Signatures
      </Button>

      {deal.listing && agentNetworkValidUsers.includes(user.email) && (
        <LinkButton
          appearance="outline"
          to={`/dashboard/deals/${deal.id}/network`}
          style={{ margin: '0 0.5rem 0 0' }}
        >
          Network
        </LinkButton>
      )}

      {deal.listing && (
        <Fragment>
          <SendDealPromotionCard
            deal={deal}
            mediums="Email"
            buttonStyle={{ margin: '0 0.5rem 0 0' }}
          >
            Promote
          </SendDealPromotionCard>

          <SendDealPromotionCard deal={deal} mediums="Social">
            Social
          </SendDealPromotionCard>
        </Fragment>
      )}
    </PageHeader.Menu>
  </PageHeader>
)

export default connect(
  state => ({ user: state.user }),
  { showAttachments, confirmation }
)(Header)
