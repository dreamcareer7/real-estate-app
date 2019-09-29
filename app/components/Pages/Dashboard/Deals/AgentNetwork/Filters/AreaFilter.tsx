import React, { useState } from 'react'
import { TextFieldProps } from '@material-ui/core/TextField'
import {
  Box,
  Button,
  Radio,
  TextField,
  FormControlLabel
} from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Observable } from 'rxjs'
import { of } from 'rxjs/observable/of'

import { ChipsInput } from 'components/ChipsInput'

import { DEFAULT_RADIUS_FILTER } from '../constants'

import { useGetMlsArea } from './use-get-mls-areas'
import { useGetMlsSubArea } from './use-get-mls-sub-areas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    radiusInput: {
      width: 75
    },
    searchButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(2)
    },
    chipsInputContainer: {
      width: 300,
      marginLeft: theme.spacing(2)
    }
  })
)

export interface Filter {
  type: string
  radius?: number
  areas?: Array<Array<number>>
}

interface Props {
  disabled: boolean
  handleSearch: (filter: Filter) => void
}

export default function AreaFilter(props: Props) {
  const classes = useStyles()
  const { disabled } = props
  const parentAreas = useGetMlsArea()
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS_FILTER.radius)
  const [selectedParentAreas, setSelectedParentAreas] = useState<IMLSArea[]>([])
  const [selectedSubAreas, setSelectedSubAreas] = useState<IMLSArea[]>([])
  const [filterType, setFilterType] = useState<string>(
    DEFAULT_RADIUS_FILTER.type
  )
  const { subAreas, isLoadingSubAreas } = useGetMlsSubArea(
    selectedParentAreas.map(({ number }) => number)
  )

  const isFilterTypeRadius = filterType === 'radius'
  const isFilterTypeCustom = filterType === 'custom'

  const handleChangeType = event => {
    setFilterType(event.target.value)
  }

  const onChangeRadius = ({ target }) => {
    const { value } = target

    if (value && !/^\d+$/.test(value)) {
      return false
    }

    setRadius(Number(value))
  }

  const getSuggestions = (items: IMLSArea[]) => {
    const handler: (searchTerm: string) => Observable<IMLSArea[]> = (
      searchTerm: string
    ) =>
      searchTerm
        ? of(
            items.filter(item =>
              item.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
            )
          )
        : of([])

    return handler
  }

  const getFilteredAreas = () =>
    [
      ...selectedSubAreas,
      ...selectedParentAreas.filter(
        parentArea =>
          !selectedSubAreas.some(
            subArea => subArea.parent === parentArea.number
          )
      )
    ].map(area => [area.number, area.parent])

  const onSearch = () => {
    const filter: Filter = { type: filterType }

    if (filterType === 'radius') {
      filter.radius = radius
    } else {
      filter.areas = getFilteredAreas()
    }

    props.handleSearch(filter)
  }

  return (
    <Box px={3}>
      <Box mb={1}>Select a search area:</Box>
      <Box display="flex" alignItems="flex-start">
        <Box mr={2} display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Radio
                color="primary"
                checked={isFilterTypeRadius}
                disabled={disabled}
                onChange={handleChangeType}
                value="radius"
                name="search-area-type"
                inputProps={{ 'aria-label': 'search-by-radius' }}
              />
            }
            label="Radius"
          />
        </Box>
        {isFilterTypeRadius && (
          <Box display="flex" alignItems="flex-start">
            <TextField
              className={classes.radiusInput}
              disabled={disabled}
              hiddenLabel
              id="radius-input"
              margin="dense"
              onChange={onChangeRadius}
              value={radius}
              variant="filled"
            />
            <Box ml={2} mt={1.25}>
              Miles
            </Box>
            <Button
              disabled={disabled}
              color="primary"
              className={classes.searchButton}
              onClick={onSearch}
              size="small"
              variant="contained"
            >
              Search
            </Button>
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="flex-start">
        <Box display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Radio
                color="primary"
                checked={isFilterTypeCustom}
                disabled={disabled}
                onChange={handleChangeType}
                value="custom"
                name="search-area-type"
                inputProps={{ 'aria-label': 'search-by-area' }}
              />
            }
            label="Custom"
          />
        </Box>
        {isFilterTypeCustom && (
          <Box display="flex" alignItems="flex-start">
            <ChipsInput
              allowAddOnBlur={false}
              allowAddOnComma={false}
              allowAddOnEnter={false}
              items={selectedParentAreas}
              itemToChip={item => ({ label: item.title })}
              itemToSuggestion={({ title }) => ({ title })}
              onChange={setSelectedParentAreas}
              getSuggestions={getSuggestions(parentAreas)}
              classes={{ container: classes.chipsInputContainer }}
              TextFieldProps={
                {
                  disabled,
                  hiddenLabel: true,
                  margin: 'dense',
                  placeholder: 'Enter Area',
                  variant: 'filled'
                } as TextFieldProps
              }
            />
            <ChipsInput
              allowAddOnBlur={false}
              allowAddOnComma={false}
              allowAddOnEnter={false}
              items={selectedSubAreas}
              itemToChip={item => ({ label: `${item.title} #${item.number}` })}
              itemToSuggestion={item => ({
                title: `${item.title} #${item.number}`
              })}
              onChange={setSelectedSubAreas}
              getSuggestions={getSuggestions(subAreas)}
              classes={{ container: classes.chipsInputContainer }}
              TextFieldProps={
                {
                  disabled:
                    disabled ||
                    isLoadingSubAreas ||
                    selectedParentAreas.length === 0,
                  hiddenLabel: true,
                  margin: 'dense',
                  placeholder: 'Enter Sub-area',
                  variant: 'filled'
                } as TextFieldProps
              }
            />
            <Button
              disabled={
                disabled ||
                (selectedParentAreas.length === 0 &&
                  selectedSubAreas.length === 0)
              }
              color="primary"
              className={classes.searchButton}
              onClick={onSearch}
              size="small"
              variant="contained"
            >
              Search
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
