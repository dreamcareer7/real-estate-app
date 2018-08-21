import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({noStyles}) => !noStyles ? getDimensionsCss() : null}
`

const defaultProps = {
  children: [
    <path
      d='M12.974 10.861c-1.478-.552-2.087-.915-2.087-1.484 0-.484.366-.968 1.496-.968 1.252 0 2.053.398 2.505.588l.504-1.95c-.574-.277-1.356-.518-2.522-.57v-1.52h-1.703v1.641c-1.86.363-2.94 1.554-2.94 3.073 0 1.675 1.271 2.537 3.131 3.159 1.287.431 1.843.845 1.843 1.503 0 .69-.678 1.07-1.669 1.07-1.131 0-2.156-.364-2.886-.76l-.522 2.02c.66.379 1.79.69 2.956.742v1.638h1.704v-1.76c1.999-.345 3.095-1.657 3.095-3.192-.001-1.557-.836-2.506-2.905-3.23z'
      key='key-0'
    />,
    <path
      d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.125C6.417 22.125 1.875 17.583 1.875 12S6.417 1.875 12 1.875 22.125 6.417 22.125 12 17.583 22.125 12 22.125z'
      key='key-1'
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconDeal'
})
