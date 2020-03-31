import React from 'react'
import { connect } from 'react-redux'

import { createStyles, makeStyles } from '@material-ui/core'

import { selectTags } from 'reducers/contacts/tags'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import Filters from 'components/Grid/Filters'
import SaveSegment from 'components/Grid/SavedSegments/Create'
import { SimpleList } from 'components/Grid/Filters/FilterTypes/SimpleList'
import { OperatorAndOperandFilter } from 'components/Grid/Filters/FilterTypes/OparatorAndOperand'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID, ORIGINS } from '../constants'

import createFiltersFromSegment from './helpers/create-filters-from-segment'
import createSegmentFromFilters from './helpers/create-segment-from-filters'
import getFlows from './helpers/get-flows'
import getOpenHouseEvents from './helpers/get-open-house-events'
import getUniqTags from './helpers/get-uniq-tags'
import { getPredefinedContactLists } from '../utils/get-predefined-contact-lists'

const useStyles = makeStyles(theme =>
  createStyles({
    totalRow: {
      display: 'inline-flex',
      marginRight: theme.spacing(2),
      fontSize: theme.typography.overline.fontSize,
      color: theme.palette.grey['500']
    }
  })
)

function ContactFilters(props) {
  const classes = useStyles()

  const getConfig = () => {
    const { attributeDefs, tags, user } = props

    const tagDefinition = selectDefinitionByName(attributeDefs, 'tag')
    const sourceDefinition = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )

    return [
      {
        id: tagDefinition.id,
        label: 'Tag',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={getUniqTags(tags)} />
        ),
        tooltip:
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      },
      {
        id: OPEN_HOUSE_FILTER_ID,
        label: 'Open House',
        renderer: props => (
          <SimpleList {...props} getOptions={getOpenHouseEvents} />
        ),
        tooltip: 'Contacts invited to a specific Open House'
      },
      {
        id: FLOW_FILTER_ID,
        label: 'Flow',
        renderer: props => (
          <SimpleList {...props} getOptions={() => getFlows(user)} />
        ),
        tooltip: 'Contacts who are active in a specific Flow'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={ORIGINS} />
        ),
        tooltip: 'Source type'
      }
    ]
  }

  return (
    <>
      <span className={classes.totalRow}>{props.contactCount} CONTACTS</span>
      <Filters
        name="contacts"
        plugins={['segments']}
        config={getConfig()}
        createFiltersFromSegment={createFiltersFromSegment}
        getPredefinedLists={getPredefinedContactLists}
        onChange={() => props.onFilterChange()}
        disableConditionOperators={props.disableConditionOperators}
      >
        <SaveSegment
          createSegmentFromFilters={createSegmentFromFilters(
            props.conditionOperator
          )}
        />
      </Filters>
    </>
  )
}

function mapStateToProps({ contacts, user }) {
  const { tags, attributeDefs } = contacts

  return {
    user,
    tags: selectTags(tags),
    conditionOperator: contacts.filterSegments.conditionOperator,
    attributeDefs
  }
}

export default connect(mapStateToProps)(ContactFilters)
