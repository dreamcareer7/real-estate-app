import React from 'react'
import { Link } from 'react-router'
import { Form, Field } from 'react-final-form'

import SubmitButton from './SubmitButton'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'
import { Callout } from '../../../../views/components/Callout'

import { SubmitMessage } from './types'

interface InitialValues {
  username: string
}

interface Props {
  brandColor: string
  isLoading: boolean
  initialValues?: InitialValues
  submitMessage: SubmitMessage | null
  onSubmit: (values) => void
}

export default function LookUpForm({
  brandColor,
  isLoading,
  initialValues = { username: '' },
  submitMessage,
  onSubmit
}: Props) {
  const validate = values => {
    const errors: { username?: string } = {}

    if (!values.username) {
      errors.username = 'Required'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
    ) {
      errors.username = 'Invalid email address'
    }

    return errors
  }

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="username"
            type="email"
            label="Email"
            tabIndex={0}
            component={SimpleField}
          />
          {submitMessage && (
            <Callout style={{ margin: '1.5rem 0' }} type={submitMessage.type}>
              {submitMessage.text}
            </Callout>
          )}
          <SubmitButton
            isDisabled={isLoading}
            color={brandColor}
            text={isLoading ? 'Looking up...' : 'Next'}
          />

          <p style={{ textAlign: 'center' }}>
            <small>Don't have an account?</small>
            &nbsp;&nbsp;
            <Link to="/signup">Sign up</Link>
          </p>
        </form>
      )}
    />
  )
}
