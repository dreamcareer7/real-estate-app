import React, { ReactNode } from 'react'
import { Form, FormProps, FormRenderProps } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { Tooltip } from '@material-ui/core'

import { FormApi } from 'final-form'

import Drawer from '../OverlayDrawer'
import ActionButton from '../Button/ActionButton'

interface FooterRenderProps {
  isSubmitDisabled: boolean
  formProps: FormRenderProps
  submitting: boolean
  handleSubmit: () => void
}

interface Props<T> {
  isSubmitDisabled?: boolean
  initialValues?: any
  initialValuesEqual?: FormProps['initialValuesEqual']
  keepDirtyOnReinitialize?: FormProps['keepDirtyOnReinitialize']
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: T, form: FormApi) => Promise<any>
  title: string
  submitButtonLabel?: ReactNode
  submitButtonTooltip?: string
  submittingButtonLabel?: ReactNode
  showFooter?: boolean
  closeDrawerOnBackdropClick?: boolean
  disableSubmitByEnter?: boolean
  validate?: (data: any) => any
  formId: string
  decorators?: any[]
  footerRenderer?: (footerRendererProps: FooterRenderProps) => ReactNode
  render?: (formProps: FormRenderProps & { values: T }) => ReactNode
}

export class FinalFormDrawer<T> extends React.Component<Props<T>> {
  static defaultProps = {
    isSubmitDisabled: false,
    initialValues: {},
    showFooter: true,
    disableSubmitByEnter: false,
    submitButtonLabel: 'Save',
    submittingButtonLabel: 'Saving ...',
    closeDrawerOnBackdropClick: false,
    decorators: [],
    validate: () => ({})
  }

  handleOnClose = (e, formProps) => {
    const { form, submitting } = formProps

    if (submitting) {
      return
    }

    if (formProps.dirty) {
      form.initialize(this.props.initialValues)
    }

    this.props.onClose()
  }

  handleSubmit = () => {
    let event

    if (typeof Event === 'function') {
      event = new Event('submit', { cancelable: true })
    } else {
      event = document.createEvent('Event')

      event.initEvent('submit', true, true)
    }

    document.getElementById(this.props.formId)!.dispatchEvent(event)
  }

  onSubmit = async (values, form) => {
    const result = await this.props.onSubmit(values, form)

    if (result && result['FINAL_FORM/form-error']) {
      return result
    }

    form.initialize(this.props.initialValues)
  }

  handleKeyPress = e => {
    if (e.which == 13 && this.props.disableSubmitByEnter) {
      e.preventDefault()

      return false
    }

    return true
  }

  private formProps: FormRenderProps

  render() {
    const { isSubmitDisabled = false } = this.props

    // TODO: we can render form inside drawer in order to enable drawer animations
    // We can also render form only if this.props.isOpen is true to
    // enforce form rerender and ensure form is reinitialized
    // when the drawer is opened (even if keepDirtyOnReinitialize is passed)
    // this eliminates the necessity for conditional rendering of
    // FinalFormDrawer.
    return (
      <Drawer
        open={this.props.isOpen}
        onClose={e => this.handleOnClose(e, this.formProps)}
        // Better to accept DrawerProps instead
        closeOnBackdropClick={this.props.closeDrawerOnBackdropClick}
      >
        {this.props.isOpen ? (
          <Form
            validate={this.props.validate}
            onSubmit={this.onSubmit}
            decorators={this.props.decorators}
            mutators={{ ...arrayMutators }}
            initialValues={this.props.initialValues}
            initialValuesEqual={this.props.initialValuesEqual}
            keepDirtyOnReinitialize={this.props.keepDirtyOnReinitialize}
            render={formProps => {
              this.formProps = formProps

              const { submitting } = formProps

              return (
                <form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexBasis: '100%'
                  }}
                  id={this.props.formId}
                  onSubmit={formProps.handleSubmit}
                  onKeyPress={this.handleKeyPress}
                >
                  <Drawer.Header title={this.props.title} />
                  <Drawer.Body>
                    {typeof this.props.render === 'function'
                      ? this.props.render(formProps as any)
                      : this.props.children}
                  </Drawer.Body>

                  {this.props.showFooter && (
                    <Drawer.Footer rowReverse>
                      {this.props.footerRenderer ? (
                        this.props.footerRenderer({
                          isSubmitDisabled,
                          formProps,
                          submitting,
                          handleSubmit: this.handleSubmit
                        })
                      ) : (
                        <Tooltip title={this.props.submitButtonTooltip}>
                          <ActionButton
                            type="submit"
                            disabled={
                              isSubmitDisabled ||
                              submitting ||
                              formProps.validating
                            }
                            onClick={this.handleSubmit}
                          >
                            {submitting
                              ? this.props.submittingButtonLabel
                              : this.props.submitButtonLabel}
                          </ActionButton>
                        </Tooltip>
                      )}
                    </Drawer.Footer>
                  )}
                </form>
              )
            }}
          />
        ) : null}
      </Drawer>
    )
  }
}
