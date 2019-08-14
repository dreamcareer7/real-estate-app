import { searchContacts } from 'models/contacts/search-contacts'
import { createFlow as createNewFlow } from 'models/flows/create-flow'

export function getFlowEditUrl(id: UUID) {
  return `/dashboard/account/flows/${id}`
}

export async function createFlow(
  brandId: UUID,
  data: IBrandFlowInput,
  duplicatedFlow: IBrandFlow | null,
  callback?: (flow: IBrandFlow) => any
) {
  // Normalize if we are duplicating
  if (duplicatedFlow) {
    data.steps = duplicatedFlow.steps
      ? duplicatedFlow.steps.map(convertStepToStepInput)
      : []
  } else {
    data.steps = []
  }

  const flow = await createNewFlow(brandId, data)

  if (callback) {
    callback(flow)
  }
}

export async function getEnrolledContacts(flow: UUID): Promise<IContact[]> {
  const result = await searchContacts(
    undefined,
    undefined,
    undefined,
    undefined,
    [flow],
    undefined
  )

  return result.data
}

export function validateStringInput(
  value: string = '',
  name: string,
  maxLength
): string | null {
  return validateInput(
    value,
    name,
    v => v.trim() !== '' && v.trim().length < maxLength
  )
}

export function validateInput(
  value: string = '',
  name: string,
  condition: (input: string) => boolean,
  error?: string
): string | null {
  if (condition(value)) {
    return null
  }

  return error || `Invalid ${name}`
}

export function convertStepToStepInput(
  step: IBrandFlowStep
): IBrandFlowStepInput {
  const resultStep: IBrandFlowStepInput = {
    title: step.title,
    description: step.description,
    due_in: step.due_in
  }

  if (step.email) {
    resultStep.email = step.email.id
  }

  if (step.event) {
    resultStep.event = {
      title: step.event.title,
      description: step.event.description,
      task_type: step.event.task_type
    }
  }

  return resultStep
}
