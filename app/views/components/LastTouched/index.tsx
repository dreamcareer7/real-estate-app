import React from 'react'
import timeago from 'timeago.js'
import { Typography, Box, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      fontSize: theme.typography.body2.fontSize,
      fontWeight: theme.typography.body2.fontWeight
    }
  })
)

interface Props {
  contact: IContact
}

export function LastTouched(props: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch, next_touch: nextTouch } = props.contact

  if (!lastTouch) {
    return (
      <Typography variant="body2" data-tour-id="last-touch">
        You have not added any touches for this contact.
      </Typography>
    )
  }

  return (
    <Box className={classes.wrapper} data-tour-id="last-touch">
      <span>
        Last Touch was <b>{timeago().format(lastTouch * 1000)}</b>
        {!nextTouch && '.'}
      </span>
      {nextTouch && (
        <span>
          , you wanted to be in touch every{' '}
          <b>{Math.round((nextTouch - lastTouch) / 86400)}</b> days.
        </span>
      )}
    </Box>
  )
}
