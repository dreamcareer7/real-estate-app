import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { addNotification as notify } from 'reapop'

import AddButton from '../../../../../../../views/components/Button/ActionButton'
// import DeleteButton from '../../../../../../../views/components/Button/IconButton'
// import DeleteIcon from '../../../../../../../views/components/SvgIcons/Delete/IconDelete'
import { upsertContactAttributes } from '../../../../../../../store_actions/contacts/upsert-contact-attributes'
import { FinalFormDrawer } from '../../../../../../../views/components/FinalFormDrawer'
import {
  TextField,
  Select
} from '../../../../../../../views/components/final-form-fields'

import { getFullAddress } from '../helpers/get-full-address'
import {
  getAddressIndex,
  getEmptyAddress,
  getInitialValues,
  preSaveFormat
} from './helpers'

const propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

class EditForm extends React.Component {
  state = {
    submitting: false
  }

  onSubmit = async values => {
    try {
      this.setState({ submitting: true })

      const attributes = preSaveFormat(values)

      await this.props.dispatch(
        upsertContactAttributes(this.props.contact.id, attributes)
      )
      this.setState({ submitting: false }, () => {
        this.props.onClose()
        this.props.dispatch(
          notify({
            status: 'success',
            dismissAfter: 4000,
            message: 'Addresses updated.'
          })
        )
      })
    } catch (error) {
      console.log(error)
      this.setState({ submitting: false })
    }
  }

  getAddress = index => {
    const idxAddresses = {}

    this.props.addresses.forEach(address => {
      if (address.index != null) {
        idxAddresses[address.index] = address
      }
    })

    if (idxAddresses[index]) {
      return idxAddresses[index]
    }

    return null
  }

  render() {
    const { addresses } = this.props
    const labelOptions = addresses[0].fields[0].attribute_def.labels.map(
      value => ({
        title: value,
        value
      })
    )

    return (
      <FinalFormDrawer
        initialValues={getInitialValues(addresses)}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        submitting={this.state.submitting}
        title="Edit Addresses"
      >
        <FieldArray name="addresses">
          {({ fields }) => (
            <div>
              {fields.map((name, index) => {
                const address = this.getAddress(
                  fields.value[index].addressIndex
                )
                const isEmpty =
                  address &&
                  !address.fields.some(
                    field => field[field.attribute_def.data_type]
                  )

                return (
                  <div key={name}>
                    {(addresses.length > 1 || !isEmpty) && (
                      <div
                        style={{
                          position: 'relative',
                          padding: '1em',
                          backgroundColor: '#ecf1f6'
                        }}
                      >
                        <p style={{ color: '#778a9f' }}>
                          {(address && address.label) || 'Other'}
                        </p>
                        <p style={{ color: '#263d50' }}>
                          {(address && getFullAddress(address.fields)) || '-'}
                        </p>
                        <label
                          htmlFor={`is_primary_${index}`}
                          style={{ color: '#415467' }}
                        >
                          <Field
                            id={`is_primary_${index}`}
                            name="is_primary"
                            component="input"
                            type="radio"
                            value={
                              address != null
                                ? address.index
                                : getAddressIndex(addresses)
                            }
                          />
                          {'    '}
                          Set as primary address
                        </label>
                        {/* <DeleteButton
                            color="#778a9f"
                            hoverColor="#263d50"
                            onClick={() => fields.remove(index)}
                            style={{
                              position: 'absolute',
                              top: '1.4rem',
                              right: '1.4rem'
                            }}
                          >
                            <DeleteIcon />
                          </DeleteButton> */}
                      </div>
                    )}
                    <div>
                      <Select
                        hasEmptyItem={false}
                        items={labelOptions}
                        label="Label"
                        name={`${name}.label`}
                      />
                      <TextField
                        label="Street Number"
                        name={`${name}.street_number.value`}
                      />
                      <TextField
                        label="Street Prefix"
                        name={`${name}.street_prefix.value`}
                      />
                      <TextField
                        label="Street Name"
                        name={`${name}.street_name.value`}
                      />
                      <TextField
                        label="Street Suffix"
                        name={`${name}.street_suffix.value`}
                      />
                      <TextField
                        label="Unit Number"
                        name={`${name}.unit_number.value`}
                      />
                      <TextField label="City" name={`${name}.city.value`} />
                      <TextField label="State" name={`${name}.state.value`} />
                      <TextField
                        label="Zip Code"
                        name={`${name}.postal_code.value`}
                        placeholder="65619 or 34353-2323"
                      />
                    </div>
                  </div>
                )
              })}

              <div style={{ padding: '1em' }}>
                <AddButton
                  onClick={() =>
                    fields.push(
                      getEmptyAddress(
                        this.props.addressAttributeDefs,
                        getAddressIndex(addresses)
                      )
                    )
                  }
                >
                  Add a new address
                </AddButton>
              </div>
            </div>
          )}
        </FieldArray>
      </FinalFormDrawer>
    )
  }
}

EditForm.propTypes = propTypes

export default connect()(EditForm)

// withHandlers({
//   onChange: ({
//     contact,
//     setDisabled,
//     upsertContactAttributes
//   }) => async field => {
//     try {
//       setDisabled(true)

//       let attribute
//       const { data_type } = field.attribute_def

//       if (field.id) {
//         attribute = {
//           id: field.id,
//           [data_type]: field[data_type]
//         }
//       } else {
//         attribute = {
//           index: field.index,
//           [data_type]: field[data_type],
//           attribute_def: field.attribute_def.id
//         }
//       }

//       await upsertContactAttributes(contact.id, [attribute])
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handleOnChangeLabel: ({
//     contact,
//     setDisabled,
//     addressesFields,
//     upsertContactAttributes
//   }) => async ({ index, label }) => {
//     if (index == null) {
//       throw new Error(`The index is ${index}`)
//     }

//     if (label == null) {
//       throw new Error(`The label is ${index}`)
//     }

//     const attributes = addressesFields
//       .filter(field => field.index === index)
//       .map(field => ({ ...field, label }))

//     try {
//       setDisabled(true)
//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handelOnChangePrimary: ({
//     contact,
//     setDisabled,
//     addressesFields,
//     upsertContactAttributes
//   }) => async index => {
//     try {
//       setDisabled(true)

//       const attributes = addressesFields.map(field => {
//         if (field.index === index) {
//           return { ...field, is_primary: true }
//         }

//         return { ...field, is_primary: false }
//       })

//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   onDelete: ({
//     contact,
//     setDisabled,
//     upsertContactAttributes
//   }) => async attribute => {
//     try {
//       setDisabled(true)

//       const attributes = [
//         {
//           ...attribute,
//           [attribute.attribute_def.data_type]: ''
//         }
//       ]

//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handleDeleteAddress: ({
//     contact,
//     setDisabled,
//     deleteAttributes
//   }) => async fields => {
//     setDisabled(true)

//     try {
//       const ids = fields
//         .filter(field => field && field.id)
//         .map(({ id }) => id)

//       await deleteAttributes(contact.id, ids)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handleAddNewAddress: ({
//     contact,
//     setDisabled,
//     setShowModal,
//     attributeDefs,
//     addressesFields,
//     upsertContactAttributes
//   }) => async values => {
//     try {
//       setDisabled(true)

//       const attributes = []
//       const index = getIndex(addressesFields)

//       Object.keys(values).forEach(key => {
//         if (values[key]) {
//           const attribute_def = selectDefinitionByName(attributeDefs, key)

//           if (attribute_def) {
//             attributes.push({
//               index,
//               attribute_def,
//               label: values.label,
//               is_primary: values.is_primary,
//               [attribute_def.data_type]: values[key]
//             })
//           }
//         }
//       })

//       addressesFields.forEach(attribute => {
//         attributes.push({
//           ...attribute,
//           is_primary: false
//         })
//       })

//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       setDisabled(false)
//       throw error
//     } finally {
//       setDisabled(false)
//       setShowModal(false)
//     }
//   }
// })
