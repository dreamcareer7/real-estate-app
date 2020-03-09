import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'

import { makeStyles, createStyles } from '@material-ui/core'

import Table from 'components/Grid/Table'

import { useGridStyles } from 'components/Grid/Table/styles'

import Layout from './Layout'
import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import Actions from './MarketingInsightsActions'
import ThumbnailColumn from './Column/Thumbnail'
import TitleColumn from './Column/Title'
import DateColumn from './Column/Date'
import RecipientsColumn from './Column/Recipients'
import StatsColumn from './Column/Stats'
import { InsightContainer } from './styled'
import useListData from './useListData'
import useFilterList from './useFilterList'
import { InsightFiltersType } from './types'

const useCustomGridStyles = makeStyles(theme =>
  createStyles({
    row: {
      '& td': {
        '&.actions svg': {
          fill: theme.palette.grey['500']
        }
      },
      '&:hover td': {
        '&.actions svg': {
          fill: theme.palette.text.primary
        }
      }
    }
  })
)

function List(props) {
  const customGridClasses = useCustomGridStyles()
  const [queue, setQueue] = useState(0)
  const { list, isLoading } = useListData(props.user, queue)
  const gridClasses = useGridStyles()
  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFiltersType.SCHEDULED
    : InsightFiltersType.SENT
  const { filteredList, stats } = useFilterList(list, filterType)

  React.useEffect(() => {
    window.socket.on('email_campaign:send', () => setQueue(queue => queue + 1))
  }, [])

  const columns = useMemo(
    () => [
      {
        header: 'Thumbnail',
        id: 'thumbnail',
        class: 'opaque',
        width: 70,
        verticalAlign: 'center',
        render: ({ row }) => <ThumbnailColumn data={row} />
      },
      {
        header: 'Title',
        id: 'title',
        primary: true,
        width: '25%',
        verticalAlign: 'center',
        render: ({ row }) => (
          <TitleColumn
            data={row}
            reloadList={() => setQueue(queue => queue + 1)}
          />
        )
      },
      {
        header: 'Recipients',
        id: 'recipients',
        class: 'opaque',
        width: '25%',
        verticalAlign: 'center',
        render: ({ row }) => <RecipientsColumn data={row.recipients} />
      },
      {
        header: 'Date',
        id: 'date',
        class: 'opaque',
        width: '25%',
        verticalAlign: 'center',
        render: ({ row }) => <DateColumn data={row} />
      },
      {
        header: 'Stats',
        id: 'stats',
        class: 'visible-on-hover',
        width: '7%',
        verticalAlign: 'center',
        render: ({ row }) =>
          row.executed_at ? <StatsColumn data={row} /> : null
      },
      {
        header: '',
        id: 'actions-th',
        class: 'actions',
        verticalAlign: 'center',
        width: '2rem',
        render: ({ row }) =>
          !row.executed_at ? (
            <Actions
              data={row}
              reloadList={() => setQueue(queue => queue + 1)}
            />
          ) : null
      }
    ],
    []
  )

  const renderContent = ({ sortBy, onChangeSort }) => {
    const isFiltering =
      list.length > 0 && stats.sent === 0 && stats.scheduled === 0

    if (isLoading || isFiltering) {
      return <LoadingComponent />
    }

    return (
      <Table
        rows={filteredList}
        totalRows={filteredList.length}
        columns={columns}
        EmptyStateComponent={() => (
          <NoSearchResults description='Try sending your first campaign using "Send New Email" button.' />
        )}
        loading={isLoading ? 'middle' : null}
        LoadingStateComponent={LoadingComponent}
        hoverable={false}
        sorting={{
          sortBy: {
            value: sortBy.value,
            ascending: sortBy.ascending
          },
          onChange: onChangeSort
        }}
        classes={{
          row: cn(gridClasses.row, customGridClasses.row)
        }}
      />
    )
  }

  return (
    <Layout
      sentCount={stats.sent}
      scheduledCount={stats.scheduled}
      renderContent={props => (
        <InsightContainer>{renderContent(props)}</InsightContainer>
      )}
    />
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(List)
