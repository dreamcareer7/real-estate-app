import { Box, makeStyles, useTheme } from '@material-ui/core'
import {
  mdiCalendarOutline,
  mdiEmailOutline,
  mdiLightningBoltOutline,
  mdiPhoneOutline,
  mdiTagMultipleOutline
} from '@mdi/js'
import cn from 'classnames'

import { Table } from 'components/Grid/Table'
import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'
import EditTextCell from 'components/Grid/Table/features/cells/EditTextCell'
import EmailCell from 'components/Grid/Table/features/cells/EmailCell'
import PhoneNumberCell from 'components/Grid/Table/features/cells/PhoneNumberCell'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
import {
  useGridStyles,
  useInlineGridStyles
} from 'components/Grid/Table/styles'
import { getAttributeFromSummary } from 'models/contacts/helpers'
import { goTo } from 'utils/go-to'

import NoSearchResults from '../../../../../Partials/no-search-results'
import { PARKED_CONTACTS_LIST_ID } from '../constants'

import { TableActions } from './Actions'
import Avatar from './columns/Avatar'
import FlowCell from './columns/Flows'
import LastTouched from './columns/LastTouched'
import TagsString from './columns/Tags'
import { LoadingComponent } from './components/LoadingComponent'
import ColumnHeaderCell from './grid/ColumnHeaderCell'

const useCustomGridStyles = makeStyles(theme => ({
  row: {
    '& .column': {
      '&.tags': {
        '& .MuiChip-root': { opacity: 0.5 }
      },
      '&.flows': {
        '& a': { color: theme.palette.grey['500'] },
        '& svg': { fill: theme.palette.grey['500'] }
      }
    },
    '&:hover .column': {
      '&.tags': {
        '& .MuiChip-root': { opacity: 1 }
      },
      '&.flows': {
        '& a': { color: theme.palette.text.primary },
        '& svg': { fill: theme.palette.text.primary }
      }
    }
  }
}))

const ContactsList = props => {
  const [state, dispatch] = useGridContext()
  const theme = useTheme()

  const inlineGridEnabled = true
  const gridClasses = useGridStyles()
  const inlineGridClasses = useInlineGridStyles()
  const customGridClasses = useCustomGridStyles()

  const isParkTabActive = props.activeSegment?.id === PARKED_CONTACTS_LIST_ID
  const resetSelectedRow = () => {
    const {
      selection: { selectedRowIds, isAllRowsSelected, isEntireRowsSelected }
    } = state

    if (
      selectedRowIds.length > 0 ||
      isAllRowsSelected ||
      isEntireRowsSelected
    ) {
      dispatch(resetRows())
    }
  }

  const getSelectedInfo = contactCount => {
    const {
      selection: { selectedRowIds, isEntireRowsSelected, excludedRows }
    } = state

    let selectedCount

    if (isEntireRowsSelected) {
      selectedCount = contactCount - excludedRows.length
    } else if (selectedRowIds.length > 0) {
      selectedCount = selectedRowIds.length
    }

    return selectedCount
      ? `${selectedCount} of ${contactCount} selected`
      : `${contactCount} CONTACTS`
  }

  const columns = [
    {
      id: 'name',
      headerName: ({ rows }) => (
        <Box sx={{ paddingLeft: '8px' }}>
          <ColumnHeaderCell
            title={getSelectedInfo(rows.length)}
            sortEnabled={false}
          />
        </Box>
      ),
      width: '220px',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact }) => {
        const name = getAttributeFromSummary(contact, 'display_name')

        return <EditTextCell text={name} isPrimary />
      }
    },
    {
      id: 'tag',
      headerName: () => (
        <ColumnHeaderCell
          title="Tags"
          iconPath={mdiTagMultipleOutline}
          sortEnabled={false}
        />
      ),
      width: '300px',
      class: 'opaque tags',
      render: ({ row: contact }) => (
        <TagsString
          contact={contact}
          reloadContacts={props.reloadContacts}
          hasAttributeFilters={
            (props.filters?.attributeFilters || []).length > 0
          }
          isParkTabActive={isParkTabActive}
        />
      )
    },
    {
      id: 'phone',
      headerName: () => (
        <ColumnHeaderCell
          title="Phone Number"
          iconPath={mdiPhoneOutline}
          sortEnabled={false}
        />
      ),
      width: '200px',
      render: ({ row: contact }) => <PhoneNumberCell contact={contact} />
    },
    {
      id: 'email',
      headerName: () => (
        <ColumnHeaderCell
          title="Email"
          iconPath={mdiEmailOutline}
          sortEnabled={false}
        />
      ),
      width: '200px',
      render: ({ row: contact }) => <EmailCell contact={contact} />
    },
    {
      id: 'last_touched',
      headerName: () => (
        <ColumnHeaderCell
          title="Last Touch"
          iconPath={mdiCalendarOutline}
          sortEnabled={false}
        />
      ),
      width: '200px',
      class: 'opaque',
      render: ({ row: contact }) => <LastTouched contact={contact} />
    },
    {
      id: 'flows',
      headerName: () => (
        <ColumnHeaderCell
          title="Flows"
          iconPath={mdiLightningBoltOutline}
          sortEnabled={false}
        />
      ),
      width: '90px',
      class: 'opaque flows',
      render: ({ row: contact }) => (
        <FlowCell
          contactId={contact.id}
          callback={() => {
            resetSelectedRow()
            props.reloadContacts()
          }}
          flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
        />
      )
    }
  ]

  const getLoading = () => {
    const { isFetching, isFetchingMore, isFetchingMoreBefore } = props

    if (!isFetching && !isFetchingMore && !isFetchingMoreBefore) {
      return null
    }

    if (isFetching) {
      return 'middle'
    }

    if (isFetchingMore) {
      return 'bottom'
    }

    if (isFetchingMoreBefore) {
      return 'top'
    }
  }

  const getRowProps = ({ row: contact }) => {
    return {
      onClick: () => goTo(`/dashboard/contacts/${contact.id}`)
    }
  }
  const getColumnProps = ({ column }) => {
    if (['name', 'flows', 'tag'].includes(column.id)) {
      return {
        onClick: e => e.stopPropagation()
      }
    }
  }

  return (
    <>
      <Table
        hasHeader
        rows={props.data}
        totalRows={props.totalRows}
        loading={getLoading()}
        columns={columns}
        inlineGridEnabled={inlineGridEnabled}
        itemSize={theme.spacing(5)}
        LoadingStateComponent={LoadingComponent}
        getTrProps={getRowProps}
        getTdProps={getColumnProps}
        selection={{
          defaultRender: ({ row }) => <Avatar contact={row} />,
          columnProps: {
            width: theme.spacing(7)
          },
          showSelectAll: false
        }}
        classes={{
          row: cn({
            [gridClasses.row]: !inlineGridEnabled,
            [inlineGridClasses.row]: inlineGridEnabled,
            [customGridClasses.row]: true
          })
        }}
        infiniteScrolling={{
          onReachEnd: props.onRequestLoadMore,
          onReachStart: props.onRequestLoadMoreBefore
        }}
        TableActions={
          <TableActions
            filters={props.filters}
            isFetching={props.isFetching}
            totalRowsCount={props.listInfo.total}
            reloadContacts={props.reloadContacts}
            onRequestDelete={props.onRequestDelete}
            activeSegmentId={props.activeSegment?.id ?? ''}
            handleChangeContactsAttributes={
              props.handleChangeContactsAttributes
            }
          />
        }
        EmptyStateComponent={() => (
          // eslint-disable-next-line max-len
          <NoSearchResults description="Try typing another name, email, phone or tag." />
        )}
      />
    </>
  )
}

export default ContactsList
