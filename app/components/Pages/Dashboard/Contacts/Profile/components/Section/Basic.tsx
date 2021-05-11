import React, { ReactNode } from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: (props: Props) => {
        if (props.title) {
          return theme.spacing(3)
        }

        return theme.spacing(1)
      }
    },
    title: {
      display: 'inline-block',
      marginBottom: theme.spacing(0.75),
      color: theme.palette.grey[700],
      ...theme.typography.body1
    }
  }),
  { name: 'ContactProfileBasicSection' }
)

interface Props {
  title?: string
  children?: ReactNode
}

export const BasicSection = ({ title, children }: Props) => {
  const classes = useStyles({ title, children })

  return (
    <Box className={classes.container}>
      {title && <span className={classes.title}>{title}</span>}
      {children}
    </Box>
  )
}
