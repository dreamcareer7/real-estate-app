import { CSSProperties } from 'react'

import { resizablePluginOptions } from '../config'

export function getSizeStyles(
  width: string | undefined,
  height: string | undefined
): CSSProperties {
  const styles: CSSProperties = {}

  // NOTE: we currently are using 'relative' positioning which is the default
  // mode in resizable draftjs plugin. If we change that, we need to change
  // here too
  const horizontalUnit = resizeTypeToUnit(resizablePluginOptions.horizontal)
  const verticalUnit = resizeTypeToUnit(resizablePluginOptions.vertical)

  styles.width = `${width || 40}${horizontalUnit}`

  if (height) {
    styles.height = `${height || 40}${verticalUnit}`
  }

  return styles
}

const resizeTypeToUnit = type => (type === 'absolute' ? 'px' : '%')
