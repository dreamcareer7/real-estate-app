import React from 'react'
import {
  TableBody,
  TableCell,
  TableRow,
  makeStyles,
  Theme
} from '@material-ui/core'

import cn from 'classnames'

import {
  TableColumn,
  GridSelectionOptions,
  GridClasses,
  TrProps,
  TdProps
} from '../types'

import { resolveAccessor } from '../helpers/resolve-accessor'

import { useGridContext } from '../hooks/use-grid-context'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  selection: GridSelectionOptions<Row> | null
  hoverable: boolean
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

interface Props<Row> {
  row: Row
  rowIndex: number
  rowsCount: number
  columns: TableColumn<Row>[]
  hoverable: boolean
  selection: GridSelectionOptions<Row> | null
  isSelected: boolean
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    '& tr:nth-child(odd)': {
      backgroundColor: theme.palette.grey[50]
    }
  },
  row: ({ selection }: { selection: GridSelectionOptions<any> | null }) => {
    let styles = {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      '& td:first-child': {
        paddingLeft: theme.spacing(1)
      },
      '&:hover .primary': {
        cursor: 'pointer'
      }
    }

    if (selection) {
      styles = {
        ...styles,
        ...{
          '&:hover .selection--default-value': {
            display: 'none !important'
          },
          '&:hover .selection--checkbox': {
            display: 'block !important '
          },
          '& .selected': {
            backgroundColor: theme.palette.action.selected
          }
        }
      }
    }

    return styles
  },
  column: {
    padding: 0,
    borderBottom: 'none',
    height: theme.spacing(8)
  }
}))

export function Body<Row>({
  columns,
  rows,
  classes,
  selection,
  hoverable,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row & { id?: string }>) {
  const [state] = useGridContext()

  const bodyClasses = useStyles({ selection })

  const isRowSelected = (row: Row & { id?: string }, rowIndex: number) => {
    return (
      state.selection.isAllRowsSelected ||
      state.selection.isEntireRowsSelected ||
      state.selection.selectedRowIds.includes(row.id || rowIndex.toString())
    )
  }

  return (
    <TableBody className={bodyClasses.table}>
      {rows.map((row, rowIndex: number) => (
        <TableRow
          key={row.id || rowIndex}
          className={cn(bodyClasses.row, classes.row)}
          hover={hoverable}
          {...getTrProps({
            rowIndex,
            row,
            selected: isRowSelected(row, rowIndex)
          })}
        >
          {columns
            .filter(
              (column: TableColumn<Row>) => column.render || column.accessor
            )
            .map((column: TableColumn<Row>, columnIndex: number) => (
              <TableCell
                key={columnIndex}
                align={column.align || 'inherit'}
                classes={{
                  root: cn(bodyClasses.column, column.class)
                }}
                className={cn({
                  primary: column.primary === true,
                  selected: isRowSelected
                })}
                style={{
                  width: column.width || 'inherit',
                  ...(column.rowStyle || {}),
                  ...(column.style || {})
                }}
                {...getTdProps({
                  columnIndex,
                  column,
                  rowIndex,
                  row
                })}
              >
                {getCell(column, row, rowIndex, columnIndex, rows.length)}
              </TableCell>
            ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

function getCell<Row>(
  column: TableColumn<Row>,
  row: Row,
  rowIndex: number,
  columnIndex: number,
  totalRows: number
) {
  if (column.render) {
    return column.render({
      row,
      totalRows,
      rowIndex,
      columnIndex
    })
  }

  if (column.accessor) {
    return resolveAccessor(column.accessor, row, rowIndex)
  }

  return ''
}
