import { Button } from '@material-ui/core'
import TuneIcon from '@material-ui/icons/Tune'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import FilterButtonBadge from '@app/views/components/Filters/FilterButtonBadge'

import { useStyles } from '../styles'

import { filterGroupChangesCount } from './helpers'

const otherFiltersGroups: Partial<Record<keyof AlertFilters, string>> = {
  minimum_square_meters: 'square_meters',
  maximum_square_meters: 'square_meters',
  minimum_lot_square_meters: 'lot_square_meters',
  maximum_lot_square_meters: 'lot_square_meters',
  minimum_year_built: 'year_built',
  maximum_year_built: 'year_built',
  pool: 'pool',
  property_subtypes: 'property_subtypes',
  listing_statuses: 'status',
  open_house: 'open_house',
  architectural_styles: 'architectural_styles',
  school_districts: 'school_district',
  junior_high_schools: 'school_district',
  elementary_schools: 'school_district',
  high_schools: 'school_district',
  middle_schools: 'school_district',
  senior_high_schools: 'school_district',
  primary_schools: 'school_district',
  intermediate_schools: 'school_district',
  minimum_parking_spaces: 'parking_spaces',
  mls_areas: 'mls_areas',
  counties: 'mls_areas',
  subdivisions: 'subdivisions'
}

export const OtherButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<AlertFilters>) => {
  const classes = useStyles()

  // TODO: Memorize this function to avoid re-rendering
  const changedFiltersCount = filterGroupChangesCount(
    defaultFilters,
    filters,
    otherFiltersGroups
  )

  const isActive = changedFiltersCount > 0

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="medium"
      startIcon={<TuneIcon fontSize="small" />}
    >
      More Filters{' '}
      {isActive && <FilterButtonBadge value={changedFiltersCount} />}
    </Button>
  )
}
