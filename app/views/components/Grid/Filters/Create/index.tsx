import { useState } from 'react'

import {
  Popover,
  Button,
  Theme,
  List,
  ListItem,
  makeStyles
} from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import Search from '@app/views/components/Grid/Search'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { FilterItemTooltip } from './tooltip'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1),
      width: '300px',
      maxHeight: '330px',
      overflowY: 'auto'
    }
  }),
  {
    name: 'ContactAddFilter'
  }
)

export function AddFilter({ disabled, config, onNewFilter }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)

  const isOpen = Boolean(anchorEl)
  const id = isOpen ? 'contact-add-filter' : undefined

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      return false
    }

    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const onSelectFilter = item => {
    console.log('onSelectFilter', { item })
    handleClose()

    onNewFilter({
      id: item.id
    })
  }

  return (
    <>
      <Button
        color="secondary"
        size="small"
        data-test="add-filter"
        onClick={handleOpen}
        disabled={disabled}
        startIcon={<SvgIcon path={mdiPlus} />}
      >
        Add Filter
      </Button>
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <div className={classes.container}>
          <Search
            autoFocus
            placeholder="Search Filters"
            onChange={value => {
              console.log({ value })
            }}
          />
          <List>
            {config.map((item, index) => (
              <FilterItemTooltip key={index} item={item}>
                <ListItem
                  button
                  data-test={`add-filter-item-${item.label}`}
                  onClick={() => onSelectFilter(item)}
                >
                  {item.label}
                </ListItem>
              </FilterItemTooltip>
            ))}
          </List>
        </div>
      </Popover>
    </>
  )
}
