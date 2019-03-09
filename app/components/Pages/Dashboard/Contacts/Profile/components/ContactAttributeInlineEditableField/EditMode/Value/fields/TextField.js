import React from 'react'
import PropTypes from 'prop-types'

import { Input } from 'components/inline-editable-fields/styled'

export class TextField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  state = {
    value: this.props.value
  }

  onChange = event =>
    this.setState({ value: event.target.value }, () =>
      this.props.onChange(this.state.value)
    )

  render() {
    return <Input value={this.state.value} onChange={this.onChange} autoFocus />
  }
}