import { CSSProperties, memo, useMemo } from 'react'

import cn from 'classnames'

import { StateContext } from '../../context'
import { TableColumn, TrProps, TdProps, GridClasses } from '../../types'

import { RowContainer as ListRowContainer, GridRowContainer } from './styled'

interface Props<Row> {
  index: number
  style: CSSProperties
  data: {
    inlineGridEnabled?: boolean
    rows: Row[]
    columns: TableColumn<Row>[]
    state: StateContext
    classes: GridClasses
    columnsSize: string[]
    getTrProps?: (data: TrProps<Row>) => object
    getTdProps?: (data: TdProps<Row>) => object
  }
}

function Row<T>({
  index: rowIndex,
  style,
  data: {
    inlineGridEnabled,
    columns,
    rows,
    state,
    classes,
    columnsSize,
    getTrProps = () => ({}),
    getTdProps = () => ({})
  }
}: Props<T & { id?: string }>) {
  const row = rows[rowIndex]

  const isRowSelected = useMemo(
    () =>
      state.selection.isAllRowsSelected ||
      state.selection.isEntireRowsSelected ||
      state.selection.selectedRowIds.includes(row.id || rowIndex.toString()),
    [state.selection, row.id, rowIndex]
  )

  const RowContainer = inlineGridEnabled ? GridRowContainer : ListRowContainer

  return (
    <RowContainer
      index={rowIndex}
      selected={isRowSelected}
      className={classes.row}
      style={style}
      data-tour-id={`row-${rowIndex}`}
      {...getTrProps({
        rowIndex,
        row,
        selected: isRowSelected
      })}
    >
      {columns
        .filter((column: TableColumn<T>) => column.render)
        .map((column: TableColumn<T>, columnIndex: number) => (
          <div
            key={columnIndex}
            className={cn('column', column.class, {
              primary: !inlineGridEnabled && column.primary === true
            })}
            style={{
              width: columnsSize[columnIndex],
              textAlign: column.align || 'left',
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
            {getCell(
              column,
              row,
              rowIndex,
              columnIndex,
              rows.length,
              isRowSelected
            )}
          </div>
        ))}
    </RowContainer>
  )
}

function getCell<Row>(
  column: TableColumn<Row>,
  row: Row,
  rowIndex: number,
  columnIndex: number,
  totalRows: number,
  isRowSelected: boolean
) {
  if (column.render) {
    return column.render({
      row,
      totalRows,
      rowIndex,
      columnIndex,
      isRowSelected
    })
  }

  return null
}

export default memo(Row)
