import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from '../../../../../../../../../../views/components/Dropdown'
import { Container, Title, ErrorMessage } from '../styled'

export function Select(props) {
  const { attribute_def } = props.attribute

  if (!attribute_def || !attribute_def.show || !attribute_def.enum_values) {
    return null
  }

  return (
    <Field
      name={attribute_def.id}
      format={value => value && value.value}
      parse={value =>
        value && {
          attribute: props.attribute,
          value
        }
      }
      render={({ input, meta }) => {
        const { error, touched } = meta
        const hasError = error && touched

        return (
          <Container>
            <Title>{attribute_def.label}</Title>
            <Dropdown
              fullWidth
              input={input}
              buttonStyle={{ padding: 0 }}
              items={['-Select-', ...attribute_def.enum_values].map(value => ({
                title: value,
                value
              }))}
            />
            {hasError && <ErrorMessage>{error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
