import React from 'react'
import { H2 } from '../../../../../views/components/Typography/headings'
import { BasicDropdown } from '../../../../../views/components/BasicDropdown'

const properties = [
  'Resale',
  'Residential Lease',
  'New Home',
  'Lot / Land',
  'Commercial Sale',
  'Commercial Lease'
]

function getItems(items) {
  return items.map(item => ({ label: item, value: item }))
}
function itemToString(item) {
  return item.label
}

export default ({ selectedType, onChangeDealType }) => (
  <div className="form-section deal-type">
    <H2 className="hero">
      Select a checklist type. <span className="required">*</span>
    </H2>

    <BasicDropdown
      maxHeight="unset"
      style={{ display: 'inline-block' }}
      items={getItems(properties)}
      itemToString={itemToString}
      buttonText={selectedType || 'Choose a checklist type'}
      onChange={item => onChangeDealType(item.value)}
    />
  </div>
)
