import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { ButtonAppearances } from '../styles/ButtonAppearances'

const propTypes = {
  /**
   * The appearance of the button.  {primary, outilne, icon}
   */
  appearance: PropTypes.oneOf(Object.keys(ButtonAppearances)),

  /**
   * When true, the button is disabled.
   */
  disabled: PropTypes.bool,

  /**
   * DEPRECATED
   * When true, the button appearances should be ghost.
   */
  inverse: PropTypes.bool,

  /**
   * The size of the button. {small, medium, large}
   */
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}

const defaultProps = {
  appearance: 'primary',
  disabled: false,
  inverse: false,
  size: 'medium'
}

const isOutline = props => props.appearance === 'outline' || props.inverse

const getStylesDependedSize = props => {
  switch (props.size) {
    case 'small':
      return {
        height: '32px',
        fontSize: '14px',
        lineHeight: isOutline(props) ? '30px' : '32px',
        padding: '0 8px'
      }

    case 'large':
      return {
        height: '48px',
        fontSize: '18px',
        lineHeight: isOutline(props) ? '46px' : '48px',
        padding: '0 16px'
      }

    default:
      return {
        height: '40px',
        fontSize: '16px',
        lineHeight: isOutline(props) ? '38px' : '40px',
        padding: '0 16px'
      }
  }
}

const getAppearance = props => {
  let appearance = props.appearance

  if (props.inverse) {
    appearance = 'outline'
  }

  return css`
    ${ButtonAppearances[appearance]} ${getStylesDependedSize(
      props
    )}

    position: relative;
    font-family: Barlow;
    font-weight: normal;
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    border-radius: 3px;
    margin: 0;
  `
}

const Button = styled.button(getAppearance)

export default Object.assign(Button, {
  propTypes,
  defaultProps
})
