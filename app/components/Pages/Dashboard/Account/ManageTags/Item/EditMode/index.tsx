import React from 'react'

import {
  Theme,
  Button,
  Popover,
  TextField,
  Typography,
  makeStyles,
  InputAdornment
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import pluralize from 'pluralize'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '320px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 3),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    close: {
      display: 'inline-flex',
      cursor: 'pointer'
    },
    fields: {
      padding: theme.spacing(2.5, 2)
    },
    inputField: {
      width: '100%',
      '&:not(:first-child)': { marginTop: theme.spacing(2.5) }
    }
  }),
  {
    name: 'ManageTagsEditMode'
  }
)

interface Props {
  tag: IContactTag & { highlight: boolean }
  loading: boolean
  anchorEl: Nullable<HTMLElement>
  handleClose: () => void
  onSave: (text: string, touchDate: Nullable<number>) => void
}

interface FormData {
  text: string
  touchDate: Nullable<string>
}

export function EditMode({
  tag,
  loading,
  anchorEl,
  onSave,
  handleClose
}: Props) {
  const classes = useStyles()
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      text: tag.text || '',
      touchDate: tag.touch_freq?.toString() || '0'
    }
  })

  const open = Boolean(anchorEl)
  const id = open ? 'popover-edit-tag' : undefined

  const handleOnSave: SubmitHandler<FormData> = ({ text, touchDate = '0' }) => {
    onSave(text, parseInt(touchDate!, 10))
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <form onSubmit={handleSubmit(handleOnSave)} noValidate>
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography variant="h6">Edit Tag</Typography>
            <div className={classes.close} onClick={handleClose}>
              <SvgIcon path={mdiClose} />
            </div>
          </div>
          <div className={classes.fields}>
            <Controller
              name="text"
              control={control}
              rules={{
                required: 'Required'
              }}
              render={({ ...props }) => {
                const error: string | undefined =
                  errors[props.name]?.message ?? undefined

                return (
                  <TextField
                    {...props}
                    type="text"
                    size="small"
                    label="Title"
                    color="secondary"
                    error={!!error}
                    helperText={error}
                    variant="outlined"
                    className={classes.inputField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )
              }}
            />
            <Controller
              name="touchDate"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: 'Touch Date must be grater than 0 or equal.'
                }
              }}
              render={({ ref, value, ...props }) => {
                const error: string | undefined =
                  errors[props.name]?.message ?? undefined

                return (
                  <TextField
                    {...props}
                    type="number"
                    label="Touch Date"
                    size="small"
                    color="secondary"
                    value={value}
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {value && value > 0 ? pluralize('Day', value) : 'Day'}
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: 0
                      }
                    }}
                    error={!!error}
                    helperText={error}
                    variant="outlined"
                    className={classes.inputField}
                  />
                )
              }}
            />

            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={loading || !isDirty}
              className={classes.inputField}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Popover>
  )
}
