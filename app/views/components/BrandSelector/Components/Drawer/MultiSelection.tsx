import { useState } from 'react'

import { Button, Checkbox, FormControlLabel } from '@material-ui/core'

import Drawer from '@app/views/components/OverlayDrawer'

import { BaseBrandSelector } from '../Base'

import { useStyles } from './styles'
import { MultiSelectionBrandSelectorDrawer as Props } from './type'

export function MultiSelectionBrandSelectorDrawer({
  drawerTitle = 'Select Agents',
  saveButtonText = 'Save',
  brandSelectorProps = {},
  selectedBrands: currentBrands = [],
  onSave,
  ...props
}: Props) {
  const classes = useStyles()
  const [selectedBrands, setSelectedBrands] = useState<UUID[]>(currentBrands)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleClick = async () => {
    setIsSaving(true)

    try {
      await onSave(selectedBrands)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }
  const handleOnNodeClick = (brandId: UUID) => {
    setSelectedBrands(state => {
      if (state.includes(brandId)) {
        return state.filter(id => id !== brandId)
      }

      return [...state, brandId]
    })
  }
  const nodeRenderer = ({ brand }) => {
    const isSelected = selectedBrands.includes(brand.id)

    return (
      <FormControlLabel
        control={<Checkbox size="small" />}
        checked={isSelected}
        onChange={() => handleOnNodeClick(brand.id)}
        label={brand.name}
      />
    )
  }

  return (
    <>
      <Drawer {...props}>
        <Drawer.Header title={drawerTitle} />
        <Drawer.Body>
          <div className={classes.container}>
            <BaseBrandSelector
              {...brandSelectorProps}
              nodeRenderer={nodeRenderer}
            />
          </div>
        </Drawer.Body>
        <Drawer.Footer rowReverse>
          <Button
            variant="contained"
            color="primary"
            disabled={isSaving || selectedBrands.length === 0}
            onClick={handleClick}
          >
            {isSaving ? 'Saving...' : saveButtonText}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}
