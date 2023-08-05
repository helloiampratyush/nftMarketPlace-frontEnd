import { gql } from "@apollo/client"
const GET_ACTIVE_ITEMS2 = gql`
    {
        itemBoughts(first: 5) {
            id
            buyer

            nftAddress
            tokenId
        }
    }
`
export default GET_ACTIVE_ITEMS2
