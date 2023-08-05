import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import marketPlaceAbi from "../constants/nftMarketPlace.json"

import { ethers } from "ethers"
export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketPlaceAddress,
    onClose,
}) {
    const [priceUpdate, setPriceUpdte] = useState(0)
    const dispatch = useNotification()
    const { runContractFunction: updateItem } = useWeb3Contract({
        abi: marketPlaceAbi,
        contractAddress: marketPlaceAddress,
        functionName: "updateItem",
        params: {
            nftAddress: nftAddress,
            tokenID: tokenId,
            newPrice: ethers.utils.parseEther(`${priceUpdate}`),
        },
    })
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "listing update",
            position: "topR",
        })
        onClose && onClose()
        setPriceUpdte("0")
    }
    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateItem({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleSuccess,
                })
            }}
        >
            <Input
                label="update listing price in eth"
                name="new listing price"
                type="decimal"
                onChange={(event) => {
                    setPriceUpdte(event.target.value)
                }}
            />
        </Modal>
    )
}
