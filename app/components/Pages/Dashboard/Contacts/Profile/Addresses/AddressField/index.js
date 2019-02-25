import React from 'react'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'

import { postLoadFormat, preSaveFormat, getUpsertAttributes } from './helpers'

const DEFAULT_LABEL = { label: 'Select', value: '' }

function destructuringAddress(address) {
  let { label, full_address, is_primary } = address

  if (!label) {
    label = address.id ? DEFAULT_LABEL : { label: 'Home', value: 'Home' }
  } else {
    label = { label, value: label }
  }

  return {
    address: full_address || '',
    is_primary,
    label
  }
}

const getInitialState = (address = {}) => ({
  isEditMode: false,
  isDisabled: false,
  ...destructuringAddress(address)
})

export class AddressField extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState(props.address)

    this.labels = [
      DEFAULT_LABEL,
      ...props.address.labels.map(label => ({ label, value: label }))
    ]
  }

  static getDerivedStateFromProps(props, state) {
    const { address } = props

    if (
      !state.isEditMode &&
      !state.isDisabled &&
      (address.label !== state.label.value ||
        address.full_address !== state.address ||
        address.is_primary !== state.is_primary)
    ) {
      return getInitialState(address)
    }

    return null
  }

  setMode = isEditMode => this.setState({ isEditMode })

  onChangeLabel = label => this.setState({ label })

  onChangePrimary = () =>
    this.setState(state => ({ is_primary: !state.is_primary }))

  handleDelete = async toggleMode => {
    this.setState({ isDisabled: true })

    const attributeIds = this.props.address.attributes
      .filter(attribute => attribute.id)
      .map(attribute => attribute.id)

    try {
      await this.props.handleDelete(this.props.address.index, attributeIds)

      this.setState({ isDisabled: false }, toggleMode)
    } catch (error) {
      console.error(error)
      this.setState({ isDisabled: false })
    }
  }

  handleSubmit = async (values, toggleMode) => {
    const {
      is_primary,
      label: { value: label }
    } = this.state

    const upsertList = getUpsertAttributes(
      {
        label,
        values,
        is_primary
      },
      destructuringAddress(this.props.address),
      this.props.address.attributes
    )

    if (upsertList.length > 0) {
      this.setState({ isDisabled: true })

      try {
        await this.props.handleSubmit(upsertList)

        this.setState({ isDisabled: false }, toggleMode)
      } catch (error) {
        console.error(error)
        this.setState({ isDisabled: false })
      }
    }
  }

  onSubmit = toggleMode => this.handleSubmit({}, toggleMode)

  postLoadFormat = (values, originalValues) =>
    postLoadFormat(values, originalValues, this.props.address)

  renderEditMode = props => (
    <EditMode
      {...props}
      {...this.state}
      handleSubmit={this.handleSubmit}
      labels={this.labels}
      preSaveFormat={preSaveFormat}
      postLoadFormat={this.postLoadFormat}
      onChangeLabel={this.onChangeLabel}
      onChangePrimary={this.onChangePrimary}
    />
  )

  renderViewMode = props => <ViewMode {...props} address={this.props.address} />

  render() {
    return (
      <InlineEditableField
        handleSave={this.onSubmit}
        handleDelete={this.handleDelete}
        handleAddNew={this.props.handleAddNew}
        isDisabled={this.state.isDisabled}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd
        showDelete
        toggleModeCallback={this.setMode}
      />
    )
  }
}
