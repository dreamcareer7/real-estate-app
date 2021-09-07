import React, { useState } from 'react'

import { List, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
import { useDebouncedCallback } from 'use-debounce'

import { SearchInput } from '@app/views/components/SearchInput'

const useStyles = makeStyles(
  theme => ({
    listboxContainer: {
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1,
      position: 'absolute',
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      boxShadow: '1px 1px 5px 1px rgba(0,0,0,0.22)',
      fontFamily: 'Lato'
    },
    listBoxFooter: {
      borderTop: '1px solid #e4e4e4',
      backgroundColor: '#F9FAFC',
      padding: theme.spacing(1),
      textTransform: 'none',
      textAlign: 'left'
    },
    listBoxFooterLabel: {
      justifyContent: 'start',
      color: theme.palette.primary.main
    },
    listbox: {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      maxHeight: 270,
      '& li': {
        padding: theme.spacing(1)
      },
      '& li[data-focus="true"]': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        color: '#000',
        cursor: 'pointer'
      },
      '& li:active': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        color: '#000'
      }
    },
    noResults: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper
    }
  }),
  { name: 'AutoComplete' }
)

function getHighlightedText(text: string, highlight: string) {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))

  return (
    <span>
      {' '}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: 'bold' }
              : {}
          }
        >
          {part}
        </span>
      ))}{' '}
    </span>
  )
}

interface Props<T> {
  fullWidth?: boolean
  placeholder: string
  renderOption: (
    options: T[],
    getOptionProps: ({ option, index }: { option: T; index: number }) => {},
    getHighlightedText: (text: string, highlight: string) => React.ReactNode,
    state: { inputValue: string }
  ) => React.ReactNode
  renderFooter: (inputValue: string) => React.ReactNode
  getOptionLabel: (option: T) => string
  onFooterClick: (value: string) => void
  model: T[] | ((value: string) => Promise<T[]>)
  debug?: boolean
  minChars?: number
  debounce?: number
}

export default function AutoComplete<T>({
  fullWidth = false,
  placeholder,
  renderOption,
  renderFooter,
  onFooterClick,
  getOptionLabel,
  debug = false,
  model,
  minChars = 2,
  debounce = 200
}: Props<T>) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const widthStyle = { width: fullWidth ? '100%' : '500px' } // default width

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue
  } = useAutocomplete<T>({
    id: 'auto-complete',
    autoComplete: true,
    autoHighlight: true,
    options,
    getOptionLabel,
    clearOnBlur: false,
    open,
    debug,
    onOpen: () => {
      setOpen(true)
    },
    onClose: () => {
      setOpen(false)
    },
    onInputChange: (e, value, reason) => {
      // console.log(e, value, reason);
    }
  })

  const [fetchResults] = useDebouncedCallback(async (value: string) => {
    let response

    // Either model is an object or a promise which gets us the
    // results with an ajax call
    if (typeof model === 'function') {
      response = await model(value)
    } else {
      response = model
    }

    setOptions(response)
    setIsLoading(false)
    setOpen(true)
  }, debounce)

  return (
    <div>
      <div {...getRootProps()}>
        <SearchInput
          placeholder={placeholder}
          inputProps={{ ...getInputProps() }}
          isLoading={isLoading}
          disableClearButton={false}
          onChangeHandler={(e, value = '') => {
            // since our input is "controlled" we want to set the input value
            // on onChange event
            setIsLoading(true)

            if (value && value.length >= minChars) {
              fetchResults(value)
            } else {
              setIsLoading(false)
            }
          }}
        />
      </div>
      {open && inputValue.length >= minChars && (
        <div className={classes.listboxContainer} style={widthStyle}>
          {options.length > 0 && inputValue.length > 0 && (
            <List className={classes.listbox} {...getListboxProps()}>
              {renderOption(
                groupedOptions,
                getOptionProps,
                getHighlightedText,
                { inputValue }
              )}
            </List>
          )}
          {groupedOptions.length === 0 &&
            inputValue.length > 0 &&
            !isLoading && (
              <div className={classes.noResults}>No results found.</div>
            )}
          {inputValue.length > 0 && (
            <Button
              className={classes.listBoxFooter}
              classes={{ label: classes.listBoxFooterLabel }}
              onClick={e => {
                onFooterClick(inputValue)
              }}
            >
              {renderFooter(inputValue)}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
