import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { Field } from 'react-final-form'
import _ from 'underscore'

import { TextEditor } from 'components/TextEditor'

import { normalizeAttachments } from 'components/SelectDealFileDrawer/helpers/normalize-attachment'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import Loading from '../../../components/Partials/Loading'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'
import { MultipleContactsSelect } from '../Forms/MultipleContactsSelect'
import { AttachmentsList } from './fields/Attachments'

import { Footer } from './Footer'

class EmailCompose extends React.Component {
  state = {
    isSendingEmail: false
  }

  get InitialValues() {
    if ((this.formObject && !this.isRecipientsChanged()) || this.IsSubmitting) {
      return this.formObject
    }

    this.initialAttachments = normalizeAttachments(
      this.props.defaultAttachments
    )

    this.formObject = {
      fromId: this.props.from.id,
      from: `${this.props.from.display_name} <${this.props.from.email}>`,
      recipients: this.props.recipients,
      subject: '',
      body: this.props.hasStaticBody ? '' : this.props.body,
      attachments: this.initialAttachments,
      due_at: ''
    }

    return this.formObject
  }

  get IsSubmitting() {
    return this.props.isSubmitting || this.state.isSendingEmail
  }

  isRecipientsChanged = () =>
    (this.formObject.recipients || []).length !==
    (this.props.recipients || []).length

  validate = values => {
    const errors = {}
    const { recipients } = values

    if (!recipients || recipients.length === 0) {
      errors.recipients = 'You should select one recipient at least'
    }

    return errors
  }

  handleSubmit = async values => {
    const form = {
      ...values,
      recipients: this.normalizeRecipients(values.recipients)
    }

    return this.props.onClickSend
      ? this.props.onClickSend(form)
      : this.handleSendEmail(form)
  }

  handleSendEmail = async form => {
    const email = {
      from: form.fromId,
      to: form.recipients,
      subject: form.subject,
      html: form.body,
      attachments: _.map(form.attachments, item => item.file_id)
    }

    try {
      this.setState({
        isSendingEmail: true
      })

      await sendContactsEmail(email)

      this.props.notify({
        status: 'success',
        message: 'The email has been sent'
      })

      this.props.onClose()
    } catch (e) {
      console.log(e)

      this.props.notify({
        status: 'error',
        message: 'Could not send the email. try again.'
      })
    } finally {
      this.setState({
        isSendingEmail: false
      })
    }
  }

  normalizeRecipients = recipients =>
    recipients.map(recipient => {
      if (recipient.data_type === 'contact') {
        return {
          contact: recipient.contactId,
          email: recipient.email
        }
      }

      if (recipient.data_type === 'email') {
        return {
          email: recipient.email
        }
      }

      if (recipient.data_type === 'tag') {
        return {
          tag: recipient.text
        }
      }

      return {
        [recipient.data_type]: recipient.id
      }
    })

  render() {
    return (
      <FinalFormDrawer
        formId="email-compose-form"
        disableSubmitByEnter
        isOpen={this.props.isOpen}
        initialValues={this.InitialValues}
        onClose={this.props.onClose}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        submitting={this.IsSubmitting}
        closeDrawerOnBackdropClick={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title="New Email"
        footerRenderer={data => (
          <Footer
            {...data}
            initialAttachments={this.initialAttachments}
            isSubmitting={this.IsSubmitting}
            deal={this.props.deal}
            hasDealsAttachments={this.props.hasDealsAttachments}
          />
        )}
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

            {this.props.hasStaticBody === false && (
              <Field
                name="body"
                defaultValue={this.props.body}
                component={TextEditor}
              />
            )}

            {this.props.hasStaticBody && (
              <Fragment>
                {this.props.body ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.body
                    }}
                  />
                ) : (
                  <Loading />
                )}
              </Fragment>
            )}

            <Field name="attachments" component={AttachmentsList} />
          </Fragment>
        )}
      />
    )
  }
}

EmailCompose.propTypes = {
  from: PropTypes.object.isRequired,
  recipients: PropTypes.array,
  isSubmitting: PropTypes.bool,
  defaultAttachments: PropTypes.array,
  hasStaticBody: PropTypes.bool,
  body: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClickSend: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  hasDealsAttachments: PropTypes.bool
}

EmailCompose.defaultProps = {
  recipients: [],
  defaultAttachments: [],
  body: '',
  onClickSend: null,
  isSubmitting: false,
  hasStaticBody: false,
  hasDealsAttachments: false
}

export default connect(
  null,
  { notify }
)(EmailCompose)
