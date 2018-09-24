import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip'
import { AddAssociation } from '../AddAssociation'
import SelectDealModal from '../SelectDealModal'
import { normalizeDeal } from '../../utils/association-normalizers'

export class AddDealAssociation extends React.Component {
  static propTypes = {
    handleAdd: PropTypes.func.isRequired,
    buttonRenderer: PropTypes.func.isRequired
  }

  onSelectHandler = (deal, closeHandler) =>
    this.props.handleAdd(normalizeDeal(deal), closeHandler)

  render() {
    const title = 'Attach Deal'

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              {this.props.buttonRenderer(handleOpen)}
            </Tooltip>
            <SelectDealModal
              isOpen={isActive}
              title={title}
              handleOnClose={handleClose}
              handleSelectedItem={deal =>
                this.onSelectHandler(deal, handleClose)
              }
            />
          </div>
        )}
      />
    )
  }
}
