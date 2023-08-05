import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center bg-gray-500">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT MARKETPLACE</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6 hover:text-slate-100 focus:ring focus:ring-violet-300 hover:bg-sky-700 active:bg-violet-700 ">
                        HOME
                    </a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-4 p-6  hover:text-slate-100 focus:ring focus:ring-violet-300 hover:bg-sky-700 active:bg-violet-700">
                        SELL
                    </a>
                </Link>
                <Link href="/withdraw">
                    <a className="mr-4 p-6  hover:text-slate-100 focus:ring focus:ring-violet-300 hover:bg-sky-700 active:bg-violet-700">
                        WITHDRAW
                    </a>
                </Link>
                <Link href="/yourNft">
                    <a className="mr-4 p-6  hover:text-slate-100 focus:ring focus:ring-violet-300 hover:bg-sky-700 active:bg-violet-700">
                        YOUR NFT
                    </a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
