import * as React from 'react'
import {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState
} from 'react'
import { useControllableState } from 'react-use-controllable-state/dist'
import {
  createStyles,
  IconButton,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField'

import classNames from 'classnames'

import { useOnToggledOn } from '../../TextEditor/components/LinkEditorPopover/hooks/use-on-toggled'
import EditIcon from '../../SvgIcons/Edit/EditIcon'
import IconCheckmark from '../../SvgIcons/Checkmark/IconCheckmark'

interface Props {
  children?: ReactNode
  /**
   * optional control over editing. You need to handle onEditingChange if
   * editing is passed
   */
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  TextFieldProps?: TextFieldProps
  value: string
  blurBehaviour?: 'Save' | 'Cancel' | 'None'
  amendEditIcon?: boolean
  showSaveButton?: boolean
  onSave: (newValue: string) => Promise<string | void> | string | void
}

const useInlineEditableStringStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      viewRoot: {
        display: 'inline-flex',
        alignItems: 'center',
        '&:hover $editIcon': {
          opacity: 1
        }
      },
      input: {
        // FIXME: vertical padding should be removed in favor of hiddenLabel
        //   which is added in v4.3.0.
        padding: '0.625rem .5rem'
      },
      textField: {
        // to compensate for horizontal padding of the input
        transform: 'translateX(-0.5rem)'
      },
      editIcon: {
        verticalAlign: 'text-bottom',
        opacity: 0,
        transition: 'opacity 300ms'
      }
    }),
  { name: 'InlineEditableString' }
)
/**
 * This component is written because the product design for checklist management
 * doesn't fit out current InlineEditableField.
 */
export const InlineEditableString = forwardRef(function InlineEditableString(
  {
    blurBehaviour = 'Cancel',
    TextFieldProps = {},
    showSaveButton = true,
    ...props
  }: Props,
  ref
) {
  const [editing, setEditing] = useControllableState(
    props.editing,
    props.onEditingChange,
    false
  )

  const [editingValue, setEditingValue] = useState('')
  const [saving, setSaving] = useState(false)

  const classes = useInlineEditableStringStyles(props)

  const edit = useCallback(() => setEditing(true), [setEditing])

  useImperativeHandle(ref, () => ({
    edit
  }))

  const save = async () => {
    setSaving(true)
    await props.onSave(editingValue)
    setSaving(false)
    setEditing(false)
  }

  useOnToggledOn(
    editing,
    useCallback(() => {
      setEditingValue(props.value)
    }, [props.value])
  )

  const onKeyUp: React.KeyboardEventHandler = event => {
    if (event.key === 'Enter') {
      save()
    }

    if (event.key === 'Escape') {
      setEditing(false)
    }
  }
  const onBlur = async () => {
    if (blurBehaviour === 'Save') {
      await save()
    }

    if (blurBehaviour !== 'None') {
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <TextField
        variant="filled"
        inputProps={{
          ...(TextFieldProps.inputProps || {}),
          onKeyUp,
          onBlur
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          classes: { input: classes.input },
          endAdornment: showSaveButton ? (
            <IconButton size="small" onClick={save}>
              <IconCheckmark />
            </IconButton>
          ) : (
            undefined
          )
        }}
        classes={{
          root: classNames(
            classes.textField,
            (TextFieldProps.classes || {}).root
          )
        }}
        {...TextFieldProps as any}
        value={editingValue}
        disabled={saving}
        autoFocus
        onChange={event => setEditingValue(event.target.value)}
      />
    )
  }

  return typeof props.children === 'function' ? (
    props.children({ edit, save, saving })
  ) : (
    <span className={classes.viewRoot} onClick={edit}>
      {props.children || props.value}{' '}
      <EditIcon className={classes.editIcon} size={{ width: 16, height: 16 }} />
    </span>
  )
})
