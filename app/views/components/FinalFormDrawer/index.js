import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Drawer from '../OverlayDrawer'
import ActionButton from '../Button/ActionButton'

FinalFormDrawer.propTypes = {
  initialValues: PropTypes.shape(),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  showFooter: PropTypes.bool,
  showReset: PropTypes.bool,
  validate: PropTypes.func
}

FinalFormDrawer.defaultProps = {
  initialValues: {},
  showReset: true,
  showFooter: true,
  validate: () => ({})
}

export function FinalFormDrawer(props) {
  return (
    <Form
      validate={props.validate}
      onSubmit={async (values, form) => {
        form.initialize(values)
        await props.onSubmit(values)
        form.initialize(props.initialValues)
      }}
      mutators={{ ...arrayMutators }}
      initialValues={props.initialValues}
      render={formProps => {
        const {
          form,
          pristine,
          validating,
          handleSubmit,
          submitting
        } = formProps

        const handleOnClose = () => {
          if (submitting) {
            return
          }

          if (formProps.dirty) {
            form.initialize(props.initialValues)
          }

          props.onClose()
        }

        return (
          <Drawer
            isOpen={props.isOpen}
            onClose={handleOnClose}
            showFooter={props.showFooter}
          >
            <Drawer.Header title={props.title} />
            <Drawer.Body>
              {(typeof props.render === 'function' &&
                props.render(formProps)) ||
                props.children}
            </Drawer.Body>

            <Drawer.Footer>
              <div style={{ textAlign: 'left' }}>
                <ActionButton
                  disabled={submitting}
                  inverse
                  onClick={handleOnClose}
                  type="button"
                >
                  Cancel
                </ActionButton>
              </div>
              <div style={{ textAlign: 'right' }}>
                {props.showReset && (
                  <ActionButton
                    type="button"
                    inverse
                    onClick={() => form.reset(props.initialValues)}
                    style={{ marginRight: '1em' }}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </ActionButton>
                )}
                <ActionButton
                  type="button"
                  disabled={submitting || validating}
                  onClick={() => handleSubmit(props.onSubmit)}
                >
                  {submitting ? 'Saving ...' : 'Save'}
                </ActionButton>
              </div>
            </Drawer.Footer>
          </Drawer>
        )
      }}
    />
  )
}
