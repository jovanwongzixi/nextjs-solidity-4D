import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { abi, contractAddress } from "../constants/constants"
import { ethers } from "ethers"

export default function Enter4D(){

    const [ formData, setFormData ] = useState({
        _4DNumber: "0000",
        betAmount: "0.01",
    })
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const address = chainId in contractAddress ? contractAddress[chainId][0] : null

    //enter4D function
    const { runContractFunction : enter4D, isLoading: enter4DLoading, isFetching: enter4DFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: address,
        functionName:"enter4D",
        params: {
            number: parseInt(formData._4DNumber)
        },
        msgValue: ethers.utils.parseEther(formData.betAmount),
    })
    
    // send winnings function
    const { runContractFunction: sendWinnings, isLoading: sendWinningsLoading, isFetching: sendWinningsFetching  } = useWeb3Contract({
        abi: abi,
        contractAddress: address,
        functionName:"sendWinnings",
        params: {},
    })

    const dispatch = useNotification()

    // useEffect(()=>{
    //     if(isWeb3Enabled){
    //         enter4D()
    //         .then()
    //     }
    // } , [isWeb3Enabled])

    useEffect(()=>{
        // async function testConnect(){
        //     console.log("checking connection status")   
        //     // let provider = new ethers.providers.Web3Provider(window.ethereum);
        //     // let accounts = await provider.send("eth_requestAccounts",[])
        //     // console.log(accounts.length)
        //     // const accounts = await window.ethereum.request({method: 'eth_accounts'})[0] || false;
        //     // console.log(accounts)
        // }
        // testConnect()
        // console.log("checking connection status")   
        console.log(account)
    }, [isWeb3Enabled])
    function handleFormData(event){
        const { name, value } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value,
            }
        })
    }

    function handleAccountNotConnectedNotification(){
        dispatch({
            type: "error",
            message: "Please connect an account!",
            title: "No Account Connected!",
            position: "topR",
            icon: "bell"
        }) 
    }
    function handleEnter4DSuccessNotification(){
        dispatch({
            type: "success",
            message: "4D entered!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell"
        })
    }
    
    function handleSendWinningsSuccessNotification(){
        dispatch({
            type: "success",
            message: "Winnings sent!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell"
        })
    }

    function handleSendWinningsFailureNotification(){
        dispatch({
            type: "error",
            message: "No winnings to be sent!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell"
        })
    }

    const handleEnter4DSuccess = async (tx) => {
        try{
            await tx.wait(1)
            handleEnter4DSuccessNotification()
        } catch(e){
            console.log(e)
        }
    }

    const handleSendWinningsSuccess = async (tx) => {
        try{
            await tx.wait(1)
            handleSendWinningsSuccessNotification()
        } catch(e){

        }
    }

    return(
        <main>
            <form onSubmit={async (event) => {
                event.preventDefault()
                if(!account){
                    handleAccountNotConnectedNotification()
                    return
                }
                await enter4D({
                    onSuccess: handleEnter4DSuccess,
                    onError:(error) => console.log(error)
                })
            }}>
                <input 
                    type="text"
                    placeholder="4D Number (eg. 1111)"
                    value={formData._4DNumber}
                    name="_4DNumber"
                    onChange ={handleFormData}
                />
                <input
                    type="text"
                    placeholder="Bet Amount (ETH)"
                    value={formData.betAmount}
                    name="betAmount"
                    onChange ={handleFormData}
                />
                <button
                    disabled={enter4DLoading || enter4DFetching}
                >{enter4DLoading || enter4DFetching ? <div>Entering 4D...</div> : <div>Enter 4D</div>}</button>
            </form>
            <button 
                onClick={async () => {
                    if(!account){
                        handleAccountNotConnectedNotification()
                        return
                    }
                    await sendWinnings({
                        onSuccess: handleSendWinningsSuccess,
                        onError: (error) => {
                            handleSendWinningsFailureNotification()
                            console.log(error)
                        }
                    })
                }}
                disabled={sendWinningsLoading || sendWinningsFetching}
            >{sendWinningsLoading || sendWinningsFetching ? <div>Checking for winnings...</div> : <div>Check Winnings</div>}</button>
        </main>
    )
}