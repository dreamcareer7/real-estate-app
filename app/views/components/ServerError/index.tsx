import * as React from 'react'
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'

import request, { ResponseError } from 'superagent'

import { ClassesProps } from 'utils/ts-utils'
import IconWarning from 'components/SvgIcons/Warning/IconWarning'

type ErrorResponse = ResponseError & { response?: request.Response }

interface Props {
  error?: ErrorResponse
  /**
   * Whether to show retry button or not. By default the retry button is
   * shown only when {@link Props#onRetry} is passed AND server error status
   * is 5xx with this rationale that retry doesn't make sense for 4xx errors
   * but may make sense for 5xx errors.
   * If true/false value is passed, it will override this default behavior
   */
  showRetry?: boolean | 'default'
  onRetry?: () => void
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2, 1)
    },
    icon: {
      'svg&': {
        width: '3rem',
        height: '3rem'
      }
    },
    errorMessage: {
      margin: theme.spacing(2, 0)
    }
  })

const useStyles = makeStyles(styles, { name: 'ServerError' })

export function ServerError({
  showRetry = 'default',
  error,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  let errorMessage = 'Something went wrong'

  if (error) {
    if (error.response && error.response.body && error.response.body.message) {
      errorMessage = error.response.body.message
    } else {
      errorMessage = error.message
    }
  }

  const retryButtonVisible =
    showRetry === 'default'
      ? error && error.response && `${error.response.status}`[0] === '5'
      : showRetry

  return (
    <div className={classes.root}>
      <IconWarning className={classes.icon} />
      <Typography variant="h6" className={classes.errorMessage}>
        {errorMessage}
      </Typography>
      {retryButtonVisible && (
        <Button variant="outlined" onClick={props.onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}