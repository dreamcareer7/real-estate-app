import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

import { getLegalFullName } from 'deals/utils/roles'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { upsertContexts } from 'actions/deals'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  sellerAgent?: IDealRole
  onChange: (value: IDealEnderType) => void
}

export function OfferEnderType({ sellerAgent, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: deal
        ? getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
        : [],
      checklists: getDealChecklists(deal, deals.checklists)
    })
  )

  const dispatch = useDispatch()

  const handleChange = (value: IDealEnderType) => {
    if (deal) {
      const data = createContextObject(
        deal,
        brandChecklists,
        checklists,
        'ender_type',
        value,
        false
      )

      dispatch(upsertContexts(deal!.id, [data]))
    } else {
      onChange(value)
    }

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Is another agent from your office on the other side of this deal?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={[
            {
              label: 'Yes',
              value: 'OfficeDoubleEnder'
            },
            {
              label: 'No',
              value: null
            },
            {
              label: `${getLegalFullName(sellerAgent)} represents both sides`,
              value: 'AgentDoubleEnder'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
