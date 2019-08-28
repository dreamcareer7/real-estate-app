import fecha from 'fecha'

import { createDayId } from '../create-day-id'

import eventEmptyState from '../get-event-empty-state'

export function createListRows(
  events: ICalendarEventsList,
  activeDate: Date
): ICalendarListRow[] {
  const activeDayId = createDayId(activeDate, false)

  return Object.entries(events).flatMap(([month, daysOfMonth]) => {
    if (getIsEmptyMonth(month, daysOfMonth, activeDate)) {
      return [
        {
          is_event_header: true,
          header_type: 'month-header',
          is_today: false,
          title: `01-${getLastDayOfMonth(daysOfMonth)}`,
          date: month
        },
        {
          ...eventEmptyState,
          type: 'month'
        }
      ]
    }

    return getMonthEvents(daysOfMonth, activeDayId)
  })
}

/**
 * returns month's events
 * @param days
 */
function getMonthEvents(days: ICalendarMonthEvents, activeDayId: string) {
  const today = fecha.format(new Date(), 'YYYY-MM-DD')

  return Object.entries(days)
    .filter(([day, events]) => {
      if (events.length > 0) {
        return true
      }

      return isToday(day) || day === activeDayId
    })
    .flatMap(([day, events]) => {
      return [
        {
          is_event_header: true,
          header_type: 'day-header',
          is_today: fecha.format(new Date(day), 'YYYY-MM-DD') === today,
          title: fecha.format(new Date(day), 'DD'),
          date: day
        },
        ...(events.length > 0
          ? events
          : [
              {
                ...eventEmptyState,
                type: 'day'
              }
            ])
      ]
    })
}

/**
 * checks the given day is equal to today or not
 * @param day
 */
function isToday(day: string): boolean {
  const now = new Date()

  return createDayId(now, false) === day
}

/**
 * returns last day of given month
 * @param days
 */
function getLastDayOfMonth(days: ICalendarMonthEvents) {
  const daysOfMonth = Object.keys(days)

  return new Date(daysOfMonth[daysOfMonth.length - 1]).getDate()
}

/**
 * checks the given month has any event or not
 * @param month
 * @param days
 * @param activeDate
 */
function getIsEmptyMonth(
  month: string,
  days: ICalendarMonthEvents,
  activeDate: Date
) {
  const date = new Date(month)

  if (
    activeDate.getFullYear() === date.getFullYear() &&
    activeDate.getMonth() === date.getMonth()
  ) {
    return false
  }

  return Object.values(days).every(events => events.length === 0)
}
