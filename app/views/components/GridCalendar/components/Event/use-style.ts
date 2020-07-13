import { makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body3
    },
    general: {
      background: 'trasnparent',
      color: theme.palette.tertiary.dark,
      '& span[data-for="date"]': {
        marginRight: theme.spacing(0.5),
        color: theme.palette.grey[500]
      }
    },
    multiDay: {
      background: '#f2f2f2',
      color: theme.palette.tertiary.dark
    },
    celebration: {
      background: '#fce6fa',
      color: '#ff00cc'
    },
    deal: {
      background: '#f8f8ff',
      color: '#0945eb'
    }
  }),
  {
    name: 'GridCalendarEvent'
  }
)
export const usePopoverStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      minWidth: '415px'
    },
    body: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(3, 2.5)
    },
    icon: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      background: theme.palette.grey[200],
      textAlign: 'center',
      lineHeight: `${theme.spacing(6.5)}px`,
      borderRadius: '100%'
    },
    details: {
      paddingLeft: theme.spacing(1)
    },
    eventTitle: {
      display: 'block',
      ...theme.typography.body1
    },
    eventDate: {
      ...theme.typography.body2,
      color: theme.palette.grey[600]
    }
  }),
  {
    name: 'GridCalendarPopoverEvent'
  }
)
