import React, { ReactNode } from 'react'
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  createStyles,
  Grow,
  makeStyles,
  Paper,
  Popper,
  Theme,
  useTheme
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

interface RenderMenuProps {
  closeMenu: (event?: React.MouseEvent<any>) => void
}

interface Props {
  color?: 'inherit' | 'primary' | 'secondary' | 'default'
  children: ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  renderMenu: (props: RenderMenuProps) => ReactNode
  popperPlacement?: PopperPlacementType
  className?: string
  size?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
  variant?: 'contained' | 'outlined' | undefined
}

const useSplitButtonStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      icon: {
        fill: 'currentColor'
      },
      mainButton: {
        flex: 1
      }
    }),
  { name: 'SplitButton' }
)

export default function SplitButton(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const classes = useSplitButtonStyles(props)

  function handleToggle() {
    setIsOpen(prevOpen => !prevOpen)
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <>
      <ButtonGroup
        aria-label="split button"
        color={props.color}
        disabled={props.disabled}
        size={props.size}
        ref={anchorRef}
        style={props.style}
        className={props.className}
        variant={props.variant}
      >
        <Button onClick={props.onClick} className={classes.mainButton}>
          {props.children}
        </Button>
        <Button
          aria-owns={isOpen ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          size="small"
        >
          <IconKeyboardArrowDown className={classes.icon} />
        </Button>
      </ButtonGroup>
      <Popper
        anchorEl={anchorRef.current}
        open={isOpen}
        style={{ zIndex: theme.zIndex.modal }}
        placement={props.popperPlacement}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Paper id="menu-list-grow">
                {props.renderMenu({ closeMenu: handleClose })}
              </Paper>
            </ClickAwayListener>
          </Grow>
        )}
      </Popper>
    </>
  )
}
