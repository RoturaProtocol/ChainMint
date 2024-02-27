'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { LedgerClientFactory } from '@signumjs/core';
import { GenericExtensionWallet } from '@signumjs/wallets';
const { generateMasterKeys } = require("@signumjs/crypto");

declare global {
    interface Window {
        wallet: any,
        signumLedger: any,
        nostr: any,
    }
}
let signumLedger: any = null;
const recipientId = "17623970032651210826"
let feeType = ['Minimum', 'Cheap', 'Standard', 'Priority'];

export default function Details() {
    const [userDetails, setUserDetails] = useState<any>('');
    const [userData, setUserData] = useState<any>('');
    const [userMsg, setUserMsg] = useState<string>('');
    const [transactionDetails, setTransactionDetails] = useState<any>('');
    const [alertErrorMessage, setAlertErrorMessage] = useState<any>('');
    const buttonRef = useRef<HTMLButtonElement>(null);

    (window as any).wallet = new GenericExtensionWallet();

    (window as any).signumLedger = null;
    let walletListener: any = null;

    function createLedgerClient(nodeHost: string) {
        console.log('Create Ledger called')
        signumLedger = LedgerClientFactory.createClient({
            nodeHost
        });
    }

    // for better encapsulation, it's not the worst idea to dispatch global events
    function propagateWalletEvent(action: string, data: any = {}) {
        window.dispatchEvent(new CustomEvent('wallet-event', {
            detail: {
                action,
                payload: { ...data }
            }
        }));
    }

    // We need to listen to network changes...
    function onNetworkChange(args: any) {
        propagateWalletEvent('networkChanged');
        // check if we are still within the same network
        console.log('args', args)
        if (args.networkName === 'Signum-TESTNET') {
            if (!(window as any).wallet.connection) {
                connectWallet();
            } else {
                createLedgerClient(args.nodeHost);
            }
        } else {
            alert("Wallet changed to another network - Disconnect wallet");
            disconnectWallet();
        }
    }

    function onAccountChange() {
        propagateWalletEvent('accountChanged');
    }

    function onPermissionOrAccountRemoval() {
        // it's possible that the user revokes the DApps permission
        // we need to disconnect the wallet then
        propagateWalletEvent('permissionRemoved');
        alert("Wallet removed this DApps permission");
        disconnectWallet();
    }

    async function connectWallet() {
        // if ((window as any).wallet.connection) return;
        try {
            // connecting the wallet is easy
            const connection = await (window as any).wallet.connect({
                appName: 'SignumJS XT Wallet Demo',
                networkName: 'Signum-TESTNET'
            });
            // const connection = await (window as any).wallet.connect();
            setUserData(connection)
            if (walletListener) {
                walletListener.unlisten();
            }

            walletListener = connection.listen({
                onNetworkChanged: onNetworkChange,
                onAccountChanged: onAccountChange,
                onPermissionRemoved: onPermissionOrAccountRemoval,
                onAccountRemoved: onPermissionOrAccountRemoval,
            });
            console.log('connection.currentNodeHost', connection.currentNodeHost)
            createLedgerClient(connection.currentNodeHost);
            propagateWalletEvent('connected');

        } catch (error: any) {
            console.log('connecting walleterror', error)
            if (error?.name === 'InvalidNetworkError') {
                let errorMsg = 'The selected network of the wallet does not match the applications required network'
                alert(errorMsg);
                setAlertErrorMessage(errorMsg);
                return;
            } if (error?.name === 'NotFoundWalletError') {
                alert(error?.message);
                setAlertErrorMessage(error?.message);
                return;
            }
        }
    }

    async function disconnectWallet() {
        // when disconnecting, we should make tabula rasa and reinstantiate the wallet instance.
        (window as any).wallet = new GenericExtensionWallet();
        (window as any).signumLedger = null;
        // DO NOT FORGET TO UNLISTEN THE LISTENERS!
        walletListener.unlisten();
        propagateWalletEvent('disconnected');
    }

    useEffect(() => {
        const walletDetail = async () => {
            try {
                await connectWallet();
            } catch (error) {
                console.log('There was a problem with wallet connect:', error);
            }
        };

        walletDetail();
    }, []);

    useEffect(() => {
        const getUserAddress = async () => {
            try {

                if (userData?.accountId) {
                    const response = await axios.get(`https://europe3.testnet.signum.network/api?requestType=getAccount&account=${userData?.accountId}`);
                    console.log('Account Response: ', response?.data)
                    if (response?.data?.errorCode === 5) {
                        setAlertErrorMessage(response?.data?.errorDescription);
                        return;
                    } else {
                        setUserDetails(response?.data);
                    }
                }
            } catch (error: any) {
                console.log('account error',error)
                if (error?.name === 'AxiosError') {
                    return alert(error?.message);
                }
            }
        };

        getUserAddress();
    }, [userData]);

    const handleInscribe = async () => {
        if (!userMsg) {
            return alert('Please enter message');
        }
        if (buttonRef.current) {
            buttonRef.current.disabled = true; // Disable the button
        }
        try {
            //TODO: Need to remove: before we can send we need to get the private signing key from the user
            // const {publicKey, signPrivateKey} = generateMasterKeys(userDetails.publicKey)

            // as a next step, we use the systems fee suggestion mechanism to give us the current costs for the chosen
            // fee type. In this example we let it flexible, but you can fix the fee costs to a minimum, i.e. 0,00735 SIGNA
            const suggestedFees = await signumLedger.network.getSuggestedFees()

            // we assume that the feeType is either 
            const selectedFeePlanck = suggestedFees[feeType[1].toLowerCase()]

            // Now, we execute the transaction
            // within the method the local signing flow is being executed, i.e.
            // the private key is used only locally for signing, but never sent over the network

            const { unsignedTransactionBytes } = await signumLedger.message.sendMessage({
                recipientId,
                message: userMsg,
                messageIsText: true,
                feePlanck: selectedFeePlanck,
                // senderPrivateKey: signPrivateKey,
                senderPublicKey: userDetails?.publicKey
            });

            const connection = await (window as any).wallet.connect({
                appName: 'SignumJS XT Wallet Demo',
                networkName: 'Signum-TESTNET'
            });

            const transaction = await (window as any).wallet.confirm(unsignedTransactionBytes)
            console.log('transaction', transaction)
            if (transaction) {
                setTransactionDetails(transaction)
                setUserMsg("")
                if (buttonRef.current) {
                    buttonRef.current.disabled = false; // Enable the button after transaction
                }
            }
        } catch (error: any) {
            console.log('Error',error)
            if (buttonRef.current) {
                buttonRef.current.disabled = false; // Enable the button
            }
            if (error?.name === 'NotGrantedWalletError') {
                return alert('Permission to access the wallet was not granted. Please grant permission and try again.');
            } else if(error.name === 'Error' && alertErrorMessage === ''){
                return alert('Unable to connect to the network. Please select another network or verify your internet connection.');
            }else {
              
                return alert(alertErrorMessage);
            }
        }
    };

    return (
        <section className='w-full mb-0'>
            <div className='container mx-auto px-4'>
                <div className="flex justify-center items-center flex-wrap flex-col gap-4 mt-[30px] mb-5">
                    <div className='shadow-2xl'>
                        <input className="shadow rounded w-full sm:w-[700px] py-2 px-3" id="inputValue" type="text" value={userMsg} onChange={(e) => { setUserMsg(e?.target?.value) }} placeholder='Please enter message' />
                    </div>
                    <div className="flex gap-4 w-full sm:w-[700px] flex-wrap sm:justify-between sm:flex-nowrap">
                        <button className="w-full gap-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-2 rounded" type="button"
                            ref={buttonRef}
                            onClick={handleInscribe}
                        >
                            Inscribe Button
                        </button>
                        <button className="w-full gap-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-2 rounded" type="button">
                            Query Button
                        </button>
                    </div>

                    {userDetails?.accountRS &&
                        <div>
                            <p>Address: {userDetails?.accountRS}</p>
                        </div>
                    }
                    {transactionDetails && userDetails &&
                        <div>
                            <p className='text-[#208320] text-2xl '>Transaction has been success. Please note transaction Id: {transactionDetails?.transactionId}</p>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}
