import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

import GlobalActionsButton from 'components/GlobalActionsButton'

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  noGlobalActionsButton?: boolean
  children?: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ({ noPadding }: GlobalHeaderProps) =>
      !noPadding ? theme.spacing(3) : 0,
    width: '100%'
  },
  content: {
    flexGrow: 1
  }
}))

export default function GlobalHeader({
  title,
  noPadding = false,
  noGlobalActionsButton,
  children
}: GlobalHeaderProps) {
  const classes = useStyles({ noPadding })

  return (
    <div className={classes.wrapper}>
      {title && (
        <div>
          <Typography variant="h3">{title}</Typography>
        </div>
      )}
      {children && <div className={classes.content}>{children}</div>}
      {!noGlobalActionsButton && (
        <div>
          <GlobalActionsButton />
        </div>
      )}
    </div>
  )
}
