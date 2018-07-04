import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 512 512'
const color = '#262626'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
  .svg-icon--tag {
    fill: ${props => props.color || color};
  }
`

const defaultProps = {
  children: [
    <path
      d="M121.5 64.2c-31.7 0-57.3 25.7-57.3 57.3 0 31.7 25.7 57.3 57.3 57.3 31.7 0 57.3-25.7 57.3-57.3.1-31.7-25.6-57.3-57.3-57.3zm0 94.3c-20.4 0-37-16.6-37-37s16.6-37 37-37 37 16.6 37 37-16.5 37-37 37z"
      className="svg-icon--tag"
      key="key-0"
    />,
    <path
      d="M244.5 29.8c-10.4-11.5-25-17.7-40.7-17.7L96.5 11C73.6 11 51.7 19.3 36 36 19.3 51.7 11 73.6 11 96.5l1 107.4c1 14.6 6.3 29.2 17.7 40.7L286.2 501 501 286.2 244.5 29.8zm40.7 442L43.3 229.9c-7.3-7.3-11.5-16.7-11.5-27.1l-1-106.3c0-16.7 7.3-33.4 18.8-45.9 12.5-12.5 29.2-19.8 46.9-19.8l106.3 1c10.4 0 19.8 4.2 27.1 11.5l241.9 241.9-186.6 186.6z"
      className="svg-icon--tag"
      key="key-1"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'TagIcon'
})
