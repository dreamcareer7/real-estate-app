import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory } from 'react-router'

import _ from 'underscore'
import cn from 'classnames'
import moment from 'moment'

import Deal from '../../../../../models/Deal'
import DealContext from '../../../../../models/DealContext'

import Button from '../../../../../views/components/Button/ActionButton'

import PageHeader from './page-header'
import DealType from './deal-type'
import DealSide from './deal-side'
import DealPropertyType from './deal-property-type'
import DealClients from './deal-clients'
import DealAgents from './deal-agents'
import DealReferrals from './deal-referrals'
import DealStatus from './deal-status'
import DealAddress from './deal-address'
import EscrowOfficers from './escrow-officer'
import Contexts from './contexts'
import EnderType from './deal-ender-type'
import Alert from '../../Partials/Alert'
import { confirmation } from '../../../../../store_actions/confirmation'
import {
  createDeal,
  updateContext,
  ejectDraftMode,
  createRoles
} from '../../../../../store_actions/deals'
import OpenDeal from '../utils/open-deal'
import { isBackOffice } from '../../../../../utils/user-teams'

class CreateDeal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      isDraft: true,
      dealSide: '',
      dealPropertyType: '',
      dealAddress: null,
      dealStatus: '',
      enderType: -1,
      contexts: {},
      agents: {},
      sellingAgents: {},
      clients: {},
      sellingClients: {},
      referrals: {},
      escrowOfficers: {},
      submitError: null,
      validationErrors: []
    }

    this.isFormSubmitted = false
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.initializeDeal()
    }
  }

  initializeDeal = async () => {
    const { deal } = this.props

    this.setState({
      isDraft: false,
      dealSide: deal.deal_type,
      dealPropertyType: deal.property_type,
      enderType: Deal.get.field('ender_type') || -1,
      dealStatus: Deal.get.field('listing_status') || '',
      contexts: this.generateContextsFromDeal(deal),
      dealAddress: this.generateAddressFromDeal(deal),
      ...this.generateRolesFromDeal(deal)
    })
  }

  generateRolesFromDeal = deal => {
    const isBuyingDeal = deal.deal_type === 'Buying'

    const roles = {
      agents: {},
      sellingAgents: {},
      clients: {},
      sellingClients: {},
      referrals: {},
      escrowOfficers: {}
    }

    if (!deal.roles) {
      return roles
    }

    deal.roles.forEach(roleId => {
      const roleItem = this.props.roles[roleId]

      if (!roleItem) {
        return false
      }

      const { id, role: roleName } = roleItem

      // dont allow to modify users
      const user = {
        ...roleItem,
        readOnly: true
      }

      if (roleName.includes('Referral')) {
        roles.referrals = {
          ...roles.referrals,
          [id]: user
        }
      }

      if (roleName === 'Title') {
        roles.escrowOfficers = {
          ...roles.escrowOfficers,
          [id]: user
        }
      }

      if (['SellerAgent', 'CoSellerAgent'].includes(roleName)) {
        if (isBuyingDeal) {
          roles.sellingAgents = {
            ...roles.sellingAgents,
            [id]: user
          }
        } else {
          roles.agents = {
            ...roles.agents,
            [id]: user
          }
        }
      }

      if (
        [
          'Seller',
          'SellerPowerOfAttorney',
          'Landlord',
          'LandlordPowerOfAttorney'
        ].includes(roleName)
      ) {
        if (isBuyingDeal) {
          roles.sellingClients = {
            ...roles.sellingClients,
            [id]: user
          }
        } else {
          roles.clients = {
            ...roles.clients,
            [id]: user
          }
        }
      }

      if (['BuyerAgent', 'CoBuyerAgent'].includes(roleName)) {
        roles.agents = {
          ...roles.agents,
          [id]: user
        }
      }

      if (
        [
          'Buyer',
          'BuyerPowerOfAttorney',
          'Tenant',
          'TenantPowerOfAttorney'
        ].includes(roleName)
      ) {
        roles.clients = {
          ...roles.clients,
          [id]: user
        }
      }
    })

    return roles
  }

  generateContextsFromDeal = deal => {
    const contexts = {}

    const dealContexts = _.indexBy(
      this.getDealContexts(deal.deal_type, deal.property_type),
      'name'
    )

    _.each(dealContexts, context => {
      let value = Deal.get.field(deal, context.name)

      if (value !== null && context.data_type === 'Date') {
        value = moment.utc(value * 1000).format()
      }

      contexts[context.name] = value !== null ? value : ''
    })

    return contexts
  }

  generateAddressFromDeal = deal => {
    const address_components = {}

    const fields = [
      'city',
      'postal_code',
      'state',
      'state_code',
      'street_dir_prefix',
      'street_name',
      'street_number',
      'street_suffix',
      'unit_number'
    ]

    fields.forEach(name => {
      address_components[name] = Deal.get.field(deal, name)
    })

    if (_.every(address_components, component => component === null)) {
      return null
    }

    return {
      id: deal.listing,
      address_components,
      image: Deal.get.field(deal, 'photo'),
      type: 'listing'
    }
  }

  /**
   * handle Update or Insert a role
   * roles: agent, sellingAgent, client, sellingClient, referrals, escrowOfficers
   */
  onUpsertRole = (form, type) =>
    this.setState(
      {
        [type]: {
          ...this.state[type],
          [form.id]: form
        }
      },
      () => this.validateForm()
    )

  /**
   * handles remove a role
   */
  onRemoveRole = (id, type) =>
    this.setState(
      {
        [type]: _.omit(this.state[type], role => role.id === id)
      },
      () => this.validateForm()
    )

  /**
   * handles create an mls or manual address
   */
  onCreateAddress = component =>
    this.setState({ dealAddress: component }, () => this.validateForm())

  /**
   * validate form
   */
  validateForm = () => {
    const validationErrors = []

    _.each(this.Validators, (item, name) => {
      if (item.validator() === true) {
        return true
      }

      validationErrors.push(name)
    })

    this.setState({
      validationErrors
    })

    return validationErrors.length === 0
  }

  /**
   * returns list of validators
   */
  get Validators() {
    const {
      isDraft,
      dealSide,
      dealPropertyType,
      dealAddress,
      contexts,
      dealStatus,
      agents,
      sellingAgents,
      clients,
      sellingClients,
      escrowOfficers
    } = this.state

    const validations = {
      side: {
        validator: () => dealSide.length > 0
      },
      property_type: {
        validator: () => dealPropertyType.length > 0
      },
      status: {
        validator: () => (dealSide === 'Buying' ? dealStatus.length > 0 : true)
      },
      address: {
        validator: () => dealAddress !== null
      },
      selling_agents: {
        // on Buying side, user should add SellerAgent
        validator: () =>
          dealSide === 'Buying' ? _.size(sellingAgents) > 0 : true
      },
      selling_clients: {
        // on Buying side, user should add SellerClient
        validator: () =>
          dealSide === 'Buying' ? _.size(sellingClients) > 0 : true
      },
      escrow_officer: {
        validator: () => {
          if (dealPropertyType && dealPropertyType.includes('Lease')) {
            return true
          }

          return dealSide === 'Buying' ? _.size(escrowOfficers) > 0 : true
        }
      },
      agents: {
        validator: () =>
          dealSide === 'Buying'
            ? !!_.find(agents, agent => agent.role === 'BuyerAgent')
            : !!_.find(agents, agent => agent.role === 'SellerAgent')
      },
      clients: {
        validator: () => _.size(clients) > 0
      },
      contexts: {
        validator: () =>
          DealContext.validateList(contexts, dealSide, dealPropertyType)
      }
    }

    // only Side and PropertyType are required when deal type is Draft
    if (isDraft) {
      return {
        side: validations.side,
        property_type: validations.property_type
      }
    }

    return validations
  }

  onClosePage = () =>
    this.props.confirmation({
      message: 'Cancel deal creation?',
      description: 'By canceling you will lose your work.',
      confirmLabel: 'Yes, cancel',
      cancelLabel: 'No, don\'t cancel',
      onConfirm: () => browserHistory.push('/dashboard/deals')
    })

  /**
   * when user tries to change deal side, we should show a confirmation modal
   */
  requestChangeDealSide = nextDealSide => {
    const { dealSide } = this.state

    if (dealSide === nextDealSide) {
      return false
    }

    const showConfirmation = [
      'agents',
      'sellingAgents',
      'clients',
      'sellingClients',
      'referrals',
      'escrowOfficers'
    ].some(name => _.size(this.state[name]) > 0)

    if (showConfirmation) {
      return this.props.confirmation({
        message: 'Changing deal side will remove all contacts.',
        confirmLabel: 'Okay, Continue',
        onConfirm: () => this.changeDealSide(nextDealSide)
      })
    }

    this.changeDealSide(nextDealSide)
  }

  /**
   * handles change deal type
   */
  changeDealType = isDraft =>
    this.setState({
      isDraft
    })

  /**
   * handles changing deal side
   * when deal side changes, we should reset roles and ender_type
   */
  changeDealSide = dealSide =>
    this.setState(
      {
        dealSide,
        dealStatus: '',
        agents: {},
        clients: {},
        referrals: {},
        sellingClients: {},
        sellingAgents: {},
        escrowOfficers: {},
        enderType: -1,
        contexts: this.getDefaultContextValues(
          dealSide,
          this.state.dealPropertyType
        )
      },
      () => this.validateForm()
    )

  /**
   * handles change deal property type
   */
  changePropertyType = dealPropertyType =>
    this.setState({
      dealPropertyType,
      dealStatus: '',
      contexts: this.getDefaultContextValues(
        this.state.dealSide,
        dealPropertyType
      ),
      escrowOfficers: {}
    })

  /**
   * handles deal status change
   */
  changeDealStatus = status =>
    this.setState({ dealStatus: status }, () => this.validateForm())

  /**
   * handles deal contexts change
   */
  changeContext = (field, value) =>
    this.setState(
      {
        contexts: {
          ...this.state.contexts,
          [field]: value
        }
      },
      () => this.validateForm()
    )

  /**
   * handles deal ender_type context change
   */
  changeEnderType = enderType => this.setState({ enderType })

  /**
   * check an specific field has error or not
   */
  hasError = field => {
    const { validationErrors } = this.state

    return this.isFormSubmitted && validationErrors.includes(field)
  }

  /**
   * creates deal
   */
  createDeal = async () => {
    this.isFormSubmitted = true

    if (!this.validateForm(true)) {
      return false
    }

    const { isDraft } = this.state
    const { user, createDeal } = this.props

    if (this.props.deal) {
      return this.updateDeal()
    }

    // show loading
    this.setState({ saving: true })

    const dealObject = {
      ...this.createDealObject(),
      is_draft: isDraft
    }

    try {
      // create deal
      const deal = await Deal.create(user, dealObject)

      // dispatch new deal
      await createDeal(deal)
      this.setState({ saving: false })

      return OpenDeal(deal.id)
    } catch (e) {
      console.log(e)
      this.setState({
        saving: false,
        submitError: true
      })
    }
  }

  /**
   * updates deal
   */
  updateDeal = async () => {
    const { id: dealId } = this.props.deal
    const newRoles = _.filter(this.Roles, role => !role.deal)
    const contexts = this.createDealObject().deal_context

    this.setState({ saving: true })

    try {
      await this.props.createRoles(dealId, newRoles)

      // create/update contexts
      await this.props.updateContext(dealId, contexts)

      await this.props.ejectDraftMode(dealId)

      return OpenDeal(dealId)
    } catch (e) {
      console.log(e)
      this.setState({
        saving: false,
        submitError: true
      })
    }
  }

  /**
   * create the deal object
   */
  createDealObject = () => {
    const {
      contexts,
      dealSide,
      dealPropertyType,
      dealAddress,
      dealStatus,
      enderType
    } = this.state
    const isBuyingDeal = dealSide === 'Buying'

    const dealObject = {
      property_type: dealPropertyType,
      deal_type: dealSide,
      roles: this.Roles,
      deal_context: {
        ...contexts,
        listing_status: isBuyingDeal ? dealStatus : this.getDefaultStatus()
      }
    }

    if (enderType !== -1) {
      dealObject.deal_context.ender_type = enderType
    }

    if (dealAddress) {
      if (dealAddress.id) {
        dealObject.listing = dealAddress.id
      } else {
        dealObject.deal_context = {
          ...dealObject.deal_context,
          ...this.getAddressContext()
        }
      }
    }

    return {
      ...dealObject,
      deal_context: this.createContextsObject(dealObject.deal_context)
    }
  }

  /**
   * get deal status based selected property type
   */
  getDefaultStatus = () => {
    const { dealPropertyType } = this.state

    return dealPropertyType.includes('Lease') ? 'Lease' : 'Active'
  }

  /**
   * create context object
   */
  createContextsObject = contexts => {
    const { dealSide, dealPropertyType } = this.state
    const contextsObject = {}
    const { isBackOffice } = this.props
    const dealContexts = _.indexBy(
      this.getDealContexts(dealSide, dealPropertyType),
      'name'
    )

    _.each(contexts, (value, name) => {
      if (_.isUndefined(value) || value === null || value.length === 0) {
        return false
      }

      const needsApproval = dealContexts[name]
        ? dealContexts[name].needs_approval
        : false
      const approved = isBackOffice ? true : !needsApproval

      contextsObject[name] = { value, approved }
    })

    return contextsObject
  }

  /**
   * create standard address context when user enters manual address
   */
  getAddressContext = () => {
    const { dealAddress } = this.state
    const address = dealAddress.address_components
    const {
      street_number,
      street_name,
      city,
      state,
      unit_number,
      postal_code,
      full_address
    } = address

    return {
      full_address,
      street_number,
      unit_number,
      city,
      state,
      street_name,
      postal_code
    }
  }

  /**
   * get context for deal side (Buying or Selling)
   */
  getDealContexts = (dealSide, dealPropertyType) => {
    if (dealSide.length === 0 || dealPropertyType.length === 0) {
      return []
    }

    return DealContext.getItems(dealSide, dealPropertyType)
  }

  /**
   * get default context values
   */
  getDefaultContextValues = (dealSide, dealPropertyType) => {
    const list = this.getDealContexts(dealSide, dealPropertyType)
    const defaultValues = {}

    list.forEach(context => {
      if (!_.isUndefined(context.default_value)) {
        defaultValues[context.name] = context.default_value
      }
    })

    return defaultValues
  }

  /**
   * check commission is required or not
   */
  get IsDoubleEnded() {
    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(
      this.state.enderType
    )
  }

  /**
   * flatten all entered roles
   */
  get Roles() {
    const {
      agents,
      clients,
      sellingAgents,
      sellingClients,
      referrals,
      escrowOfficers
    } = this.state

    const roles = []

    _.each(clients, client => roles.push(_.omit(client, ['id', 'contact'])))
    _.each(sellingClients, client =>
      roles.push(_.omit(client, ['id', 'contact']))
    )

    _.each(agents, agent => roles.push(_.omit(agent, ['id', 'contact'])))
    _.each(sellingAgents, agent => roles.push(_.omit(agent, ['id', 'contact'])))

    _.each(referrals, referral =>
      roles.push(_.omit(referral, ['id', 'contact']))
    )
    _.each(escrowOfficers, officer =>
      roles.push(_.omit(officer, ['id', 'contact']))
    )

    return roles
  }

  render() {
    const { deal } = this.props

    const {
      saving,
      isDraft,
      dealSide,
      dealStatus,
      dealPropertyType,
      dealAddress,
      contexts,
      escrowOfficers,
      agents,
      sellingAgents,
      clients,
      sellingClients,
      referrals,
      enderType,
      submitError,
      validationErrors
    } = this.state

    const dealContexts = this.getDealContexts(dealSide, dealPropertyType)
    const isLeaseDeal = dealPropertyType && dealPropertyType.includes('Lease')
    const canCreateDeal =
      !saving && dealSide.length > 0 && dealPropertyType.length > 0

    return (
      <div className="deal-create">
        <PageHeader
          title={deal ? 'Go Live' : 'Create New Deal'}
          handleOnClose={this.onClosePage}
        />

        <div className="form">
          <div className="swoosh">Swoosh! Another one in the bag.</div>

          {!deal && (
            <Fragment>
              <DealType
                isDraft={isDraft}
                onChangeDealType={this.changeDealType}
              />
              <DealSide
                selectedSide={dealSide}
                onChangeDealSide={this.requestChangeDealSide}
              />

              <DealPropertyType
                selectedType={dealPropertyType}
                onChangeDealType={this.changePropertyType}
              />
            </Fragment>
          )}

          {dealSide.length > 0 &&
            dealPropertyType.length > 0 && (
              <div>
                <DealClients
                  hasError={this.hasError('clients')}
                  dealSide={dealSide}
                  clients={clients}
                  onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                  onRemoveClient={id => this.onRemoveRole(id, 'clients')}
                />

                <DealReferrals
                  dealSide={dealSide}
                  referrals={referrals}
                  onUpsertReferral={form =>
                    this.onUpsertRole(form, 'referrals')
                  }
                  onRemoveReferral={id => this.onRemoveRole(id, 'referrals')}
                />

                <DealAgents
                  hasError={this.hasError('agents')}
                  scenario="CreateDeal"
                  dealSide={dealSide}
                  agents={agents}
                  dealEnderType={enderType}
                  isDoubleEnded={this.IsDoubleEnded}
                  onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                  onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
                />

                {dealSide === 'Buying' && (
                  <Fragment>
                    <EnderType
                      isRequired={false}
                      enderType={enderType}
                      showAgentDoubleEnder={false}
                      onChangeEnderType={this.changeEnderType}
                    />

                    <DealAgents
                      hasError={this.hasError('selling_agents')}
                      scenario="CreateDeal"
                      dealSide={dealSide}
                      showDealSideAs="Selling"
                      agents={sellingAgents}
                      isCommissionRequired={this.IsDoubleEnded}
                      isDoubleEnded={this.IsDoubleEnded}
                      dealEnderType={enderType}
                      onUpsertAgent={form =>
                        this.onUpsertRole(form, 'sellingAgents')
                      }
                      onRemoveAgent={id =>
                        this.onRemoveRole(id, 'sellingAgents')
                      }
                    />

                    <DealClients
                      hasError={this.hasError('selling_clients')}
                      dealSide="Selling"
                      clients={sellingClients}
                      title="Seller (Landlord)"
                      onUpsertClient={form =>
                        this.onUpsertRole(form, 'sellingClients')
                      }
                      onRemoveClient={id =>
                        this.onRemoveRole(id, 'sellingClients')
                      }
                    />

                    {!isLeaseDeal && (
                      <EscrowOfficers
                        hasError={this.hasError('escrow_officer')}
                        escrowOfficers={escrowOfficers}
                        onUpsertEscrowOfficer={form =>
                          this.onUpsertRole(form, 'escrowOfficers')
                        }
                        onRemoveEscrowOfficer={id =>
                          this.onRemoveRole(id, 'escrowOfficers')
                        }
                      />
                    )}

                    <DealStatus
                      hasError={this.hasError('status')}
                      property_type={dealPropertyType}
                      dealStatus={dealStatus}
                      onChangeDealStatus={this.changeDealStatus}
                    />
                  </Fragment>
                )}

                <DealAddress
                  hasError={this.hasError('address')}
                  dealAddress={dealAddress}
                  dealSide={dealSide}
                  onCreateAddress={(component, type) =>
                    this.onCreateAddress(component, type)
                  }
                  onRemoveAddress={() => this.setState({ dealAddress: null })}
                />

                {dealContexts.length > 0 && (
                  <Contexts
                    hasError={this.hasError('contexts')}
                    contexts={contexts}
                    onChangeContext={(field, value) =>
                      this.changeContext(field, value)
                    }
                    fields={dealContexts}
                  />
                )}
              </div>
            )}
        </div>

        <div className="actions">
          {!saving &&
            submitError && (
              <Alert
                code={500}
                type="error"
                style={{ float: 'left', marginBottom: '2rem' }}
              />
            )}

          <Button
            className={cn('create-deal-button', {
              disabled: !canCreateDeal
            })}
            onClick={() => this.createDeal()}
            disabled={!canCreateDeal}
          >
            {saving ? 'Creating ...' : 'Create Deal'}
          </Button>

          <div className="error-summary">
            {this.isFormSubmitted &&
              validationErrors.length > 0 && (
                <span>
                  {validationErrors.length} required fields remaining to
                  complete.
                </span>
              )}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ user, deals }, { params }) {
  return {
    user,
    confirmation,
    deal: params.id && deals.list && deals.list[params.id],
    roles: params.id && deals.roles,
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  {
    confirmation,
    createDeal,
    updateContext,
    ejectDraftMode,
    createRoles,
    notify
  }
)(CreateDeal)
