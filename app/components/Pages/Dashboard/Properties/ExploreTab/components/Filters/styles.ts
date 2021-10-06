import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  theme => ({
    button: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0, 0.5)
    },
    resetButton: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0, 1, 0, 1.5)
    },
    filterButton: {
      minWidth: 170
    },
    editorRoot: {
      width: 420,
      padding: theme.spacing(2)
    },
    header: {
      marginBottom: theme.spacing(2)
    },
    title: {
      paddingLeft: theme.spacing(1)
    },
    switchControlLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
      width: '100%',
      margin: 0
    },
    switchControlButton: {
      '& > .MuiSwitch-switchBase': {
        color: '#fff'
      },
      '& > .MuiSwitch-colorPrimary.Mui-checked': {
        color: theme.palette.primary.main
      }
    },
    editorGroup: {
      marginBottom: theme.spacing(2)
    },
    subheader: {
      fontSize: 14,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    subtitle: {
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.fontWeightBold
    },
    footer: {
      paddingTop: theme.spacing(1)
    },
    footerResetButton: {
      textAlign: 'left',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
      '&:hover, &:focus': {
        backgroundColor: 'transparent'
      }
    },
    ToggleButtonGroup: { width: '100%' },
    ToggleButton: {
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }
    },
    fullToggleButton: {
      flex: 1,
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }
    },
    filledAutoCompleteWrapper: {
      flex: 1
    },
    to: {
      textAlign: 'center',
      padding: theme.spacing(2)
    },
    switchIcon: {
      fontSize: 14,
      marginRight: theme.spacing(0.5)
    },
    select: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    subStatusGroup: {
      marginLeft: theme.spacing(3)
    }
  }),
  { name: 'PropertiesFilters' }
)
