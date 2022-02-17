import { Box, makeStyles } from '@material-ui/core'
import { mdiOpenInNew, mdiCheck, mdiEyeOutline, mdiAccountTie } from '@mdi/js'
import classNames from 'classnames'

import { useGridStyles } from '@app/views/components/Grid/Table/styles'
import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import { goTo } from 'utils/go-to'

import { getShowingBookingPageUrl, getShowingImage } from '../../helpers'
import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingEmptyState from '../ShowingEmptyState'
import ShowingLabeledColumn from '../ShowingLabeledColumn'

import ShowingPropertyListColumnActions from './ShowingPropertyListColumnActions'
import useGetShowingNotificationCount from './use-get-showing-notification-count'
import useSortPropertiesByNotificationCount from './use-sort-properties-by-notification-count'

const useStyles = makeStyles(
  theme => ({
    row: {
      paddingRight: theme.spacing(2),
      '&:hover $actions': { opacity: 1 }
    },
    actions: {
      transition: theme.transitions.create('opacity'),
      opacity: 0
    }
  }),
  { name: 'ShowingPropertyList' }
)

interface ShowingPropertyListProps {
  isLoading?: boolean
  showings: IShowing<'showing'>[]
}

function ShowingPropertyList({
  isLoading,
  showings: rows
}: ShowingPropertyListProps) {
  const classes = useStyles()
  const gridClasses = useGridStyles()

  const showingNotificationCount = useGetShowingNotificationCount(rows)

  const handleRowClick = (showingId: UUID) => {
    goTo(`/dashboard/showings/${showingId}/detail`)
  }

  const columns: TableColumn<IShowing<'showing'>>[] = [
    {
      id: 'property',
      width: '30%',
      primary: true,
      render: ({ row }) => (
        <ShowingColumnProperty
          image={getShowingImage({ listing: row.listing, deal: row.deal })}
          address={row.title}
          badge={showingNotificationCount[row.id]}
        />
      )
    },
    {
      header: 'Approved',
      id: 'approved',
      width: '100px',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn>
          <Box textAlign="center">{row.confirmed}</Box>
        </ShowingLabeledColumn>
      )
    },
    {
      header: 'Total Visits',
      id: 'total-visits',
      width: '220px',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn>
          <Box textAlign="center">{row.visits}</Box>
        </ShowingLabeledColumn>
      )
    },
    {
      header: 'Agent',
      id: 'agent',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn>
          {`${row.roles[0].first_name} ${row.roles[0].last_name}`}
        </ShowingLabeledColumn>
      )
    },
    {
      header: 'Body',
      id: 'body-actions',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <ShowingPropertyListColumnActions
          className={classes.actions}
          bookingUrl={getShowingBookingPageUrl(row)}
          listingId={row.listing?.id || row.deal?.listing?.id}
        />
      )
    }
  ]

  const sortedRows = useSortPropertiesByNotificationCount(
    rows,
    showingNotificationCount
  )

  return (
    <Box minHeight="320px">
      <Table
        header={[
          {
            title: 'Property',
            icon: mdiOpenInNew,
            width: '30%',
            textAlign: 'left'
          },
          {
            title: 'Approved',
            icon: mdiCheck,
            width: '100px',
            textAlign: 'center'
          },
          {
            title: 'Total Bookings',
            icon: mdiEyeOutline,
            width: '220px',
            textAlign: 'center'
          },
          {
            title: 'Agent',
            icon: mdiAccountTie,
            width: '15%',
            textAlign: 'left'
          }
        ]}
        rows={sortedRows}
        totalRows={sortedRows.length}
        columns={columns}
        loading={isLoading ? 'middle' : null}
        LoadingStateComponent={() => (
          <LoadingContainer style={{ padding: '10% 0' }} />
        )}
        EmptyStateComponent={() => (
          <ShowingEmptyState
            title="There are no Showings."
            // eslint-disable-next-line max-len
            description="Create your first showing for your off-market or MLS listings under 2 minutes."
          />
        )}
        getTrProps={({ row }) => ({
          onClick: () => handleRowClick(row.id)
        })}
        classes={{ row: classNames(classes.row, gridClasses.row) }}
      />
    </Box>
  )
}

export default ShowingPropertyList
