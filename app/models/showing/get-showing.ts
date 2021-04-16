import Fetch from 'services/fetch'

async function getShowing(showingId: UUID) {
  return (
    await new Fetch().get(
      `/showings/${showingId}?associations[]=showing.listing&associations[]=showing.deal`
    )
  ).body.data as IShowing
}

export default getShowing
