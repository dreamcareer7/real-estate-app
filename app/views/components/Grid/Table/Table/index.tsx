import React from 'react'

import { Table, makeStyles, createStyles, Theme } from '@material-ui/core'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { Sorting } from '../features/Sorting'
import { Actions } from '../features/Actions'

import { Header } from '../Header'
import { Body } from '../Body'
import { useTable } from '../hooks/use-table'

import { useRowsSelection } from '../features/Selection/use-row-selection'
import { useRowsSorting } from '../features/Sorting/use-row-sorting'
import { useInfiniteScroll } from '../features/InfiniteScrolling/use-scroll'

import { GridHookPlugin, LoadingPosition } from '../types'

import { useGridContext } from '../hooks/use-grid-context'

import { Props } from '..'

import { setActiveSort } from '../context/actions/sorting/set-active-sort'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 0)
    },
    tableContainer: {
      position: 'relative'
    },
    summary: {
      margin: theme.spacing(1, 0),
      color: theme.palette.grey[700]
    },
    loading: ({ loading }: { loading: LoadingPosition }) => {
      let top: number | string = '50%'

      if (loading === 'top') {
        top = 0
      }

      if (loading === 'bottom') {
        top = '100%'
      }

      return {
        position: 'absolute',
        width: '100%',
        top,
        left: 0
      }
    }
  })
)

export function GridTable<Row>({
  columns,
  rows,
  totalRows,
  hoverable = true,
  summary = null,
  loading = null,
  selection = null,
  sorting = null,
  infiniteScrolling = null,
  hasHeader = false,
  getTdProps,
  getTrProps,
  stickyHeader = false,
  TableActions = null,
  LoadingState = null,
  EmptyState = null
}: Props<Row>) {
  useInfiniteScroll(infiniteScrolling)

  const classes = useStyles({ loading })
  const [state, dispatch] = useGridContext()

  useEffectOnce(() => {
    if (sorting && sorting.defaultSort) {
      dispatch(setActiveSort(sorting.defaultSort))
    }
  })

  const plugins: [GridHookPlugin<Row, object>, object][] = []

  if (selection) {
    plugins.push([useRowsSelection, selection])
  }

  if (sorting) {
    plugins.push([useRowsSorting, sorting])
  }

  const { columns: newColumns, rows: newRows } = useTable<Row>(
    columns,
    rows,
    plugins
  )

  return (
    <>
      <div className={classes.headerContainer}>
        <div>--- Filters ---</div>

        {rows && rows.length > 0 && (
          <div>
            <Sorting<Row> columns={columns} options={sorting} />
          </div>
        )}
      </div>

      {rows && rows.length === 0 && !loading && EmptyState && <EmptyState />}

      {summary && !loading && (
        <div className={classes.summary}>{summary(totalRows, state)}</div>
      )}

      <div className={classes.tableContainer}>
        {rows && rows.length > 0 && (
          <Table stickyHeader={stickyHeader}>
            {hasHeader && <Header<Row> columns={newColumns} rows={newRows} />}
            <Body<Row>
              columns={newColumns}
              rows={newRows}
              selection={selection}
              hoverable={hoverable}
              getTdProps={getTdProps}
              getTrProps={getTrProps}
            />
          </Table>
        )}

        {loading && LoadingState && (
          <div className={classes.loading}>
            <LoadingState />
          </div>
        )}
      </div>

      <Actions<Row>
        rows={newRows}
        totalRows={totalRows}
        TableActions={TableActions}
      />
    </>
  )
}
