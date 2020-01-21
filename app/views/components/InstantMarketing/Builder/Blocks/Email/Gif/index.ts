import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { GifItem } from 'components/GifDrawer/types'

import registerBlock from '../../registerBlock'
import adapt from '../../adapt'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'

import template from './template.mjml'

const blockName = 'rechat-gif'

export interface Options {
  onDrop: (model: Model) => void
}

interface GifBlock {
  selectHandler: (selectedGif?: any) => void
}

export default function registerGifBlock(
  editor: Editor,
  { onDrop }: Options
): GifBlock {
  registerBlock(editor, {
    label: 'GIF Animation',
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template,
    adaptive: true
  })

  let modelHandle: any

  const selectHandler = (selectedGif?: GifItem) => {
    if (!modelHandle) {
      return
    }

    const parent = modelHandle.parent()

    if (selectedGif) {
      const mjml = nunjucks.renderString(adapt(parent, template), {
        url: selectedGif.url
      })

      parent.append(mjml, { at: modelHandle.opt.at })
    }

    modelHandle.remove()
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model) {
      return
    }

    if (block.id === blockName) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}