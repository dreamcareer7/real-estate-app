import React from 'react'
import Input from 'react-text-mask'
import { PhoneNumberUtil } from 'google-libphonenumber'
import _ from 'underscore'
import InputErrorMessage from '../components/InputErrorMessage'

function validate(props) {
  const { value } = props

  const phoneUtil = PhoneNumberUtil.getInstance()

  try {
    let phoneNumber = phoneUtil.parse(value, 'US')

    return phoneUtil.isValidNumber(phoneNumber)
  } catch (error) {
    return false
  }
}

export default props => {
  const { ErrorMessageHandler } = props
  const isValid = validate(props)

  const ErrorMessageComponent = ErrorMessageHandler ? (
    <ErrorMessageHandler {...props} />
  ) : (
    <InputErrorMessage message="The value is not a valid U.S phone number" />
  )

  return (
    <div style={{ position: 'relative', display: 'inline' }}>
      <Input
        placeholder="(xxx)xxx-xxxx"
        value={props.value}
        style={{
          border: isValid ? '' : '1px solid #ec4b35'
        }}
        mask={[
          '(',
          /[1-9]/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          /\d/
        ]}
        {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
        onChange={e => {
          const maskedValue = e.target.value
          const originalValue = maskedValue
            ? maskedValue
                .replace('(', '')
                .replace(')', '')
                .replace(/\s/g, '')
                .replace(/\-/gi, '')
            : ''

          props.onChange(e, originalValue)
        }}
      />

      {props.value && !isValid && ErrorMessageComponent}
    </div>
  )
}
