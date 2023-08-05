import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import NFTBox2 from "../components/NFTBox2"
import networkMapping from "../constants/networkAddress.json"
import GET_ACTIVE_ITEMS2 from "../constants/subgraphQueries2"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { chainId, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "11155111"
    const marketplaceAddress = networkMapping[chainString].nftMarketPlace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS2)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">YOUR NFT</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled && chainId ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.itemBoughts.map((nft) => {
                            const { nftAddress, tokenId, buyer } = nft
                            return marketplaceAddress ? (
                                <NFTBox2
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketPlaceAddress={marketplaceAddress}
                                    buyer={buyer}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div>Network error, please switch to a supported network. </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
