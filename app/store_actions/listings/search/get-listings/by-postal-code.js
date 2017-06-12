import getListingsByValert from './by-valert'
import { queryOptions } from
  '../../../../components/Pages/Dashboard/Mls/Partials/MlsMapOptions'

const QUERY_LIMIT = 50

const getOptions = (postalCode) => {
  const _options = {
    points: null,
    counties: null,
    mls_areas: null,
    school_districts: null,
    postal_codes: [postalCode]
  }

  return {
    ...queryOptions,
    ..._options,
    limit: QUERY_LIMIT
  }
}

const getListingsByPostalCode = postalCode => (dispatch, getState) =>
  getListingsByValert(getOptions(postalCode))(dispatch, getState)

export default getListingsByPostalCode