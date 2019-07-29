import { ContentBlock, ContentState, EditorState } from 'draft-js'
import { PluginFunctions } from 'draft-js-plugins-editor'

import { Options as ImportOptions, stateFromHTML } from 'draft-js-import-html'

import { appendBlocks } from '../utils/append-blocks'

type SignatureContentType = ContentBlock[] | string

export type SignatureContentOption =
  | SignatureContentType
  | (() => SignatureContentType)

export interface CreateSignaturePluginOptions {
  /**
   * Content of the signature. It can be the content itself or a function which
   * returns the content. If the content is string, it's converted to block
   * array using stateFromHTML
   */
  signatureContent: SignatureContentOption
  /**
   * Weather to prepend the signature with a "--" separator line.
   */
  prependSignatureWithSeparator?: boolean

  stateFromHtmlOptions?: ImportOptions
}

/**
 * Creates a plugin which exposes these functions:
 *  - toggleSignature: adds/removes signature to/from the editor
 *  - hasSignature: indicates whether the editor currently contains the signature
 *
 * It also exposes appendSignature modifier
 *
 * @param signatureBlocks
 * @param prependSignatureWithSeparator
 */
export default function createSignaturePlugin({
  signatureContent,
  prependSignatureWithSeparator = true,
  stateFromHtmlOptions
}: CreateSignaturePluginOptions) {
  let pluginFns: PluginFunctions

  /**
   * Returns weather signature exists in the editor or not.
   */
  const hasSignature = () => {
    return (
      pluginFns &&
      pluginFns
        .getEditorState()
        .getCurrentContent()
        .getBlocksAsArray()
        .some(isSignatureBlock)
    )
  }

  /**
   * Toggles signature. If called with no argument, toggles. if a boolean
   * argument is passed, it enforces weather the signature should be shown
   * or not
   * @param enabled
   */
  const toggleSignature = (enabled?: boolean) => {
    if (!pluginFns) {
      console.error(
        'toggleSignature cannot be called before editor initialization'
      )

      return
    }

    const editorState = pluginFns.getEditorState()

    if (!hasSignature() && enabled !== false) {
      // add signature
      pluginFns.setEditorState(appendSignature(editorState))
    } else if (hasSignature() && enabled !== true) {
      // remove signature
      const blocks = editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .filter(block => !isSignatureBlock(block))

      pluginFns.setEditorState(
        EditorState.push(
          editorState,
          ContentState.createFromBlockArray(blocks),
          'remove-range'
        )
      )
    }
  }
  const initialize = (fns: PluginFunctions) => {
    pluginFns = fns
  }

  const appendSignature = (editorState: EditorState) => {
    return appendBlocks(editorState, [
      ...stateFromHTML('<br/>').getBlocksAsArray(),
      ...(prependSignatureWithSeparator ? getSignatureSeparator() : []),
      ...getSignatureBlocks(signatureContent, stateFromHtmlOptions).map(
        convertToSignatureBlock
      )
    ])
  }

  return {
    initialize,
    hasSignature,
    toggleSignature,
    modifiers: {
      appendSignature
    }
  }
}

function getSignatureSeparator() {
  return stateFromHTML('<div>--</div>')
    .getBlocksAsArray()
    .map(convertToSignatureBlock)
}

function convertToSignatureBlock(block: ContentBlock) {
  return block.merge({
    data: block.getData().set('isSignature', true)
  }) as ContentBlock
}

function getSignatureBlocks(
  signatureContent: CreateSignaturePluginOptions['signatureContent'],
  stateFromHtmlOptions?: ImportOptions
): ContentBlock[] {
  const content =
    typeof signatureContent === 'function'
      ? signatureContent()
      : signatureContent

  return Array.isArray(content)
    ? content
    : stateFromHTML(content || '', stateFromHtmlOptions).getBlocksAsArray()
}

function isSignatureBlock(block: ContentBlock) {
  return block.getData().get('isSignature')
}
