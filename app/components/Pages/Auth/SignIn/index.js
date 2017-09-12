import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'
import submitSigninForm from '../../../../store_actions/auth/signin'

export const getBrandInfo = brand => {
  let siteTitle = 'Rechat'
  let brandColor = '#2196f3'
  let siteLogo = '/static/images/logo-200w.png'

  if (brand) {
    siteLogo = Brand.asset('site_logo', null, brand)
    siteTitle = brand.messages.site_title
    brandColor = `#${Brand.color('primary', '#2196f3', brand)}`
  }

  return {
    siteLogo,
    siteTitle,
    brandColor
  }
}

export const renderField = ({
  type,
  input,
  label,
  tabIndex,
  autoFocus = false,
  meta: { dirty, error }
}) => {
  const hasError = dirty && error
  return (
    <div className={`c-auth__field ${input.name}`}>
      <div className="c-auth__field__input-wrapper">
        <input
          {...input}
          id={input.name}
          tabIndex={tabIndex}
          type={type}
          className={`c-auth__field__input ${(input.value && 'has-content') ||
            ''} ${hasError ? 'has-error' : ''}`}
        />
        <label htmlFor={input.name} className="c-auth__field__label">
          <span>{label}</span>
          <sup>*</sup>
        </label>
        <span className="focus-border">
          <i />
        </span>
      </div>
      {hasError && <div className="c-auth__field__error-alert">{error}</div>}
    </div>
  )
}

let SigninForm = ({
  brand,
  pristine,
  isLogging,
  submitError,
  handleSubmit,
  onSubmitHandler
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <Link to="/" tabIndex={-1}>
            <img
              src={siteLogo}
              alt={`${siteTitle} logo`}
              className={'c-auth__logo'}
            />
          </Link>
          <p>Sign into</p>
          <h1 className="c-auth__title tempo">{`${siteTitle}`}</h1>
          {/* <p>It’s nice to have you back!</p> */}
        </header>
        <main className="c-auth__main">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Field
              name="username"
              type="email"
              label="Email"
              tabIndex={0}
              component={renderField}
            />
            <Field
              name="password"
              type="password"
              label="Password"
              component={renderField}
            />
            <Link to="/password/forgot">Forgot your password?</Link>
            {submitError && (
              <div className="c-auth__submit-error-alert">
                The email or password is incorrect. Please try again.
              </div>
            )}
            <button
              type="submit"
              className="c-auth__submit-btn"
              disabled={isLogging || pristine}
              style={{
                background: brandColor,
                opacity: isLogging || pristine ? 0.7 : 1
              }}
            >
              {isLogging ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: '#929292' }}>
            <small>Don't have an account?</small>&nbsp;&nbsp;
            <Link to="/signup">Sign up</Link>
          </p>
        </main>
      </article>
    </div>
  )
}

const validate = values => {
  const errors = {}

  if (!values.username) {
    errors.username = 'Required'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
  ) {
    errors.username = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Must be at least 6 characters.'
  }

  return errors
}

SigninForm = reduxForm({
  form: 'signin',
  validate
})(SigninForm)

export default compose(
  connect(
    ({ brand, auth: { signin } }, { location: { query = {}, state = {} } }) => {
      const { username } = query
      const { isLogging, error: submitError } = signin
      const redirectTo = state.redirectTo || query.redirectTo

      return {
        brand,
        isLogging,
        submitError,
        initialValues: { username },
        redirectTo: redirectTo || '/dashboard/mls'
      }
    },
    { submitSigninForm }
  ),
  withHandlers({
    onSubmitHandler: ({ submitSigninForm, redirectTo }) => values => {
      submitSigninForm(values, redirectTo)
    }
  })
)(SigninForm)
