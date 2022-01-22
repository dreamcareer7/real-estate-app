import type { Editor, Model } from 'grapesjs'

function getDefaultFallbackSrc(model: Model): Optional<string> {
  // Check if the model is an avatar
  if (model.getAttributes()['rechat-assets'] === 'avatar') {
    return '/static/images/marketing/editor/default-avatar.svg'
  }
}

export function addFallbackSrcToMjImage(editor: Editor) {
  editor.DomComponents.addType('mj-image', {
    extendFnView: ['render'],
    view: {
      render() {
        // The grapesjs-mjml-improved package was missed `this.postRender` on its implementation and I'm not sure
        // what happens if I add it. So according to the fact that only this component needs it, I added it here.
        this.postRender()
      },
      onRender({ el, model }) {
        const imgEl: Nullable<HTMLImageElement> = el.querySelector('img')

        if (!imgEl) {
          return
        }

        const defaultFallbackSrc = getDefaultFallbackSrc(model)
        const fallbackSrc =
          model.getAttributes()['fallback-src'] || defaultFallbackSrc

        // Do not continue if there is no fallback src
        if (!fallbackSrc) {
          return
        }

        const src = model.getAttributes().src

        const variableRegex = /^{{.*}}$/i

        // If the src is a variable
        if (variableRegex.test(src.trim())) {
          imgEl.src = fallbackSrc

          return
        }

        // Set the fallback-src value if the image src is broken
        imgEl.onerror = () => {
          imgEl.src = fallbackSrc
        }
      }
    }
  })
}
