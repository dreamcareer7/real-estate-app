import React, { useState, useMemo } from 'react'

import { isLeapYear, getDaysInMonth } from 'date-fns'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { BasicDropdown } from 'components/BasicDropdown'
import Button from 'components/Button/ActionButton'
import { addZero, months } from 'utils/date-times'

import { Input } from './styled'

export function DateField(props) {
  const [day, setDay] = useState(props.day || { label: 'Day', value: null })
  const [month, setMonth] = useState(
    props.month || { label: 'Month', value: null }
  )
  const [year, setYear] = useState(props.year || '')

  const daysItems = useMemo(() => {
    const selectedMonth = month.value ? parseInt(month.value, 10) + 1 : 0
    const selectedYear = year ? parseInt(year, 10) : 1800
    const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth, 0))

    const days = [...Array(daysInMonth).keys()].map(day => day + 1)

    return days.map(day => ({
      label: addZero(day),
      value: day
    }))
  }, [month.value, year])
  const monthsItems = useMemo(
    () =>
      months.map((month, index) => ({
        label: month,
        value: index
      })),
    []
  )

  const onChangeDay = selectedDay => {
    setDay(selectedDay)
    props.onChangeDay(selectedDay)
  }

  const onChangeMonth = selectedMonth => {
    setMonth(selectedMonth)
    props.onChangeMonth(selectedMonth)

    if (selectedMonth.value === 1 && day.value >= 29) {
      if (day.value === 29 && year && isLeapYear(new Date(year))) {
        return
      }

      const alteredDay = { label: '28', value: 28 }

      setDay(alteredDay)
      props.onChangeDay(alteredDay)
    }
  }

  const onChangeYear = event => {
    const { value } = event.target

    if (!value || /^\d+$/.test(value)) {
      if (
        value.length >= 4 &&
        !isLeapYear(new Date(value)) &&
        day.value === 29
      ) {
        const alteredDay = { label: '28', value: 28 }

        setDay(alteredDay)
        props.onChangeDay(alteredDay)
      }

      setYear(value)
      props.onChangeYear(value)
    }
  }

  return (
    <Flex data-test="date-field">
      <BasicDropdown
        items={monthsItems}
        onChange={onChangeMonth}
        selectedItem={month}
        style={{ display: 'flex' }}
        buttonRenderer={props.dropdownButtonRenderer}
      />
      <BasicDropdown
        disabled={!month.value}
        items={daysItems}
        selectedItem={day}
        onChange={onChangeDay}
        style={{ display: 'flex', margin: '0 0.5rem 0' }}
        buttonRenderer={props.dropdownButtonRenderer}
      />
      {props.showYear ? (
        <Input
          type="text"
          autoComplete="disabled"
          placeholder="Year"
          maxLength="4"
          onChange={onChangeYear}
          value={year}
        />
      ) : (
        <Button appearance="link" onClick={props.toggleYearOption}>
          + Add Year
        </Button>
      )}
    </Flex>
  )
}

DateField.propTypes = {
  day: PropTypes.shape().isRequired,
  month: PropTypes.shape().isRequired,
  year: PropTypes.any,
  onChangeDay: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func,
  showYear: PropTypes.bool,
  toggleYearOption: PropTypes.func
}

DateField.defaultProps = {
  showYear: false,
  onChangeYear() {},
  toggleYearOption() {},
  year: ''
}
