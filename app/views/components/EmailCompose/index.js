import React, { Fragment } from 'react'
import { Field } from 'react-final-form'

import Loading from '../../../components/Partials/Loading'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'
import { MultipleContactsSelect } from '../Forms/MultipleContactsSelect'

export default class EmailCompose extends React.Component {
  get InitialValues() {
    if (
      (this.formObject && !this.isRecipientsChanged()) ||
      this.props.isSubmitting
    ) {
      return this.formObject
    }

    this.formObject = {
      from: `${this.props.from.display_name} <${this.props.from.email}>`,
      recipients: this.props.recipients || []
    }

    return this.formObject
  }

  isRecipientsChanged = () =>
    (this.formObject.recipients || []).length !==
    (this.props.recipients || []).length

  validate = values => {
    const errors = {}
    const { subject, recipients } = values

    if (!subject || subject.length === 0) {
      errors.subject = 'Please enter the subject'
    }

    if (!recipients || recipients.length === 0) {
      errors.recipients = 'You should select one recipient at least'
    }

    return errors
  }

  render() {
    return (
      <FinalFormDrawer
        formId="email-compose-form"
        isOpen={this.props.isOpen}
        initialValues={this.InitialValues}
        onClose={this.props.onClose}
        onSubmit={this.props.onClickSend}
        validate={this.validate}
        submitting={this.props.isSubmitting}
        closeDrawerOnBackdropClick={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title="New Email"
        render={() => (
          <Fragment>
            <Field
              placeholder="Bcc"
              name="recipients"
              disableAddNewRecipient={this.props.disableAddNewRecipient}
              component={MultipleContactsSelect}
            />

            <Field
              placeholder="From"
              name="from"
              readOnly
              component={TextInput}
            />

            <Field placeholder="Subject" name="subject" component={TextInput} />

            <div>
              {this.props.html === null && <Loading />}

              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.html
                }}
              />
            </div>
          </Fragment>
        )}
      />
    )
  }
}
