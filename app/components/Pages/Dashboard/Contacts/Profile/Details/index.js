import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'title',
  'first_name',
  'middle_name',
  'last_name',
  'nickname',
  'job_title',
  'company'
]

export function Details(props) {
  return (
    <SectionWithFields
      addNewFieldButtonText="Add Details"
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      section="Details"
      submitCallback={props.submitCallback}
    />
  )
}
