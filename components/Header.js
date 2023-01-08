import { ConnectButton } from "web3uikit";

export default function Header(){
    return(
        <nav style={{
            display: "flex",
            borderBottom: "1px solid",
            flexDirection: "row",
            padding: "1.25rem",
            marginBottom: "1rem"
        }}>
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralised 4D application</h1>
            <div style={{
                marginLeft: "auto",
                paddingTop: "1.25rem"
            }}>
                <ConnectButton moralisAuth={false}/>
            </div>
        </nav>
    )
}