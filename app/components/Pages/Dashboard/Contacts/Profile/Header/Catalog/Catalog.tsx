import React from 'react'
import { Box, Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LastTouched } from 'components/LastTouched'

import Avatar from './Avatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: `${theme.spacing(1)}px`,
      width: 'calc(100% - 56px)'
    },
    editButton: {
      marginLeft: theme.spacing(1)
    },
    touch: {
      color: theme.palette.grey['900']
    }
  })
)

interface Props {
  contact: IContact
}

export default function Catalog({ contact }: Props) {
  const classes = useStyles()

  return (
    <Box mt={3} mb={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar contact={contact} />
        <Typography variant="subtitle1" className={classes.title}>
          {contact.display_name}
          <Link
            color="secondary"
            href="#Details"
            variant="caption"
            className={classes.editButton}
          >
            Edit
          </Link>
        </Typography>
      </Box>
      <div className={classes.touch}>
        <LastTouched contact={contact} />
      </div>
    </Box>
  )
}
