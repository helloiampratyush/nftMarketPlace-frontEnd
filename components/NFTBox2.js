import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftAbi from "../constants/basicNft2.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"

export default function NFTBox2({ nftAddress, tokenId, marketPlaceAddress, buyer }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("") // Properly destructured useState
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    async function updateUI() {
        const tokenURI = await getTokenURI()

        if (tokenURI) {
            const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestUrl)).json()
            const imageURI = tokenURIResponse.image
            const imageURIUrl = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIUrl)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedBySeller = buyer === account

    // Rendering the UI
    return (
        <div className="mx-6">
            {imageURI && isOwnedBySeller ? (
                <Card title={tokenName} description={tokenDescription}>
                    <div className="p-2">
                        <div className="flex flex-col items-end gap-2">
                            <div>#{tokenId}</div>

                            <div className="text-red-500">
                                {" "}
                                WATCH CONSOLE{console.log(nftAddress)}
                            </div>

                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                height="200"
                                width="200"
                            />
                        </div>
                    </div>
                </Card>
            ) : (
                <div></div>
            )}
        </div>
    )
}
