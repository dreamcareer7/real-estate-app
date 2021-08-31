import { useState, useEffect } from 'react'

import { Grid, Tabs, Tab } from '@material-ui/core'

import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import MarketingTemplateInstancePicker from '@app/views/components/MarketingTemplatePickers/MarketingTemplateInstancePicker'
import TemplatesList from '@app/views/components/MarketingTemplatePickers/MarketingTemplatePicker/TemplatesList'
import { MarketingTemplateAndTemplateInstancePickerProps } from '@app/views/components/MarketingTemplatePickers/types'

type MyDesignsOrTemplateType = 'MyDesigns' | IMarketingTemplateType

export default function MarketingTemplateAndTemplateInstancePicker({
  templateTypes,
  selectedTab: passedSelectedTab,
  ...props
}: MarketingTemplateAndTemplateInstancePickerProps) {
  const [selectedTab, setSelectedTab] = useState<MyDesignsOrTemplateType>(
    passedSelectedTab ?? 'MyDesigns'
  )

  useEffect(() => {
    if (!passedSelectedTab) {
      return
    }

    setSelectedTab(passedSelectedTab)
  }, [passedSelectedTab])

  return (
    <Grid container>
      <Grid container item>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          variant="scrollable"
          textColor="inherit"
          onChange={(event: unknown, newValue: MyDesignsOrTemplateType) =>
            setSelectedTab(newValue)
          }
        >
          <Tab value="MyDesigns" label="My Designs" />
          {templateTypes.map(templateType => (
            <Tab
              key={templateType}
              value={templateType}
              label={getTemplateTypeLabel(templateType)}
            />
          ))}
        </Tabs>
      </Grid>
      <Grid container item>
        {selectedTab === 'MyDesigns' && (
          <MarketingTemplateInstancePicker
            {...props}
            templateTypes={templateTypes}
          />
        )}
        {selectedTab !== 'MyDesigns' && (
          <TemplatesList {...props} templateTypes={[selectedTab]} />
        )}
      </Grid>
    </Grid>
  )
}
