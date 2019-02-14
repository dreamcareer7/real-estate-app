import React from 'react'

import SendDealPromotion from 'components/InstantMarketing/adapters/SendDealPromotion'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'

export default function SocialMarketing(props) {
  return (
    <Container>
      <LeftColumn>
        <Title>Social Marketing</Title>
        <Description>
          Beautiful social collaterals for your listing.
        </Description>

        <SendDealPromotion deal={props.deal} mediums="Social">
          Explore
        </SendDealPromotion>
      </LeftColumn>

      <RightColumn>
        <Image
          style={{
            position: 'absolute',
            bottom: 0
          }}
          src="/static/images/deals/marketing/marketing-center-graphic@3x.png"
          alt=""
        />
      </RightColumn>
    </Container>
  )
}