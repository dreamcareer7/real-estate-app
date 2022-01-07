import { useState, useCallback, useRef } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { appSidenavWidth } from '@app/components/Pages/Dashboard/SideNav/variables'
import { useQueryParam } from '@app/hooks/use-query-param'
import { confirmation } from '@app/store_actions/confirmation'
import { setUserSetting } from '@app/store_actions/user/set-setting'
import { changeUrl } from '@app/utils/change-url'
import {
  GoogleMapLibrary,
  isMapLibrariesLoaded,
  loadMapLibraries
} from '@app/utils/google-map-api'

import { Map } from '../../../components/Map'
import CreateAlertModal from '../../../components/modals/CreateAlertModal'
import { Header } from '../../../components/PageHeader'
import { ShareListings } from '../../../components/ShareListings'
import Tabs from '../../../components/Tabs'
import { QUERY_LIMIT, bootstrapURLKeys, DEFAULT_VIEW } from '../../../constants'
import {
  changeListingHoverState,
  changeListingClickedState,
  clearListingUiStates
} from '../../../context/actions'
import useUiListingsContext from '../../../context/useUiListingsContext'
import { createValertOptions } from '../../../helpers/get-listings-helpers'
import {
  coordToPoint,
  estimateMapZoom,
  getPlaceZoomOffset
} from '../../../helpers/map-helpers'
import {
  LAST_BROWSING_LOCATION,
  parseSortIndex,
  SORT_FIELD_SETTING_KEY
} from '../../../helpers/sort-utils'
import { SortString, ViewType } from '../../../types'
import {
  setMapDrawing,
  removeMapDrawing,
  setMapBounds,
  setMapLocation,
  changeSort,
  removePinMarker
} from '../../context/actions'
import useListingsContext from '../../hooks/useListingsContext'
import Autocomplete from '../Autocomplete'
import { Filters } from '../Filters'
import { Results } from '../Results'
import { SaveSearchButton } from '../SaveSearchButton'

const useStyles = makeStyles(
  theme => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    searchBar: {
      paddingBottom: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    searchBarSearchItem: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    searchBarFilterItem: {
      display: 'flex',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: 'auto',
      alignItems: 'center'
    },
    main: {
      flexGrow: 1,
      display: 'flex',
      overflow: 'hidden'
    },
    map: {
      flex: 1,
      minHeight: '100%',
      marginRight: theme.spacing(2),
      position: 'relative'
    },
    hidden: {
      display: 'none'
    },
    mapCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden'
    },
    mapToggler: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: '#fff',
      padding: theme.spacing(1, 2),
      borderRadius: theme.shape.borderRadius,
      zIndex: 3
    },
    results: {
      flex: 1,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    selectionActionBar: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      zIndex: theme.zIndex.modal - 3,
      width: `calc(100% - ${appSidenavWidth}px)`
    }
  }),
  { name: 'PropertiesExplorePage' }
)

// Add initialize to window type to avoid TS error on google map callback
declare const window: Window &
  typeof globalThis & {
    initialize: () => void
  }

interface Props {
  user: IUser
  isWidget: boolean
  onClickLocate: () => void
}

export function ExplorePage({ user, isWidget, onClickLocate }: Props) {
  const [state, dispatch] = useListingsContext()
  const [, uiDispatch] = useUiListingsContext()

  const [viewQueryParam] = useQueryParam('view')
  const classes = useStyles()

  const reduxDispatch = useDispatch()
  const mapRef = useRef<google.maps.Map>()
  const [mapIsShown, setMapIsShown] = useState(true)
  const [mapIsInitialized, setMapIsInitialized] = useState(false)
  const [isShowAlertModal, setIsShowAlertModal] = useState(false)
  const [viewType, setViewType] = useState<ViewType>(
    (viewQueryParam as ViewType) || DEFAULT_VIEW
  )

  const onChangeSort = (sort: SortString) => {
    dispatch(changeSort(parseSortIndex(sort)))
    reduxDispatch(setUserSetting(SORT_FIELD_SETTING_KEY, sort))
  }

  const onToggleView = (to: ViewType) => {
    setViewType(to)
  }

  const onRemoveDrawing = useCallback(() => {
    dispatch(removeMapDrawing())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDrawingComplete = useCallback((points: ICoord[]) => {
    dispatch(setMapDrawing(points))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMapShown = useCallback(() => {
    uiDispatch(clearListingUiStates())
    setMapIsShown(mapIsShown => !mapIsShown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelectPlace = (
    center: ICoord,
    bounds: ICompactBounds,
    types: string[]
  ) => {
    const mapWidth = mapRef.current
      ? mapRef.current.getDiv().clientWidth
      : undefined
    const mapHeight = mapRef.current
      ? mapRef.current.getDiv().clientHeight
      : undefined

    const zoomOffset = getPlaceZoomOffset(types)
    const zoom = estimateMapZoom(bounds, zoomOffset, mapWidth, mapHeight)

    if (viewType === DEFAULT_VIEW) {
      dispatch(setMapLocation(center, zoom, true))
    } else {
      dispatch(setMapBounds(center, zoom, bounds))
    }

    /*
    Remove fitBounds approach to manually set map zoom on specific place types
    https://gitlab.com/rechat/web/-/issues/5723

    if (mapRef.current) {
      const cornerBounds = new window.google.maps.LatLngBounds()

      cornerBounds.extend(new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng))
      cornerBounds.extend(new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng))

      mapRef.current.fitBounds(cornerBounds)
    }
    */
  }

  useEffectOnce(() => {
    window.initialize = initialize

    const googleMapAPIParams = {
      key: bootstrapURLKeys.key,
      libraries: bootstrapURLKeys.libraries.split(',') as GoogleMapLibrary[],
      callback: 'initialize'
    }

    if (isMapLibrariesLoaded(googleMapAPIParams.libraries)) {
      initialize()
    } else {
      loadMapLibraries(googleMapAPIParams)
    }
  })

  const initialize = () => {
    setMapIsInitialized(true)
  }

  const onMapChange = useCallback(
    (center: ICoord, zoom: number, bounds: IBounds) => {
      dispatch(setMapBounds(center, zoom, bounds))

      // Anonymous user's can also see /mls and explore the map
      // So updatingLastBrowsing location should not be run for them
      if (user) {
        reduxDispatch(setUserSetting(LAST_BROWSING_LOCATION, { center, zoom }))
      }
    },
    [dispatch, user, reduxDispatch]
  )

  const handleSaveSearch = () => {
    if (state.result.info && state.result.info.total < 400) {
      setIsShowAlertModal(true)
    } else {
      reduxDispatch(
        confirmation({
          confirmLabel: 'Ok',
          description:
            'Please zoom in or set more filters. You can save max 400 listings.',
          hideCancelButton: true,
          message: 'Too many matches!'
        })
      )
    }
  }

  const onCloseAlertModal = () => {
    setIsShowAlertModal(false)
  }

  const changeHoverState = useCallback((id: UUID, hover: boolean) => {
    uiDispatch(changeListingHoverState(hover ? id : null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onStartDrawingMode = useCallback(() => {
    uiDispatch(clearListingUiStates())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onToggleListingModal = useCallback(
    (id: UUID, isOpen: boolean) => {
      if (!isWidget) {
        if (isOpen) {
          changeUrl(`/dashboard/mls/${id}`)
        } else {
          // Inject view param to url
          const viewQueryParam =
            viewType !== DEFAULT_VIEW ? { view: viewType } : {}

          changeUrl('/dashboard/mls', viewQueryParam)
        }
      }
    },
    [isWidget, viewType]
  )

  const onMarkerClick = useCallback((key: UUID) => {
    const resultElement = document.getElementById(key)

    if (resultElement) {
      // Smooth scrolling doesn't work on Chrome for some reason
      resultElement.scrollIntoView({ behavior: 'smooth' })
    }

    uiDispatch(changeListingClickedState(key))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMapClick = useCallback(() => {
    uiDispatch(changeListingClickedState(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClearSearchbox = () => {
    dispatch(removePinMarker())
  }

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  return (
    <>
      <Grid className={classes.container}>
        {!isWidget && (
          <>
            <Header title="Properties" />
            <Tabs user={user} isWidget={isWidget} />
          </>
        )}
        <Grid className={classes.searchBar}>
          <Grid className={classes.searchBarSearchItem}>
            <Autocomplete
              isMapView={mapIsShown}
              onSelectPlace={onSelectPlace}
              onClear={onClearSearchbox}
            />
          </Grid>
          <Grid className={classes.searchBarFilterItem}>
            <Filters />
            <SaveSearchButton
              isLoading={state.isLoading}
              onClick={handleSaveSearch}
            />
          </Grid>
        </Grid>

        <Grid container className={classes.main}>
          {mapIsInitialized && mapIsShown && (
            <Grid
              item
              className={cn({
                [classes.map]: true,
                [classes.hidden]: !mapIsShown
              })}
            >
              <Grid className={classes.mapCanvas}>
                <Map
                  isWidget={isWidget}
                  hasDrawingMode={!state.search.filters.postal_codes}
                  pin={state.pinMarker}
                  drawing={state.search.drawing}
                  onStartDrawingMode={onStartDrawingMode}
                  onDrawingComplete={onDrawingComplete}
                  onRemoveDrawing={onRemoveDrawing}
                  onChange={onMapChange}
                  mapIsShown={mapIsShown}
                  onClickLocate={onClickLocate}
                  onClickToggleMap={toggleMapShown}
                  onChangeHoverState={changeHoverState}
                  onToggleListingModal={onToggleListingModal}
                  onMarkerClick={onMarkerClick}
                  onMapClick={onMapClick}
                  mapPosition={state.map}
                  listings={state.result.listings}
                  onMapLoad={onMapLoad}
                />
              </Grid>
            </Grid>
          )}
          <Grid item className={classes.results}>
            <Results
              mapIsShown={mapIsShown}
              onMapToggle={toggleMapShown}
              viewType={viewType}
              onChangeSort={onChangeSort}
              activeSort={state.search.sort}
              onToggleView={onToggleView}
              isWidget={isWidget}
              onToggleListingModal={onToggleListingModal}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.selectionActionBar}>
        <ShareListings />
      </Grid>
      <CreateAlertModal
        user={user}
        onHide={onCloseAlertModal}
        isActive={isShowAlertModal}
        alertProposedTitle={state.result.info?.proposed_title}
        searchOptions={createValertOptions(state.search, QUERY_LIMIT)}
        drawingPoints={state.search.drawing.map(coordToPoint)}
      />
    </>
  )
}
