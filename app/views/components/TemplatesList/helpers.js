import fecha from 'fecha'

export function getThumbnail(template) {
  if (template.file) {
    return template.file.preview_url
  }

  return `${template.url}/thumbnail.png`
}

export function createdAt(date) {
  return fecha.format(new Date(date * 1000), '[on] MMMM DD, YYYY [at] hh:mm A')
}

export function plural(word, isPlural) {
  return isPlural ? `${word}s` : word
}

export function getSelectedMediumTemplates(templates, wantedMedium) {
  return templates.filter(t => t.medium === wantedMedium)
}

function getTemplateIndex(availableTemplates, selectedTemplate) {
  return availableTemplates.findIndex(t => t.id === selectedTemplate.id)
}

function navigateBetweenTemplates(
  direction,
  templates,
  selectedTemplate,
  wantedMedium
) {
  if (!selectedTemplate) {
    return
  }

  const availableTemplates = getSelectedMediumTemplates(templates, wantedMedium)
  const selectedTemplateIndex = getTemplateIndex(
    availableTemplates,
    selectedTemplate
  )

  let nextIndex

  if (direction == 'previous') {
    nextIndex =
      selectedTemplateIndex === 0
        ? availableTemplates.length - 1
        : selectedTemplateIndex - 1
  } else {
    nextIndex =
      selectedTemplateIndex === templates.length - 1
        ? 0
        : selectedTemplateIndex + 1
  }

  return availableTemplates[nextIndex]
}

export function selectPreviousTemplate(
  templates,
  selectedTemplate,
  wantedMedium
) {
  return navigateBetweenTemplates(
    'previous',
    templates,
    selectedTemplate,
    wantedMedium
  )
}

export function selectNextTemplate(templates, selectedTemplate, wantedMedium) {
  return navigateBetweenTemplates(
    'next',
    templates,
    selectedTemplate,
    wantedMedium
  )
}

export function navigateBetweenTemplatesUsingKeyboard(
  key,
  templates,
  selectedTemplate,
  wantedMedium
) {
  if (key === 'ArrowLeft') {
    return selectPreviousTemplate(templates, selectedTemplate, wantedMedium)
  }

  if (key === 'ArrowRight') {
    return selectNextTemplate(templates, selectedTemplate, wantedMedium)
  }
}

export function itemButtonText(item) {
  let isInstance = false
  let isEmail = false
  let text = 'Customize'

  if (item && item.template) {
    isInstance = item.type === 'template_instance'
    isEmail = item.template.medium === 'Email'
  }

  if (isInstance) {
    text = isEmail ? 'Compose' : 'Share'
  }

  return text
}

export function itemDateText(time, isLoading) {
  if (isLoading) {
    return 'Deleting...'
  }

  return `Created ${createdAt(time)}`
}