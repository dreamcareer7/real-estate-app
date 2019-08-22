import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  RefObject,
  ComponentProps,
  useImperativeHandle,
  useCallback
} from 'react'

import { connect } from 'react-redux'

import useDebouncedCallback from 'use-debounce/lib/callback'

import usePrevious from 'react-use/lib/usePrevious'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IAppState } from 'reducers'

import {
  viewAs,
  getTeamAvailableMembers,
  getActiveTeam
} from 'utils/user-teams'

import { LoadingPosition, VirtualListRef } from 'components/VirtualList'

import { CalendarRef, ApiOptions, FetchOptions } from './types'

import { getCalendar } from './models/get-calendar'

import { getDateRange, Format } from './helpers/get-date-range'
import { createListRows } from './helpers/create-list-rows'
import { upsertCrmEvents } from './helpers/upsert-crm-events'
import { updateEmailCampaign } from './helpers/update-email-campaign'
import { normalizeEvents } from './helpers/normalize-events'
import { sortEvents } from './helpers/sort-events'
import { getRowIdByDate } from './helpers/get-row-by-date'
import { appendDayToEvents } from './helpers/append-day-to-events'

import List from './components/List'

interface Props {
  viewAsUsers?: UUID[]
  filter?: object
  calendarRef?: RefObject<CalendarRef>
  user?: IUser
  onChangeActiveDate?: (activeDate: Date) => void
  onLoadEvents?: (events: CalendarEventsList, range: NumberRange) => void
}

interface StateProps {
  viewAsUsers: UUID[]
  user: IUser
}

export function Calendar({
  calendarRef,
  viewAsUsers,
  filter = {},
  user,
  onLoadEvents = () => null,
  onChangeActiveDate = () => null
}: Props) {
  const previousProps = usePrevious<Partial<Props>>({ viewAsUsers, filter })

  // reference to the Virtual List
  const listRef = useRef<VirtualListRef>(null)

  // fetches events so far
  const [events, setEvents] = useState<CalendarEventsList>({})

  // rows of Virtual List
  const [listRows, setListRows] = useState<ICalendarListRow[]>([])

  // check whether api is loading events or not
  const [isLoading, setIsLoading] = useState(false)

  // current loading position of calendar
  const [loadingPosition, setLoadingPosition] = useState<LoadingPosition>(
    LoadingPosition.Middle
  )

  // current active date
  const [activeDate, setActiveDate] = useState<Date>(new Date())

  // current range of fetched calendar
  const [calendarRange, setCalendarRange] = useState<NumberRange>(
    getDateRange()
  )

  // create a debounced function for setActiveDate
  const [debouncedSetActiveDate] = useDebouncedCallback(setActiveDate, 500)

  /**
   * fetches events based on the given [[ApiOptions]]
   * @param apiOptions - the api options
   * @param options - fetching options
   */
  const fetchEvents = useCallback(
    async (apiOptions: ApiOptions, options: FetchOptions = {}) => {
      try {
        if (isLoading) {
          return
        }

        // enable loading flag
        setIsLoading(true)

        console.log(
          `[ + ] Fetching Calendar with range of %c${new Date(
            apiOptions.range[0] * 1000
          ).toUTCString()} %c${new Date(
            apiOptions.range[1] * 1000
          ).toUTCString()}`,
          'color: green',
          'color: blue'
        )

        // fetch calendar data from server based on given parameters
        const fetchedEvents = await getCalendar({
          users: viewAsUsers,
          filter,
          ...apiOptions
        })

        // concat new events and existing events
        const nextEvents = options.reset
          ? normalizeEvents(apiOptions.range, fetchedEvents, activeDate)
          : {
              ...events,
              ...normalizeEvents(apiOptions.range, fetchedEvents, activeDate)
            }

        // sort events based on date
        const sortedEvents = sortEvents(nextEvents)

        // update events list
        setEvents(sortedEvents)

        // updates virtual list rows
        setListRows(createListRows(sortedEvents))

        onLoadEvents(sortedEvents, apiOptions.range)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [activeDate, events, filter, isLoading, onLoadEvents, viewAsUsers]
  )

  /**
   * triggers when active date changes in virtual list
   */
  const handleChangeActiveDate = useCallback(
    (date: Date) => {
      debouncedSetActiveDate(date)
      onChangeActiveDate(date)
    },
    [debouncedSetActiveDate, onChangeActiveDate]
  )

  /**
   * jumps to the given date.
   * @param date
   */
  const jumpToDate = (date: Date, allowSeeking: boolean = true): void => {
    let rowId = getRowIdByDate(date, listRows, events, calendarRange)

    if (rowId === -1) {
      // try to jump to the date by fetching more data from server
      allowSeeking && handleLoadEvents(date)

      return
    }

    /**
     * https://gitlab.com/rechat/web/issues/3171
     * if user selects a day on left side calendar that has no events,
     * show the day on the right side, under it put No events, make one
     * and make, make one to be in our blue link color and tapping on it
     * should open the event dialog with the day set on it
     */
    if (rowId === null) {
      const nextEvents = appendDayToEvents(date, events)
      const nextRows = createListRows(nextEvents)

      setEvents(nextEvents)
      setActiveDate(date)

      setListRows(nextRows)

      return
    }

    listRef.current!.scrollToItem(rowId, 'start')

    // change active date
    handleChangeActiveDate(new Date(listRows[rowId].date))
  }

  /**
   * handles updating ranges when given date is outside of current
   * calendar range
   * @param date
   */
  const handleLoadEvents = async (date: Date = activeDate) => {
    const query: NumberRange = getDateRange(date.getTime(), Format.Middle)

    // set loading position to center again
    setLoadingPosition(LoadingPosition.Middle)

    // reset calendar range
    setCalendarRange(query)

    // set active date
    setActiveDate(date)

    await fetchEvents(
      {
        range: query
      },
      {
        reset: true
      }
    )
  }

  /**
   * handles updating ranges when user is trying to fetch future events
   */
  const handleLoadNextEvents = useCallback((): void => {
    if (isLoading) {
      return
    }

    // new range will be from end range of current calendar till next range
    const query: NumberRange = getDateRange(
      calendarRange[1] * 1000,
      Format.Next
    )

    // new range will be from start of calendar until end of new query range
    setCalendarRange([calendarRange[0], query[1]])

    // the loading indicator will be shown at the bottom of list
    setLoadingPosition(LoadingPosition.Bottom)

    fetchEvents({
      range: query
    })
  }, [calendarRange, fetchEvents, isLoading])

  /**
   * handles updating ranges when user is trying to fetch past events
   */
  const handleLoadPreviousEvents = useCallback((): void => {
    if (isLoading) {
      return
    }

    // new range will be from start range of current calendar
    const query: NumberRange = getDateRange(
      calendarRange[0] * 1000,
      Format.Previous
    )

    // new range will be from start of new range until end of new calendar range
    setCalendarRange([query[0], calendarRange[1]])

    // the loading indicator will be shown at the top of list
    setLoadingPosition(LoadingPosition.Top)

    fetchEvents({
      range: query
    })
  }, [calendarRange, fetchEvents, isLoading])

  /**
   * triggers when a crm events update or delete
   */
  const handleCrmEventChange = useCallback(
    (event: IEvent, type: string) => {
      const nextEvents = upsertCrmEvents(
        events,
        event,
        type
      ) as CalendarEventsList

      setEvents(nextEvents)
      setListRows(createListRows(nextEvents))
    },
    [events]
  )

  /**
   * triggers when an email campaign updates
   */
  const handleScheduledEmailChange = useCallback(
    (event: ICalendarEvent, emailCampaign: IEmailCampaign) => {
      const nextEvents = updateEmailCampaign(
        events,
        event,
        emailCampaign
      ) as CalendarEventsList

      setEvents(nextEvents)
      setListRows(createListRows(nextEvents))
    },
    [events]
  )

  /**
   * behaves as componentDidMount
   */
  useEffectOnce(() => {
    handleLoadEvents(activeDate)
  })

  /**
   * calls when viewAsUsers prop changes
   */
  useEffect(() => {
    if (
      previousProps &&
      previousProps.viewAsUsers!.join('') !== viewAsUsers!.join()
    ) {
      handleLoadEvents(activeDate)
    }
    // eslint-disable-next-line
  }, [viewAsUsers])

  /**
   * calls when filter prop changes
   */
  useEffect(() => {
    if (
      previousProps &&
      JSON.stringify(previousProps.filter) !== JSON.stringify(filter)
    ) {
      handleLoadEvents(activeDate)
    }
    // eslint-disable-next-line
  }, [filter])

  /**
   * calls when listRows changes
   */
  useEffect(() => {
    jumpToDate(activeDate, false)

    /*
     * VariableSizeList caches offsets and measurements for each index
     * for performance purposes. This method clears that cached data for
     * all items after (and including) the specified index. It should
     * be called whenever a item's size changes
     * for calendar, this is necessary because height of rows aren't equal and
     * also it's loading the data bidirectionally
     */
    listRef.current!.resetAfterIndex(0)

    // eslint-disable-next-line
  }, [listRows])

  /**
   * exposes below methods to be accessible outside of the component
   */
  useImperativeHandle(calendarRef, () => ({
    jumpToDate,
    refresh: handleLoadEvents,
    updateCrmEvents: handleCrmEventChange
  }))

  return (
    <List
      ref={listRef}
      rows={listRows}
      user={user as IUser}
      isLoading={isLoading}
      loadingPosition={loadingPosition}
      onReachEnd={handleLoadNextEvents}
      onReachStart={handleLoadPreviousEvents}
      onChangeActiveDate={handleChangeActiveDate}
      onCrmEventChange={handleCrmEventChange}
      onScheduledEmailChange={handleScheduledEmailChange}
    />
  )
}

function mapStateToProps({ user }: IAppState) {
  const teamMembers = getTeamAvailableMembers(getActiveTeam(user))
  const viewAsUsers = viewAs(user)

  return {
    user,
    viewAsUsers: viewAsUsers.length === teamMembers.length ? [] : viewAsUsers
  }
}

const ConnectedCalendar = connect<StateProps, {}, Props>(mapStateToProps)(
  Calendar
)

export default forwardRef(
  (
    props: ComponentProps<typeof ConnectedCalendar>,
    ref: RefObject<CalendarRef>
  ) => <ConnectedCalendar {...props} calendarRef={ref} />
)
