import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftAbi from "../constants/basicNft2.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import marketPlaceAbi from "../constants/nftMarketPlace.json"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, tokenId, marketPlaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("") // Properly destructured useState
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => {
        setShowModal(false)
    }
    const dispatch = useNotification()
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: marketPlaceAbi,
        contractAddress: marketPlaceAddress,
        msgValue: price,
        functionName: "buyItem",
        params: {
            nftAddress: nftAddress,
            tokenID: tokenId,
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

    const isOwnedBySeller = seller === account || seller === undefined
    const formatedSellerAddress = isOwnedBySeller ? "you" : truncateStr(seller || "", 15)
    const handleClick = () => {
        isOwnedBySeller
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }
    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "item has been bought",
            title: "item bought",
            position: "topR",
        })
    }
    // Rendering the UI
    return (
        <div className="mx-6">
            {imageURI ? (
                <div>
                    <UpdateListingModal
                        isVisible={showModal}
                        tokenId={tokenId}
                        nftAddress={nftAddress}
                        marketPlaceAddress={marketPlaceAddress}
                        onClose={hideModal}
                    />
                    <Card title={tokenName} description={tokenDescription} onClick={handleClick}>
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="itallic text-sm">
                                    {" "}
                                    owned by {formatedSellerAddress}
                                </div>
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    height="200"
                                    width="200"
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div>loading......</div>
            )}
        </div>
    )
}
