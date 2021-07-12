import { memo, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box, Button, makeStyles, Theme } from '@material-ui/core'
import {
  mdiInstagram,
  mdiLinkedin,
  mdiFacebook,
  mdiEmailOutline,
  mdiWeb,
  mdiPrinter,
  mdiShareVariant
} from '@mdi/js'

import { selectUser } from 'selectors/user'

import { Thumbnail as MarketingTemplateCardThumbnail } from 'components/MarketingTemplateCard/Thumbnail'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const MEDIUM_ICONS: Record<IMarketingTemplateMedium, string> = {
  InstagramStory: mdiInstagram,
  Email: mdiEmailOutline,
  LinkedInCover: mdiLinkedin,
  FacebookCover: mdiFacebook,
  Letter: mdiPrinter,
  Social: mdiShareVariant,
  Website: mdiWeb
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(6),
      position: 'relative'
    },
    templatesListContainerCollapsed: {
      maxHeight: 400,
      overflowY: 'hidden',
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: `inset 0 0px 0px 0 ${theme.palette.grey[400]}, inset 0px -22px 15px -10px ${theme.palette.grey[500]}`
    },
    expandButtonContainer: {
      position: 'absolute',
      zIndex: theme.zIndex.gridAction,
      bottom: -24,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    thumbnailContainer: {
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(3),
      overflow: 'hidden',
      height: 'fit-content',
      boxShadow: theme.shadows[8],
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'ListingMarketingTemplatesList'
  }
)

interface Props {
  header: ReactNode
  listing: IListing
  medium: IMarketingTemplateMedium
  templates: IBrandMarketingTemplate[]
  isExpanded: boolean
  onExpandClick: () => void
  onClick: (template: IBrandMarketingTemplate) => void
}

function TemplatesList({
  header,
  listing,
  medium,
  templates,
  isExpanded,
  onExpandClick,
  onClick
}: Props) {
  const classes = useStyles()
  const user = useSelector(selectUser)

  return (
    <Grid
      container
      item
      spacing={2}
      direction="row"
      className={classes.container}
    >
      <Grid container item direction="row" alignItems="center">
        <Grid item>
          <Box mx={1} display="flex">
            <SvgIcon size={muiIconSizes.large} path={MEDIUM_ICONS[medium]} />
          </Box>
        </Grid>
        <Grid item>{header}</Grid>
      </Grid>
      <Grid
        container
        item
        className={
          isExpanded ? undefined : classes.templatesListContainerCollapsed
        }
      >
        {templates.map(template => (
          <Grid
            key={template.id}
            container
            item
            justify="flex-start"
            xs={12}
            sm={6}
            md={3}
          >
            <Box className={classes.thumbnailContainer}>
              <MarketingTemplateCardThumbnail
                user={user}
                template={template}
                listing={listing}
                onClick={() => onClick(template)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      {!isExpanded && (
        <div className={classes.expandButtonContainer}>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={onExpandClick}
          >
            Expand
          </Button>
        </div>
      )}
    </Grid>
  )
}

export default memo(TemplatesList)
