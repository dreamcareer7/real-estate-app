import React from 'react'
import PropTypes from 'prop-types'

import Item from './Item'

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export function List(props) {
  return props.items.map(item => <Item key={item.id} item={item} />)
}
