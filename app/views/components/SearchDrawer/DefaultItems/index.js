import React from 'react'

import { ListContainer, ListTitle } from '../styled'
import { Body } from '../components/Body'

export function DefaultItems(props) {
  if (props.isLoading || props.defaultItems.length === 0) {
    return false
  }

  return (
    <ListContainer
      style={{
        marginTop: '1rem'
      }}
    >
      <ListTitle>{props.defaultListTitle}</ListTitle>

      <Body
        showAddButton
        getItemProps={props.getItemProps}
        list={props.defaultItems}
        handleSelectItem={props.handleSelectItem}
        {...props.listsSharedProps}
      />
    </ListContainer>
  )
}
