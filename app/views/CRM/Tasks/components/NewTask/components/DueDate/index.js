import React from 'react'

import DateTimeField from '../DateTimeField'
import { getTime } from '../../../../../../../utils/get-time'
import { getTimes } from '../../../../../../../utils/get-times'
import { getTodayDate } from '../../helpers/get-today-date'

const today = getTodayDate()

const tomorrow = today + 24 * 60 * 60 * 1000

const DATE_ITEMS = [
  {
    title: 'Today',
    value: today
  },
  {
    title: 'Tomorrow',
    value: tomorrow
  },
  {
    title: 'Custom Date',
    value: tomorrow,
    needsDatePicker: true
  }
]

export default function DueDate({ selectedDate }) {
  const timeItems = getTimes().filter(
    time =>
      selectedDate.value !== today || time.value > getTime(new Date() || time)
  )

  return (
    <DateTimeField
      name="due"
      isRequired
      id="due-date"
      title="Due Date"
      timeItems={timeItems}
      dateItems={DATE_ITEMS}
      selectedDate={selectedDate}
      defaultSelectedDate={DATE_ITEMS[1]}
      datePickerModifiers={{
        disabled: {
          before: new Date()
        }
      }}
    />
  )
}
