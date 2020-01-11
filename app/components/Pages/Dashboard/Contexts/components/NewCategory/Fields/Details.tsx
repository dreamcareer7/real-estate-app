import React from 'react'
import { Field } from 'react-final-form'
import { Grid, Box } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

import useStyles from '../styles'

interface Props {}

function validateInput(value: string = ''): string | null {
  if (value.trim() === '') {
    return 'This field can’t be empty.'
  }

  return null
}
function sharedFieldProps(isRequired: boolean = true) {
  const validate = isRequired ? { validate: v => validateInput(v) } : {}

  return {
    ...validate,
    // autoFocus: true,
    variant: 'filled',
    InputLabelProps: {
      shrink: true
    },
    margin: 'dense',
    autoComplete: 'off',
    fullWidth: true,
    required: isRequired
  }
}

function DetailsFields(props: Props) {
  const classes = useStyles()

  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item xs={3}>
        <Box fontWeight={500}>Context Details</Box>
      </Grid>
      <Grid item xs={9}>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            className={classes.detailsFieldsRow}
          >
            <Grid item xs={6}>
              <Field
                name="label"
                label="Context Title"
                component={MUITextInput}
                {...sharedFieldProps()}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                name="type"
                label="Context Type"
                component={MUITextInput}
                {...sharedFieldProps()}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>
              <Field
                name="key"
                label="Context ID"
                component={MUITextInput}
                {...sharedFieldProps()}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                name="short_label"
                label="Context Short Title"
                component={MUITextInput}
                {...sharedFieldProps(false)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DetailsFields
