import React from 'react'
import styled from 'styled-components'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import XlsxIcon from '../../../../../../../views/components/SvgIcons/Xlsx/XlsxIcon'

const Button = ActionButton.withComponent('a')
const Xlsx = styled(XlsxIcon)`
  margin-right: 0.5rem;
`

export default function ExportButton({ disabled, onClick }) {
  return (
    <Button
      appearance="outline"
      disabled={disabled}
      size="small"
      onClick={onClick}
    >
      <Xlsx />
      Export to Spreadsheet
    </Button>
  )
}
