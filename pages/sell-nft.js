import { Form, useNotification, Button } from "web3uikit"
import Head from "next/head"
import { ethers } from "ethers"

import nftAbi from "../constants/basicNft.json"
import networkMapping from "../constants/networkAddress.json"
import marketPlaceAbi from "../constants/nftMarketPlace.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()

    const chainString = chainId ? parseInt(chainId).toString() : "11155111"
    const marketPlaceAddress = networkMapping[chainString].nftMarketPlace[0]
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [proceeds, setProceeds] = useState("0")
    async function approveAndList(data) {
        console.log("approving")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketPlaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => console.log(error),
        })
    }
    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        await tx.wait(1)
        console.log("now time to list")
        const listOptions = {
            abi: marketPlaceAbi,
            contractAddress: marketPlaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenID: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => console.log(error),
        })
    }
    const handleListSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "item Listed",
            title: "nft Listed",
            position: "topR",
        })
    }

    return (
        <div>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "Nft Address",
                        type: "text",
                        inputWidth: "30%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token Id",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price(In ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell Your NFT"
                id="Main Form"
            />
        </div>
    )
}
