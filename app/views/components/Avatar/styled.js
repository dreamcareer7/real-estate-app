import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { borderColor, brandBackground } from '../../utils/colors'

export const Container = styled(Flex)`
  position: relative;
  height: ${props => props.size / 16}rem;
  width: ${props => props.size / 16}rem;
  color: #fff;
  cursor: default;
  border-radius: ${props => props.borderRadius}%;
  background-color: ${props => props.backgroundColor || '#000'};
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;

  &[alt] {
    font-size: 0;
  }
`

export const Initials = styled.div`
  font-size: ${props => (props.size * 0.5) / 16}rem;
  color: #fff;
`

export const Status = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${props => (props.size * 0.295454545) / 16}em;
  height: ${props => (props.size * 0.295454545) / 16}em;
  z-index: 1;
  border-width: ${props => props.size * 0.0568181818}px;
  border-style: solid;
  border-color: ${brandBackground};
  border-radius: 100%;
  background-color: ${props =>
    props.isOnline ? props.statusColor : borderColor};
`
