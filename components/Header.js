import { ConnectButton } from "web3uikit";

export default function Header(){
    return(
        <>
            Decentralised 4D application
            <ConnectButton moralisAuth={false}/>
        </>
        
    )
}