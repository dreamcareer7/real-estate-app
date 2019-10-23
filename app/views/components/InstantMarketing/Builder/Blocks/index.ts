import { Editor } from 'grapesjs'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlock, { Options as AgentOptions } from './Agent'
import { TemplateRenderData } from '../utils/get-template-render-data/index'

const BLOCK_IDS_TO_REMOVE = ['mj-social-element', 'mj-navbar', 'mj-navbar-link']

interface Options {
  listing: ListingOptions
  agent: AgentOptions
}

export function removeUnusedBlocks(editor: Editor) {
  BLOCK_IDS_TO_REMOVE.forEach(editor.BlockManager.remove)
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent }: Options
) {
  return {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlock(editor, renderData, agent)
  }
}
