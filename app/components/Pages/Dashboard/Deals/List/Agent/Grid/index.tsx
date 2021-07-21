import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { TableCellProps } from '@material-ui/core'

import Grid from 'components/Grid/Table'
import { TrProps } from 'components/Grid/Table/types'
import { useGridStyles } from 'components/Grid/Table/styles'
import { SortableColumn, ColumnSortType } from 'components/Grid/Table/types'

import { IAppState } from 'reducers'

import {
  getStatus,
  getField,
  getFormattedPrice
} from 'models/Deal/helpers/context'
import { getActiveTeamId } from 'utils/user-teams'
import { sortDealsStatus } from 'utils/sort-deals-status'

import { useBrandStatuses } from 'hooks/use-brand-statuses'

import {
  isActiveDeal,
  isArchivedDeal,
  isPendingDeal
} from 'deals/List/helpers/statuses'

import { selectUser } from 'selectors/user'

import { useBrandChecklists } from '@app/hooks/use-brand-checklists'

import { goTo } from '@app/utils/go-to'

import { SORT_FIELD_SETTING_KEY } from '../helpers/agent-sorting'
import { getGridSort } from '../../helpers/sorting'

import EmptyState from './EmptyState'
import LoadingState from '../../components/LoadingState'

import AgentAvatars from '../../components/table-columns/AgentAvatars'
import { Address } from '../../components/table-columns/Address'
import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'

import { getPrimaryAgent, getPrimaryAgentName } from '../../../utils/roles'
import onDealOpened from '../../../utils/on-deal-opened'

interface Props {
  sortableColumns: SortableColumn[]
  activeFilter: string
}

const Filters = {
  all: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return !isArchivedDeal(deal, statuses)
  },
  drafts: (deal: IDeal) => {
    return deal.is_draft === true
  },
  actives: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return isActiveDeal(deal, statuses)
  },
  pendings: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return isPendingDeal(deal, statuses)
  },
  archives: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return isArchivedDeal(deal, statuses)
  }
}

function AgentGrid(props: Props & WithRouterProps) {
  const gridClasses = useGridStyles()

  const isFetchingDeals = useSelector(
    ({ deals }: IAppState) => deals.properties.isFetchingDeals
  )
  const deals = useSelector(({ deals }: IAppState) => deals.list)
  const roles = useSelector(({ deals }: IAppState) => deals.roles)
  const user = useSelector(selectUser)
  const brandChecklists = useBrandChecklists(getActiveTeamId(user)!)

  const statuses = useBrandStatuses(getActiveTeamId(user)!)

  const columns = [
    {
      id: 'address',
      width: '30%',
      accessor: (deal: IDeal) => deal.title,
      render: ({ row: deal, totalRows, rowIndex }) => (
        <Address
          deal={deal}
          roles={roles}
          totalRows={totalRows}
          rowIndex={rowIndex}
          notificationsCount={
            deal.new_notifications ? deal.new_notifications.length : 0
          }
        />
      )
    },
    {
      id: 'status',
      width: '15%',
      class: 'opaque',
      accessor: (deal: IDeal) => getStatus(deal) || '',
      render: ({ row: deal }: { row: IDeal }) => getStatus(deal),
      sortFn: (rows: IDeal[]) => sortDealsStatus(rows, statuses)
    },
    {
      id: 'price',
      sortType: 'number' as ColumnSortType,
      width: '10%',
      class: 'opaque',
      accessor: (deal: IDeal) => getPriceValue(deal),
      render: ({ row: deal }: { row: IDeal }) =>
        getFormattedPrice(getPriceValue(deal), 'currency', 0)
    },
    {
      id: 'critical-dates',
      width: '20%',
      class: 'opaque',
      accessor: (deal: IDeal) => getCriticalDateNextValue(deal),
      render: ({ row: deal }) => (
        <CriticalDate deal={deal} brandChecklists={brandChecklists} />
      )
    },
    {
      id: 'agent-name',
      width: '10%',
      class: 'opaque',
      align: 'right' as TableCellProps['align'],
      accessor: (deal: IDeal) => getPrimaryAgentName(deal, roles),
      render: ({ row: deal }: { row: IDeal }) => {
        return <AgentAvatars agent={getPrimaryAgent(deal, roles)} />
      }
    }
  ]

  const data = useMemo(() => {
    if (!deals) {
      return []
    }

    const filterFn =
      props.activeFilter && Filters[props.activeFilter]
        ? Filters[props.activeFilter]
        : Filters.all

    return Object.values(deals).filter(deal =>
      filterFn(deal, statuses)
    ) as IDeal[]
  }, [deals, statuses, props.activeFilter])

  const getRowProps = ({ row: deal }: TrProps<IDeal>) => {
    return {
      onClick: () => {
        goTo(`/dashboard/deals/${deal.id}`)
        onDealOpened()
      }
    }
  }

  return (
    <Grid<IDeal>
      sorting={{
        columns: props.sortableColumns,
        sortBy: getGridSort(
          user,
          columns,
          props.location,
          SORT_FIELD_SETTING_KEY
        )
      }}
      columns={columns}
      rows={data}
      totalRows={data.length}
      virtualize={data.length > 30}
      LoadingStateComponent={LoadingState}
      EmptyStateComponent={EmptyState}
      loading={isFetchingDeals ? 'middle' : null}
      getTrProps={getRowProps}
      classes={{
        row: gridClasses.row
      }}
    />
  )
}

function getPriceValue(deal: IDeal): string {
  const field = [
    'sales_price',
    'leased_price',
    'list_price',
    'lease_price'
  ].find(name => getField(deal, name) !== null)

  return getField(deal, field)
}

export default withRouter(AgentGrid)
