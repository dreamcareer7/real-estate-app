import { Badge, withStyles, Theme } from '@material-ui/core'

export const MenuBadge = withStyles((theme: Theme) => ({
  root: {
    width: '100%',
    alignItems: 'center'
  },
  anchorOriginTopRightRectangle: {
    top: theme.spacing(-1.25),
    right: 0,
    left: 'auto',
    padding: theme.spacing(0, 0.5),
    transform: 'scale(1) translateY(50%)',
    borderRadius: theme.shape.borderRadius
  }
}))(Badge)
