import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../tooltip'
import Button from '../../Button/IconButton'
import IconNav from '../../SvgIcons/NavMenu/IconNav'

const propTypes = {
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string
}

const defaultProps = {
  tooltip: null
}

export const Trigger = ({ onClick, tooltip }) => (
  <Tooltip caption={tooltip} placement="top">
    <Button onClick={onClick} style={{ marginRight: '1em' }} isFit>
      <IconNav />
    </Button>
  </Tooltip>
)

Trigger.propTypes = propTypes
Trigger.defaultProps = defaultProps
