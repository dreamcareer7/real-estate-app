import React, { FunctionComponent } from 'react'
import { Form, Field } from 'react-final-form'
import { Grid, Box, Button, Divider, Typography } from '@material-ui/core'
import { TextField } from 'final-form-material-ui'

import { SelectInput } from 'components/Forms/SelectInput'
import { DangerButton } from 'components/Button/DangerButton'

import { MAX_STEP_TITLE_LENGTH } from '../../../../constants'

import {
  timeToSeconds,
  ONE_DAY_IN_SECONDS,
  humanizeSeconds,
  formatTimeDigits
} from '../../../helpers'
import { validateStringInput, validateInput } from '../../../../helpers'

interface FormData {
  email_template: UUID
  title: string
  description?: string
  wait_for: number
  at: string
}

interface Props {
  startFrom?: number
  step?: IBrandFlowStep
  templates: IBrandEmailTemplate[]
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
  onCancel: () => void
}

export default function ScheduledEmailForm({
  startFrom = 0,
  step,
  templates,
  onSubmit,
  onCancel,
  onDelete
}: Props) {
  function getInitialValues(stepData?: IBrandFlowStep) {
    if (!stepData || !stepData.email) {
      return {
        email_template: templates[0].id,
        wait_for: '1',
        at: '08:00'
      }
    }

    const { days } = humanizeSeconds(stepData.due_in - startFrom)
    const { hours, minutes } = humanizeSeconds(
      stepData.due_in - days * ONE_DAY_IN_SECONDS
    )
    const at = `${formatTimeDigits(hours)}:${formatTimeDigits(minutes)}`

    return {
      email_template: stepData.email.id,
      title: stepData.title,
      description: stepData.description,
      wait_for: days.toString(),
      at
    }
  }

  return (
    <Form
      onSubmit={(data: FormData) => {
        const dueIn =
          data.wait_for * ONE_DAY_IN_SECONDS +
          timeToSeconds(data.at) +
          startFrom

        const newStep: IBrandFlowStepInput = {
          title: data.title,
          description: data.description,
          due_in: dueIn,
          email: data.email_template
        }

        // Update step
        if (step) {
          return onSubmit(newStep, step.id)
        }

        // Create step
        return onSubmit(newStep)
      }}
      initialValues={getInitialValues(step)}
      render={({ handleSubmit, submitting }) => {
        return (
          <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
            <Grid item xs={12}>
              <Field
                name="email_template"
                label="Email Template"
                items={templates.map(template => ({
                  label: template.name,
                  value: template.id
                }))}
                dropdownOptions={{
                  fullWidth: true
                }}
                component={SelectInput as FunctionComponent}
              />
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Field
                  autoFocus
                  validate={value =>
                    validateStringInput(
                      value,
                      'event title',
                      MAX_STEP_TITLE_LENGTH
                    )
                  }
                  name="title"
                  label="Title"
                  variant="outlined"
                  margin="dense"
                  autoComplete="off"
                  fullWidth
                  required
                  component={TextField}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Field
                  name="description"
                  label="Description"
                  variant="outlined"
                  margin="dense"
                  autoComplete="off"
                  fullWidth
                  multiline
                  component={TextField}
                />
              </Box>
            </Grid>

            <Grid container item xs={12}>
              <Grid container item xs={3}>
                <Box mb={2}>
                  <Field
                    name="wait_for"
                    label="Wait for"
                    type="number"
                    min="1"
                    variant="outlined"
                    margin="dense"
                    autoComplete="off"
                    required
                    validate={value =>
                      validateInput(value, 'wait days', input => {
                        const numericValue = parseInt(input, 10)

                        return (
                          numericValue.toString() === input && numericValue >= 0
                        )
                      })
                    }
                    component={TextField}
                  />
                </Box>
              </Grid>

              <Grid container item alignItems="flex-start" xs={6}>
                <Box mb={2} pt={2} pl={1}>
                  <Typography variant="subtitle2" color="textSecondary">
                    days after{' '}
                    {startFrom === 0 ? 'Flow start' : 'previous step'}
                  </Typography>
                </Box>
              </Grid>

              <Grid container item xs={3} justify="flex-end">
                <Box mb={2}>
                  <Field
                    name="at"
                    label="At"
                    margin="dense"
                    autoComplete="off"
                    type="time"
                    variant="outlined"
                    required
                    InputLabelProps={{ shrink: true }}
                    component={TextField}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider />

            <Grid container item xs={12} style={{ marginTop: '1rem' }}>
              <Grid container item xs={6} justify="flex-start">
                {step && onDelete && (
                  <DangerButton
                    variant="text"
                    disabled={submitting}
                    onClick={async event => {
                      event.stopPropagation()
                      onDelete(step)
                    }}
                  >
                    Delete
                  </DangerButton>
                )}
              </Grid>
              <Grid container item xs={6} justify="flex-end">
                <Button
                  variant="text"
                  disabled={submitting}
                  style={{ marginRight: '1rem' }}
                  onClick={event => {
                    event.stopPropagation()
                    onCancel()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? 'Saving' : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      }}
    />
  )
}
