import React, { Fragment } from 'react'

import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import '../../../../styles/components/modules/template-builder.scss'

import _ from 'underscore'

import './AssetManager'
import juice from 'juice'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import { TeamContactSelect } from 'components/TeamContact/TeamContactSelect'

import { VideoToolbar } from './VideoToolbar'

import config from './config'

import nunjucks from '../helpers/nunjucks'

import {
  Container,
  Actions,
  TemplatesContainer,
  BuilderContainer,
  Header,
  Divider
} from './styled'
import Templates from '../Templates'

class Builder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      template: null,
      selectedTemplate: null,
      owner: props.templateData.user
    }

    this.keyframe = 0

    this.traits = {
      link: [
        {
          type: 'text',
          label: 'Link',
          name: 'href'
        }
      ]
    }
  }

  componentDidMount() {
    this.editor = grapesjs.init({
      ...config,
      avoidInlineStyle: false,
      keepUnusedStyles: true,
      forceClass: false,
      container: '#grapesjs-canvas',
      components: null,
      assetManager: {
        assets: this.props.assets
      },
      storageManager: {
        autoload: 0
      },
      showDevices: false,
      plugins: ['asset-blocks']
    })

    this.editor.on('load', this.setupGrapesJs)
  }

  setupGrapesJs = () => {
    this.lockIn()
    this.disableResize()
    this.singleClickTextEditing()
    this.disableAssetManager()

    if (this.IsVideoTemplate) {
      this.grapes.appendChild(this.videoToolbar)
    }
  }

  disableAssetManager = () => {
    this.editor.on('run:open-assets', () => this.editor.Modal.close())
  }

  singleClickTextEditing = () => {
    this.editor.on('component:selected', selected => {
      if (!selected.view.enableEditing) {
        return
      }

      selected.view.enableEditing(selected.view.el)
    })
  }

  disableResize = () => {
    const components = this.editor.DomComponents

    const image = components.getType('image')

    const defaults = image.model.prototype.defaults

    const updated = image.model.extend({
      defaults: Object.assign({}, defaults, {
        resizable: false
      })
    })

    components.addType('image', {
      model: updated,
      view: image.view
    })
  }

  lockIn = () => {
    const updateAll = model => {
      const editable =
        model && model.view && model.view.$el.attr('rechat-editable')

      if (!editable) {
        model.set({
          editable: false,
          selectable: false,
          hoverable: false
        })
      }

      model.set({
        draggable: false,
        droppable: false,
        traits: this.traits[model.get('type')] || []
      })

      model.get('components').each(model => updateAll(model))
    }

    updateAll(this.editor.DomComponents.getWrapper())
  }

  getSavedTempldate() {
    const css = this.editor.getCss()
    const html = this.editor.getHtml()

    const assembled = `
      <!doctype html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>`

    const result = juice(assembled)

    return {
      ...this.state.selectedTemplate,
      result
    }
  }

  handleSave = () =>
    this.props.onSave(this.getSavedTempldate(), this.state.owner)

  handleSocialSharing = socialName =>
    this.props.onSocialSharing(this.getSavedTempldate(), socialName)

  handleSelectTemplate = templateItem => {
    this.setState({
      template: templateItem,
      selectedTemplate: null
    })

    const template = {
      ...templateItem,
      template: nunjucks.renderString(templateItem.template, {
        ...this.props.templateData,
        user: this.state.owner
      })
    }

    this.setState({
      selectedTemplate: template
    })

    const components = this.editor.DomComponents

    components.clear()
    this.editor.setStyle('')
    this.editor.setComponents(template.template)
    this.lockIn()
  }

  get ShowSocialButtons() {
    return this.props.mediums.includes('Social')
  }

  get IsVideoTemplate() {
    return this.state.template && this.state.template.video
  }

  get IsTemplateLoaded() {
    return this.state.selectedTemplate && this.state.selectedTemplate.template
  }

  handleOwnerChange = ({ value: owner }) => this.setState({ owner })

  render() {
    return (
      <Container className="template-builder">
        <Header>
          <h1>{this.props.headerTitle}</h1>

          <Actions>
            <TeamContactSelect
              pullTo="right"
              user={this.props.templateData.user}
              owner={this.state.owner}
              onChange={this.handleOwnerChange}
              style={{ marginRight: '0.5rem' }}
            />
            {this.ShowSocialButtons && this.state.selectedTemplate ? (
              <Fragment>
                <ActionButton
                  onClick={() => this.handleSocialSharing('Instagram')}
                >
                  <i
                    className="fa fa-instagram"
                    style={{
                      fontSize: '1.5rem',
                      marginRight: '0.5rem'
                    }}
                  />
                  Post to Instagram
                </ActionButton>

                <ActionButton
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => this.handleSocialSharing('Facebook')}
                >
                  <i
                    className="fa fa-facebook-square"
                    style={{
                      fontSize: '1.5rem',
                      marginRight: '0.5rem'
                    }}
                  />
                  Post to Facebook
                </ActionButton>
              </Fragment>
            ) : (
              <ActionButton
                style={{ marginLeft: '0.5rem' }}
                onClick={this.handleSave}
              >
                {this.props.saveButtonLabel}
              </ActionButton>
            )}

            {/* {template && template.video && (
              <ActionButton
                style={{ marginLeft: '0.5rem' }}
                onClick={this.onPrevious}
              >
                Previous
              </ActionButton>
            )}

            {template && template.video && (
              <ActionButton onClick={this.onNext.bind(this)}>Next</ActionButton>
            )} */}

            <Divider />
            <IconButton
              isFit
              iconSize="large"
              inverse
              onClick={this.props.onClose}
            >
              <CloseIcon />
            </IconButton>
          </Actions>
        </Header>

        <BuilderContainer>
          <TemplatesContainer
            isInvisible={this.props.showTemplatesColumn === false}
          >
            <Templates
              defaultTemplate={this.props.defaultTemplate}
              mediums={this.props.mediums}
              onTemplateSelect={this.handleSelectTemplate}
              templateTypes={this.props.templateTypes}
            />
          </TemplatesContainer>

          <div
            id="grapesjs-canvas"
            ref={ref => (this.grapes = ref)}
            style={{ position: 'relative' }}
          >
            {this.IsVideoTemplate && this.IsTemplateLoaded && (
              <VideoToolbar
                onRef={ref => (this.videoToolbar = ref)}
                editor={this.editor}
              />
            )}
          </div>
        </BuilderContainer>
      </Container>
    )
  }
}

export default Builder
