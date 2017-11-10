import React from 'react'
import { connect } from 'react-redux'
import { Button, FormControl, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import RoleForm from './form'
import { createRoles } from '../../../../../../store_actions/deals'

class AddRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      form: null,
      saving: false
    }
  }

  showModal() {
    this.setState({ show: true })
  }

  closeModal() {
    this.setState({ show: false })
  }

  async create() {
    const { form } = this.state
    const { dealId, createRoles, notify } = this.props

    if (!dealId) {
      return false
    }

    this.setState({
      saving: true
    })

    try {
      await createRoles(dealId, [form])
      this.setState({ show: false })
    } catch (e) {
      const { attributes } = e.response.body
      const field = Object.keys(attributes)[0]

      notify({
        message: `${field} is invalid`,
        status: 'error'
      })
    }

    this.setState({
      saving: false
    })
  }

  render() {
    const { show, form, saving } = this.state
    const { allowedRoles } = this.props
    const buttonDisabled = (form === null) || (saving === true)

    return (
      <div>
        <div
          className="item add-new"
          onClick={() => this.showModal()}
        >
          <div className="role-avatar">
            <span className="add-contact-avatar">
              <i className="fa fa-plus" />
            </span>
          </div>

          <div className="name">
            <div style={{ color: '#61778d' }}>
              Add Contact
            </div>
          </div>
        </div>

        <Modal
          show={show}
          onHide={() => this.closeModal()}
          dialogClassName="modal-deal-add-role"
        >
          <Modal.Header closeButton>
            Add contact
          </Modal.Header>

          <Modal.Body>
            <RoleForm
              onFormCompleted={form => this.setState({ form })}
              allowedRoles={allowedRoles}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className={`btn-deal ${buttonDisabled ? 'disabled': ''}`}
              bsStyle={buttonDisabled ? "link" : "primary"}
              disabled={buttonDisabled}
              onClick={() => this.create()}
            >
              { saving ? 'Saving...' : 'Add' }
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default connect(null, { createRoles, notify })(AddRole)
