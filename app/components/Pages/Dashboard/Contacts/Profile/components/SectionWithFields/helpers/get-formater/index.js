export function getFormater({ attribute_def }) {
  if (attribute_def.data_type === 'date') {
    const addZero = n => (n > 10 ? n : `0${n}`)

    return unixUTC => {
      const utcDate = new Date(unixUTC * 1000)
      const day = utcDate.getUTCDate()
      const month = utcDate.getUTCMonth() + 1
      const _year = utcDate.getUTCFullYear()
      const year = _year === 1800 ? '' : `/${_year}`

      return `${addZero(month)}/${addZero(day)}${year}`
    }
  }

  return t => t
}
