import { EventEmitter } from 'events'

import React, { useState, forwardRef, RefObject } from 'react'
import { ListOnItemsRenderedProps } from 'react-window'
import useResizeObserver from 'use-resize-observer'

import debounce from 'lodash/debounce'

import VirtualList, {
  LoadingPosition,
  VirtualListRef
} from 'components/VirtualList'

import { ListContext } from './context'

import { EventHeader } from './EventHeader'
import { Event } from './Event'
import { EmptyState } from './EmptyState'

import { EventController } from './EventController'
import { ActionController } from './ActionController'

import { Container } from './styled'

interface Props {
  user: IUser
  rows: ICalendarListRow[]
  isLoading: boolean
  loadingPosition: LoadingPosition
  listRef?: RefObject<VirtualListRef>
  onReachStart?(): void
  onReachEnd?(): void
  onChangeActiveDate(date: Date): void
  onCrmEventChange: (event: IEvent, type: string) => void
  onScheduledEmailChange: (
    event: ICalendarEvent,
    emailCampaign: IEmailCampaign
  ) => void
}

// creates a new event-emitter instance
const actions = new EventEmitter()

const defaultProps = {
  onReachStart: () => {},
  onReachEnd: () => {},
  onVisibleRowChange: () => {}
}

const CalendarList: React.FC<Props> = props => {
  const [containerRef, listWidth, listHeight] = useResizeObserver()
  const [activeDate, setActiveDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  )

  /**
   * triggers when an event updates or deletes
   * @param event - the event
   * @param type - type of action
   */
  const handleEventChange = (event: IEvent, type: string) => {
    props.onCrmEventChange(event, type)
    setSelectedEvent(null)
  }

  /**
   * triggers when an email campaign updates
   * @param event - the event
   * @param emailCampaign - the updated email camapign
   */
  const handleScheduledEmailChange = (emailCampaign: IEmailCampaign) => {
    props.onScheduledEmailChange(selectedEvent as ICalendarEvent, emailCampaign)
    setSelectedEvent(null)
  }

  /**
   * finds and the returns the first day header which is in view
   * @param data - list data, see [[ ListOnItemsRenderedProps ]]
   */
  const getInViewDate = (data: ListOnItemsRenderedProps) => {
    const index = new Array(data.visibleStopIndex - data.visibleStartIndex)
      .fill(null)
      .findIndex((_, index) =>
        props.rows[index + data.visibleStartIndex].hasOwnProperty(
          'isEventHeader'
        )
      )

    const item = props.rows[index + data.visibleStartIndex]

    if (!item) {
      return
    }

    const date = new Date(item.date)

    if (activeDate && date.getTime() === activeDate.getTime()) {
      return
    }

    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      setActiveDate(date)
      props.onChangeActiveDate(date)
    }
  }

  return (
    <ListContext.Provider
      value={{
        actions,
        selectedEvent,
        setSelectedEvent
      }}
    >
      <Container ref={containerRef}>
        {props.rows.length === 0 && !props.isLoading && <EmptyState />}

        <VirtualList
          width={listWidth}
          height={listHeight}
          itemCount={props.rows.length}
          onReachEnd={props.onReachEnd}
          onReachStart={props.onReachStart}
          threshold={2}
          isLoading={props.isLoading}
          loadingPosition={props.loadingPosition}
          onVisibleRowChange={debounce(getInViewDate, 50)}
          itemSize={index => getRowHeight(props.rows[index])}
          overscanCount={3}
          ref={props.listRef}
        >
          {({ index, style }) => (
            <>
              {props.rows[index].hasOwnProperty('isEventHeader') ? (
                <EventHeader
                  item={props.rows[index] as ICalendarEventHeader}
                  style={style}
                  activeDate={activeDate}
                />
              ) : (
                <Event
                  event={props.rows[index] as ICalendarEvent}
                  onEventChange={handleEventChange}
                  user={props.user}
                  nextItem={props.rows[index + 1]}
                  style={style}
                />
              )}
            </>
          )}
        </VirtualList>

        <EventController
          activeDate={activeDate}
          user={props.user}
          onEventChange={handleEventChange}
          onScheduledEmailChange={handleScheduledEmailChange}
        />

        <ActionController />
      </Container>
    </ListContext.Provider>
  )
}

function getRowHeight(row: ICalendarListRow): number {
  if (row.hasOwnProperty('isEventHeader')) {
    return 30
  }

  const event = row as ICalendarEvent

  return ['crm_task', 'crm_association'].includes(event.object_type) ||
    ['next_touch', 'day-empty-state'].includes(event.event_type)
    ? 72
    : 55
}

CalendarList.defaultProps = defaultProps

export default forwardRef((props: Props, ref: RefObject<VirtualListRef>) => (
  <CalendarList {...props} listRef={ref} />
))
