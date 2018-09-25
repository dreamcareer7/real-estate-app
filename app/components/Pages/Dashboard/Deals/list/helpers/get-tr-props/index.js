import OpenDeal from '../../../utils/open-deal'
import { grey, primary } from '../../../../../../../views/utils/colors'

export default function(rowIndex, { original: deal }) {
  return {
    onClick: () => OpenDeal(deal.id),
    style: {
      cursor: 'pointer'
    },
    hoverStyle: `
    background-color: ${grey.A100};
     a {
      color: ${primary}
    }
    `
  }
}
