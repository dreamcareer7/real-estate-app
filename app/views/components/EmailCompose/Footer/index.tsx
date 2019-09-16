import React from 'react'
import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'

import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { FooterContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../components/EmailAttachmentsDropdown'
import { EmailFormValues } from '../types'

interface Props {
  isSubmitDisabled: boolean
  formProps: {
    values: EmailFormValues
  }
  deal?: IDeal
  onChanged: () => void
  initialAttachments: IFile[]
  isSubmitting: boolean
  handleSubmit: () => void
}

export function Footer(props: Props) {
  const due_at = props.formProps.values.due_at
  const isScheduled = !!due_at

  return (
    <FooterContainer>
      <div className="features-list">
        <EmailAttachmentsDropdown
          deal={props.deal}
          onChanged={props.onChanged}
          initialAttachments={props.initialAttachments}
        />
      </div>

      <div className="action-bar">
        {isScheduled && (
          <span className="scheduled-on">Send on {formatDate(due_at)}</span>
        )}

        <ActionButton
          data-test="compose-send-email"
          type="submit"
          disabled={props.isSubmitting || props.isSubmitDisabled}
          onClick={props.handleSubmit}
          leftRounded
        >
          {textForSubmitButton({
            isSubmitting: props.isSubmitting,
            isDateSet: isScheduled
          })}
        </ActionButton>
        <Field
          name="due_at"
          render={fieldProps => (
            <DateTimePicker
              popUpButton={buttonProps => (
                <SchedulerButton
                  onOpen={buttonProps.toggleOpen}
                  isScheduled={isScheduled}
                />
              )}
              disabledDays={{
                before: new Date()
              }}
              popUpPosition="top-right"
              saveButtonText="Schedule"
              initialSelectedDate={fieldProps.input.value}
              onDone={fieldProps.input.onChange}
            />
          )}
        />
      </div>
    </FooterContainer>
  )
}
