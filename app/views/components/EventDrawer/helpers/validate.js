export function validate(values) {
  const errors = {}

  if (!values.title) {
    errors.title = 'Required'
  }

  console.log(errors)

  return errors
}
