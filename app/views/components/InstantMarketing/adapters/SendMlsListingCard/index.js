import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'
import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { selectContact } from 'reducers/contacts/list'

import SearchListingDrawer from 'components/SearchListingDrawer'
import EmailCompose from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import { getTemplatePreviewImage } from 'components/InstantMarketing/helpers/get-template-preview-image'
import ActionButton from 'components/Button/ActionButton'
import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import { convertRecipientsToEmails } from '../../helpers/convert-recipients-to-emails'

import { getMlsDrawerInitialDeals } from '../../helpers/get-mls-drawer-initial-deals'

import { getTemplateTypes } from '../../helpers/get-template-types'
import SocialDrawer from '../../components/SocialDrawer'

class SendMlsListingCard extends React.Component {
  state = {
    listings: [],
    isListingsModalOpen: false,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false,
    isSendingEmail: false,
    isSocialDrawerOpen: false,
    htmlTemplate: '',
    templateScreenshot: null,
    owner: this.props.user
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isTriggered != null) {
      // For Opening Search Drawer
      if (
        props.isTriggered &&
        !state.isListingsModalOpen &&
        !state.isInstantMarketingBuilderOpen
      ) {
        return {
          isListingsModalOpen: true
        }
      }

      // For just closing search drawer through its close CTA
      if (!props.isTriggered && state.isListingsModalOpen) {
        return {
          isListingsModalOpen: false
        }
      }

      // For Closing Search Drawer after selecting a contact
      if (
        !props.isTriggered &&
        state.isListingsModalOpen &&
        state.isInstantMarketingBuilderOpen
      ) {
        return {
          isListingsModalOpen: false
        }
      }
    }

    return state
  }

  get Recipients() {
    return this.props.selectedRows
      ? this.props.selectedRows
          .map(id => {
            const contact = selectContact(this.props.contacts, id)

            if (!contact || !contact.summary.email) {
              return null
            }

            const emails = getContactAttribute(
              contact,
              selectDefinitionByName(this.props.attributeDefs, 'email')
            )

            return {
              contactId: contact.id,
              name: contact.summary.display_name,
              avatar: contact.summary.profile_image_url,
              email: contact.summary.email,
              emails: emails.map(email => email.text)
            }
          })
          .filter(recipient => recipient !== null)
      : []
  }

  handleSendEmails = async (values, form) => {
    this.setState({
      isSendingEmail: true
    })

    const emails = convertRecipientsToEmails(
      values.recipients,
      values.subject,
      this.state.htmlTemplate.result
    )

    try {
      await sendContactsEmail(emails)

      // reset form
      if (form) {
        form.reset()
      }

      this.props.notify({
        status: 'success',
        message: `${emails.length} emails has been sent to your contacts`
      })
    } catch (e) {
      console.log(e)
      // todo
    } finally {
      this.setState({
        isSendingEmail: false,
        isComposeEmailOpen: false,
        isInstantMarketingBuilderOpen: false
      })
    }
  }

  openListingModal = () => this.setState({ isListingsModalOpen: true })

  closeListingModal = () =>
    this.setState({ isListingsModalOpen: false }, this.props.handleTrigger)

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  onSelectListings = async listings =>
    this.setState(
      {
        listings,
        isListingsModalOpen: false,
        isInstantMarketingBuilderOpen: true
      },
      this.props.handleTrigger
    )

  handleSaveMarketingCard = async (template, owner) => {
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template,
      templateScreenshot: null
    })
  }

  handleSocialSharing = template => {
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true
    })
  }

  generatePreviewImage = async template =>
    this.setState({
      templateScreenshot: await getTemplatePreviewImage(
        template,
        this.TemplateInstanceData
      )
    })

  closeMarketing = () =>
    this.setState({
      isInstantMarketingBuilderOpen: false,
      isComposeEmailOpen: false
    })

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  get TemplateInstanceData() {
    return {
      listings: [this.state.listings.map(listing => listing.id)]
    }
  }

  get IsMultiListing() {
    return true
  }

  render() {
    const { listings } = this.state
    const { user, selectedTemplate } = this.props

    if (hasMarketingAccess(user) === false) {
      return false
    }

    console.log(this.props)

    return (
      <Fragment>
        {!this.props.hasExternalTrigger && (
          <ActionButton
            appearance="outline"
            onClick={this.openListingModal}
            size="small"
          >
            {this.props.children}
          </ActionButton>
        )}

        <SearchListingDrawer
          isOpen={this.state.isListingsModalOpen}
          title={this.IsMultiListing ? 'Select Listings' : 'Select a Listing'}
          searchPlaceholder="Enter MLS# or an address"
          initialList={getMlsDrawerInitialDeals(this.props.deals)}
          onClose={this.closeListingModal}
          onSelectListings={this.onSelectListings}
          multipleSelection={this.IsMultiListing}
        />

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.closeMarketing}
          handleSave={this.handleSaveMarketingCard}
          handleSocialSharing={this.handleSocialSharing}
          templateData={{ listings, user }}
          templateTypes={
            selectedTemplate
              ? [selectedTemplate.template_type]
              : getTemplateTypes(listings)
          }
          assets={listings}
          mediums={this.props.mediums}
          defaultTemplate={selectedTemplate}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            from={this.state.owner}
            onClose={this.toggleComposeEmail}
            recipients={this.Recipients}
            html={this.state.templateScreenshot}
            onClickSend={this.handleSendEmails}
            isSubmitting={this.state.isSendingEmail}
          />
        )}

        {this.state.isSocialDrawerOpen && (
          <SocialDrawer
            template={this.state.htmlTemplate}
            templateInstanceData={this.TemplateInstanceData}
            onClose={this.closeSocialDrawer}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ contacts, deals, user }) {
  return {
    contacts: contacts.list,
    deals: deals.list,
    attributeDefs: contacts.attributeDefs,
    user
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(SendMlsListingCard)
