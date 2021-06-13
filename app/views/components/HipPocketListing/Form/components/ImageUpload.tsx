import { useState, useCallback } from 'react'
import { Grid, Typography, makeStyles, useTheme } from '@material-ui/core'
import { mdiImageMultipleOutline } from '@mdi/js'
import { useDropzone } from 'dropzone'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ImageUploadProps } from '../../types'

const useStyles = makeStyles(
  theme => ({
    container: {
      background: theme.palette.grey[50],
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2, 0)
    },
    actionableText: {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
      transition: theme.transitions.create('color'),

      '&:hover': {
        color: theme.palette.secondary.dark
      }
    }
  }),
  {
    name: 'HipPocketListingFormImageUpload'
  }
)

export default function HipPocketListingFormImageUpload({
  onImageUpload
}: ImageUploadProps) {
  const classes = useStyles()
  const theme = useTheme()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        await onImageUpload(acceptedFiles)
      } catch (error) {
        console.error('Error uploading images', error)
      } finally {
        setIsUploading(false)
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    multiple: true,
    accept: 'image/*'
  })

  return (
    <Grid
      container
      item
      style={isDragActive ? { background: theme.palette.grey[400] } : {}}
      {...{ ...getRootProps(), css: {} }}
    >
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        className={classes.container}
      >
        <input {...getInputProps()} />

        <Grid item>
          <SvgIcon
            path={mdiImageMultipleOutline}
            color={theme.palette.grey[500]}
          />
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Drag listing photos here
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            <span className={classes.actionableText}>choose from gallery</span>{' '}
            or <span className={classes.actionableText}>click to upload</span>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
