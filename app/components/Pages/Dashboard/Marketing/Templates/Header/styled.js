import styled from 'styled-components'

import { Jumbo } from 'components/Typography/headings'

const baseBackgroundImgUrl = '/static/images/marketing/templates/headers'

export const Container = styled.div`
  position: relative;
  height: 18.75rem;
  padding-top: 6.625rem;
  padding-left: 5.5rem;
  margin-bottom: 2rem;
  background-color: ${props => props.brandColor};

  @media screen and (min-width: ${props =>
      props.isSideMenuOpen ? 75 + 11 : 75}em) {
    background-repeat: no-repeat;
    background-image: ${({ name }) =>
      `url('${baseBackgroundImgUrl}/${name}/${name}@3x.png')`};
    background-size: ${({ size: { width, height } }) =>
      `${width / 16}rem ${height / 16}rem`};
    background-position: calc(100% - 2rem) ${props => props.position || '75%'};
  }

  @media screen and (min-width: ${props =>
      props.isSideMenuOpen ? 85 + 11 : 85}em) {
    background-position: calc(100% - 7rem) ${props => props.position || '75%'};
  }

  .c-menu-trigger {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
  }
`

export const Title = styled(Jumbo)`
  max-width: 28rem;
  margin-bottom: 1rem;
`
