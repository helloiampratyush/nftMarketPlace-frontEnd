import { Form, useNotification, Button, Information } from "web3uikit"
import Head from "next/head"
import { ethers } from "ethers"

import nftAbi from "../constants/basicNft.json"
import networkMapping from "../constants/networkAddress.json"
import marketPlaceAbi from "../constants/nftMarketPlace.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
export default function withdraw() {
    const { chainId, account, isWeb3Enabled } = useMoralis()

    const chainString = chainId ? parseInt(chainId).toString() : "11155111"
    const marketPlaceAddress = networkMapping[chainString].nftMarketPlace[0]
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [proceeds, setProceeds] = useState("0")

    async function handleWithDrawProceed(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "proceed withdrawn",
            title: "withdraw proceed",
            position: "topR",
        })
    }
    async function setupUI() {
        const returnProceed = await runContractFunction({
            params: {
                abi: marketPlaceAbi,
                contractAddress: marketPlaceAddress,
                functionName: "getProceed",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })

        if (returnProceed) {
            setProceeds(returnProceed.toString())
        }
    }
    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])
    return (
        <div>
            <div className=" text-fuchsia-900 my-6 mx-6 text-center text-2xl">
                <Information
                    information={ethers.utils.formatUnits(proceeds, "ether")}
                    topic="Your collection from market place in ETH"
                />
            </div>

            {proceeds != "0" ? (
                <div className="mx-3 p-6">
                    <Button
                        onClick={() => {
                            runContractFunction({
                                params: {
                                    abi: marketPlaceAbi,
                                    contractAddress: marketPlaceAddress,
                                    functionName: "withdrawProceed",
                                    params: {},
                                },
                                onError: (error) => console.log(error),
                                onSuccess: handleWithDrawProceed,
                            })
                        }}
                        text="withDraw"
                        type="button"
                    />
                </div>
            ) : (
                <div className="text-center text-2xl text-red-600">no proceed detected</div>
            )}
        </div>
    )
}
