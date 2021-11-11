import { useCallback } from 'react'

import { Grid, Box, Typography, makeStyles } from '@material-ui/core'
import { mdiImageMultipleOutline } from '@mdi/js'
import { useDropzone } from 'dropzone'
import { useFormContext, Controller } from 'react-hook-form'

import { readFileAsDataUrl } from '@app/utils/file-utils/read-file-as-data-url'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { Asset, AssetsUploadFormData } from '../../types'
import AssetItem from '../AssetItem'
// import ZeroState from '../ZeroState'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: '100%'
    },
    uploadContainer: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1.5, 2, 2),
      height: theme.spacing(7),
      border: `1px dashed ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    image: {
      width: theme.spacing(8),
      height: theme.spacing(14),
      objectFit: 'cover',
      borderRadius: theme.shape.borderRadius
    },
    clickToUpload: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    },
    deleteContainer: {
      flexGrow: 1,
      textAlign: 'right'
    }
  }),
  {
    name: 'MarketingAssetUploadDrawerUploadStepZeroState'
  }
)

interface Props {
  defaultSelectedTemplateType?: IMarketingTemplateType
}

export default function Upload({ defaultSelectedTemplateType }: Props) {
  const classes = useStyles()
  const { setValue, watch, control } = useFormContext<AssetsUploadFormData>()

  const assets = watch('assets')

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return
      }

      const newFilesUrls = await Promise.all(
        acceptedFiles.map(file => readFileAsDataUrl(file))
      )

      const preSelectedTemplateType =
        assets.length > 0
          ? assets[assets.length - 1].templateType ??
            defaultSelectedTemplateType
          : defaultSelectedTemplateType

      const preSelectedMedium: IMarketingTemplateMedium =
        assets.length > 0 ? assets[assets.length - 1].medium : 'Email'

      const newAssets: Asset[] = [
        ...assets,
        ...newFilesUrls.map<Asset>(url => ({
          templateType: preSelectedTemplateType,
          medium: preSelectedMedium,
          file: {
            url
          }
        }))
      ]

      setValue('assets', newAssets)
    },
    [setValue, assets, defaultSelectedTemplateType]
  )

  const handleUpdateAsset = (updatedAsset: Asset) => {
    const assetIndex = assets.findIndex(
      asset => asset.file.url === updatedAsset.file.url
    )
    const oldAsset = assets[assetIndex]
    const newAsset = {
      ...oldAsset,
      ...updatedAsset
    }

    setValue('assets', [
      ...assets.slice(0, assetIndex),
      newAsset,
      ...assets.slice(assetIndex + 1)
    ])
  }

  const handleDeleteAsset = (asset: Asset) => {
    setValue(
      'assets',
      assets.filter(item => item.file.url !== asset.file.url)
    )
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    accept: ['image/*', 'video/*', 'application/pdf']
  })

  return (
    <div className={classes.wrapper} {...getRootProps()}>
      <input {...getInputProps()} />
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.uploadContainer}
      >
        <Grid item>
          <Box mr={1} pt={0.5}>
            <SvgIcon path={mdiImageMultipleOutline} size={muiIconSizes.small} />
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textSecondary" onClick={open}>
            {isDragActive ? (
              'Drop your files to upload'
            ) : (
              <>
                Drag more files here or{' '}
                <span className={classes.clickToUpload}>click to upload</span>
              </>
            )}
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={4}>
        <Controller
          control={control}
          name="assets"
          render={({ value, onChange }) => (
            <>
              {value.map(asset => (
                <AssetItem
                  key={asset.file.url}
                  asset={asset}
                  onDeleteAsset={handleDeleteAsset}
                  onUpdateAsset={handleUpdateAsset}
                />
              ))}
            </>
          )}
        />
      </Grid>
    </div>
  )
}
