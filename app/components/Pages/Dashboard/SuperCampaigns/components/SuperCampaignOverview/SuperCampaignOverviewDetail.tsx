import { makeStyles } from '@material-ui/core'
import format from 'date-fns/format'

import { useReplaceQueryParam } from '@app/hooks/use-query-param'

import { useIsSuperCampaignExecutedOrDueAtTimeout } from '../../hooks/use-is-super-campaign-executed-or-due-at-timeout'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'
import SuperCampaignDrawer from '../SuperCampaignDrawer'
import { SuperCampaignFormValues } from '../SuperCampaignDrawer/types'
import SuperCampaignTemplate from '../SuperCampaignTemplate/SuperCampaignTemplate'

import SuperCampaignOverviewDetailLabelValue from './SuperCampaignOverviewDetailLabelValue'

const useStyles = makeStyles(
  theme => ({
    title: {
      marginRight: -5,
      marginBottom: theme.spacing(2)
    },
    labelValue: {
      marginBottom: theme.spacing(3),
      '&:last-of-type': { marginBottom: 0 }
    },
    section: { marginBottom: theme.spacing(6) }
  }),
  { name: 'SuperCampaignOverviewDetail' }
)

function SuperCampaignOverviewDetail() {
  const classes = useStyles()
  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()
  const { isSaving, saveSuperCampaign } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )
  const [editDrawerParam, setEditDrawerParam, deleteEditDrawerParam] =
    useReplaceQueryParam('edit-drawer')

  const isCampaignExecutedOrDueAtTimeout =
    useIsSuperCampaignExecutedOrDueAtTimeout(superCampaign)

  const openDrawer = () => setEditDrawerParam('open')

  const closeDrawer = () => deleteEditDrawerParam()

  const handleTemplateChange = (template: IMarketingTemplateInstance) =>
    saveSuperCampaign({ template_instance: template })

  const handleSuperCampaignConfirm = async (
    formValues: SuperCampaignFormValues
  ) => {
    await saveSuperCampaign(formValues)
    closeDrawer()
  }

  return (
    <SuperCampaignCard>
      <div className={classes.section} data-test="super-campaign-details">
        <SuperCampaignCardHeader
          className={classes.title}
          title="Details"
          actionLabel={!isCampaignExecutedOrDueAtTimeout ? 'Edit' : undefined}
          onActionClick={openDrawer}
        />
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Email Subject"
          value={superCampaign.subject || '-'}
        />
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Description"
          value={superCampaign.description || '-'}
        />
        {}
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Scheduled for"
          value={
            superCampaign.due_at
              ? format(
                  superCampaign.due_at * 1000,
                  "EEEE, LLLL dd, yyyy 'at' hh:mmaaa"
                )
              : '-'
          }
        />
      </div>
      {superCampaign.template_instance && (
        <SuperCampaignTemplate
          titleClassName={classes.title}
          titleVariant="body1"
          template={superCampaign.template_instance}
          onTemplateChange={handleTemplateChange}
          readOnly={isCampaignExecutedOrDueAtTimeout}
        />
      )}
      <SuperCampaignDrawer
        isOpen={!!editDrawerParam && !isCampaignExecutedOrDueAtTimeout}
        onClose={closeDrawer}
        formInitialValues={superCampaign}
        onConfirm={handleSuperCampaignConfirm}
        actionButtonsDisabled={isSaving}
      />
    </SuperCampaignCard>
  )
}

export default SuperCampaignOverviewDetail
