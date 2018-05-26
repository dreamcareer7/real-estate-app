import { combineReducers } from 'redux'

const INITIAL_STATE = { pages: {}, currentPage: 0 }

const pages = (pages = {}, action = {}) => {
  switch (action.type) {
    case 'REQUEST_PAGE':
      return {
        ...pages,
        [action.payload.page]: {
          ids: [],
          fetching: true
        }
      }
    case 'RECEIVE_PAGE': {
      return {
        ...pages,
        [action.payload.page]: {
          ids: action.payload.ids,
          fetching: false
        }
      }
    }
    case 'CLEAR_PAGINATION':
      return {}
    default:
      return pages
  }
}

const currentPage = (currentPage = 0, action = {}) => {
  switch (action.type) {
    case 'REQUEST_PAGE':
      return action.payload.page
    case 'CLEAR_PAGINATION':
      return 0
    default:
      return currentPage
  }
}

function createPaginationReducer(list) {
  const onlyForKey = reducer => (state = INITIAL_STATE, action = {}) => {
    if (typeof action.meta === 'undefined') {
      return state
    }

    if (action.meta.list === list) {
      return reducer(state, action)
    }

    return state
  }

  return onlyForKey(
    combineReducers({
      pages,
      currentPage
    })
  )
}

export const contactPagination = createPaginationReducer('contacts')
