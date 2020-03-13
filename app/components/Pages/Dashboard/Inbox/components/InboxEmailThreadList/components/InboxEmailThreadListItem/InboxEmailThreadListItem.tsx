import React, { useMemo } from 'react'
import { Paper, Grid, Typography, Box } from '@material-ui/core'
import fecha from 'fecha'
import { uniq } from 'underscore'
import classNames from 'classnames'

import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { useInboxEmailThreadListItemStyles } from './styles'

interface Props {
  emailThread: IEmailThread<'contacts'>
  selected?: boolean
}

export default function InboxEmailThreadListItem({
  emailThread,
  selected
}: Props) {
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const recipients = useMemo(
    () =>
      (emailThread.recipients_raw || [])
        .map(({ name, address }, index, all) => {
          const nameNotAddress = name === address ? '' : name
          const relatedContacts = emailThread.contacts
            ? emailThread.contacts
                .filter(c => c.email === address)
                .concat(
                  emailThread.contacts.filter(
                    c => c.emails && c.emails.includes(address)
                  )
                )
            : []
          const allRelatedAddresses = uniq(
            relatedContacts
              .flatMap(({ email, emails }) =>
                emails ? [email, ...emails] : [email]
              )
              .concat(address)
          )
          const me = allRelatedAddresses.includes(user.email)
          const displayName =
            (all.length > 1 &&
              relatedContacts
                .map(({ first_name }) => first_name)
                .filter(
                  name => name && !allRelatedAddresses.includes(name)
                )[0]) ||
            relatedContacts
              .map(({ display_name }) => display_name)
              .filter(name => name && !allRelatedAddresses.includes(name))[0] ||
            nameNotAddress

          return me ? 'Me' : displayName || address
        })
        .join(', '),
    [user, emailThread]
  )

  const messageDate = new Date(emailThread.last_message_date * 1000)
  const messageDateText = fecha.format(messageDate, 'MMMM D, YYYY - h:mm A')
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const messageDateShortText = fecha.format(
    messageDate,
    messageDate < today ? 'D\u00A0MMM' : 'h:mm\u00A0A'
  )

  const classes = useInboxEmailThreadListItemStyles()

  return (
    <Paper
      elevation={0}
      square
      classes={{
        root: classNames(classes.root, selected && classes.selected)
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <div
            className={classNames(
              classes.status,
              !emailThread.is_read && classes.unread
            )}
          />
        </Grid>
        <Grid item xs container spacing={0} classes={{ root: classes.info }}>
          <Grid item xs={12} className={classes.flex}>
            <Typography
              variant="subtitle2"
              display="inline"
              title={recipients}
              classes={{
                root: classNames(
                  classes.infoText,
                  classes.oneLineEllipsis,
                  !emailThread.is_read && classes.bold
                )
              }}
            >
              {recipients}
            </Typography>
            {emailThread.message_count > 1 && (
              <Typography
                variant="subtitle2"
                display="inline"
                classes={{ root: classNames(classes.infoText) }}
              >
                &nbsp;({emailThread.message_count})
              </Typography>
            )}
            <div className={classes.grow} />
            <Typography
              variant="caption"
              display="inline"
              title={messageDateText}
              classes={{ root: classes.infoText }}
            >
              &nbsp;&nbsp;{messageDateShortText}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box paddingTop="4px">
              <Typography
                variant="subtitle2"
                title={emailThread.subject || undefined}
                classes={{
                  root: classNames(
                    classes.infoText,
                    classes.oneLineEllipsis,
                    classes.bold
                  )
                }}
              >
                {emailThread.subject || '(No Subject)'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              classes={{
                root: classNames(classes.infoText, classes.message)
              }}
            >
              {emailThread.snippet}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}