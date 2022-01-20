import { Theme } from '@material-ui/core'
import styled, { css } from 'styled-components'

export const RowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: '${theme.typography.body2.fontFamily}';
    font-weight: ${theme.typography.body2.fontWeight};
    font-size: ${theme.typography.body2.fontSize};
    line-height: ${theme.typography.body2.lineHeight};

    background-color: ${index % 2 === 0
      ? theme.palette.grey[50]
      : 'transparent'};

    .column:first-child {
      padding-left: ${theme.spacing(1)}px;
    }

    &:hover {
      background-color: ${theme.palette.action.hover};
    }

    &:hover .primary {
      cursor: pointer;

      a {
        color: ${theme.palette.secondary.main};
        text-decoration: underline;
      }
    }

    &:hover .selection--default-value {
      display: none !important;
    }

    &:hover .selection--checkbox {
      display: block !important;
    }

    ${selected &&
    css`
      background-color: ${theme.palette.action.selected};
    `}
  `}
`

export const GridRowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => `
    border-bottom: 1px solid ${theme.palette.divider};
    display: flex;
    align-items: stretch;
    background-color: transparent;

    &:first-child {
      border-top: 1px solid ${theme.palette.divider};
    }

    &:hover {
      background-color: ${theme.palette.grey[50]};
      color: ${theme.palette.secondary.main} !important;
    }

    &:hover .selection--default-value {
      display: none !important;
    }

    &:hover .selection--checkbox {
      display: block !important;
    }

    .column {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .column:first-child {
      border-right: none;
      border-left: none;
    }

    ${
      selected &&
      css`
        background-color: ${theme.palette.action.selected};
      `
    }
  `}
`
