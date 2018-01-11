import React from 'react'
import Deal from '../../../../../../../models/Deal'
import Items from '../items'

const table = [
  {
    key: 'sales_price',
    name: 'Sold Price',
    dataType: 'currency',
    validate: (input) => /^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(input),
    canEdit: (isBO) => isBO
  }, {
    key: 'commission_listing',
    name: 'Listing Commission',
    dataType: 'text',
    validate: (input) => /^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(input),
    canEdit: (isBO) => isBO
  }, {
    key: 'commission_selling',
    name: 'Sale Commission',
    dataType: 'text',
    validate: (input) => /^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(input),
    canEdit: (isBO) => isBO
  }
]

const getValue = (deal, field) => {
  const value = Deal.get.field(deal, field.key)

  const object = {
    value,
    rawValue: value
  }

  if (field.dataType === 'currency') {
    object.value = Deal.get.formattedPrice(value)
  }

  return object
}

export default ({ deal }) => (
  <div className="deal-info-section">
    <Items
      deal={deal}
      title="CDA INFORMATION"
      table={table}
      getValue={getValue}
    />
  </div>
)
