import { useQuery, gql } from "@apollo/client"
const GET_ACTIVE_ITEM = gql`
    {
        itemBoughts(first: 5) {
            id
            buyer

            nftAddress
            tokenId
        }
    }
`
export default function graphExampl() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEM)
    console.log(data)
    return <div>hi</div>
}
