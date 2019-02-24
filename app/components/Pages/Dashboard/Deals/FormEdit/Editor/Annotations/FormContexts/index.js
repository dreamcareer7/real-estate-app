import React, { Fragment } from 'react'

import FormRole from './FormRole'
import FormRoles from './FormRoles'
import { FormContext } from './FormContext'

export function FormContexts(props) {
  const sharedProps = {
    formValues: props.values,
    deal: props.deal,
    onClick: props.onClick,
    onSetValues: props.onSetValues
  }

  return (
    <Fragment>
      <FormRole roles={props.roles.single} {...sharedProps} />
      <FormRoles roles={props.roles.all} {...sharedProps} />
      <FormContext contexts={props.contexts} {...sharedProps} />
    </Fragment>
  )
}
