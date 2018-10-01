import styled from 'styled-components'

import { buttonBaseStyle } from '../../../../../../../views/components/Button/styles/ButtonAppearances'
import { grey, deleteColor } from '../../../../../../../views/utils/colors'
import CloseIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'

const isNotDisableState = '&:not([disabled]):'

export const Button = styled.button`
  ${buttonBaseStyle};
  position: absolute;
  top: 1.5rem;
  right: 8rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #fff;
  background-color: ${deleteColor};
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);

  &[disabled] {
    background-color: ${grey.A550};
  }

  ${isNotDisableState}hover, ${isNotDisableState}focus {
    color: #fff;
    text-decoration: none;
    background-color: ${deleteColor};
  }
`

export const Icon = CloseIcon.extend`
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
  fill: #fff;
`
