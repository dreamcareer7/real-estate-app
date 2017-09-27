import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { Grid } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Header from './Header'
import RowRole from './Row'
import {
  getRoles
} from '../../../../../store_actions/brandConsole'

class Roles extends React.Component {
  constructor(props) {
    super(props)
    this.aclTypes = ['Deals', 'Backoffice', 'Admin']
  }

  componentDidMount() {
    this.props.getRoles(this.props.brand)
  }

  render() {
    const { roles } = this.props
    return (
      <div className="checklists">
        <Header
          brand={this.props.brand}
          aclTypes={this.aclTypes}
        />
        <Grid className="table">
          <div className="checklist--header">
            <div className="checklist--header--column-flex-2">Role Name</div>
            {this.aclTypes.map(permission =>
              <div className="checklist--header--column-center">{permission}</div>
            )
            }
            <div className="checklist--header--column-flex-2" />
          </div>
          {roles.map(role =>
            <RowRole
              role={role}
              aclTypes={this.aclTypes}
            />
          )}
        </Grid>
      </div>
    )
  }
}

Roles.propTypes = {
  brand: PropTypes.string,
  roles: PropTypes.array,
  getRoles: PropTypes.func
}

export default connect(
  ({ brandConsole, data }) => ({
    roles: brandConsole.roles || [],
    user: data.user
  }),
  ({
    getRoles
  })
)(Roles)
