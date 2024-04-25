'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { LedgerClientFactory, Address } from '@turajs/core';
import { GenericExtensionWallet } from '@turajs/wallets';
import { ChainTime } from "@turajs/util";

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
const ITEMS_PER_PAGE = 10 // Number of items to display per page
// let networkName = 'Tura-TESTNET'
let networkName = 'Tura'
interface Transaction {

}

export default function Details() {
    const [userDetails, setUserDetails] = useState<any>('');
    const [userData, setUserData] = useState<any>('');
    const [userMsg, setUserMsg] = useState<string>('');
    const [transactionDetails, setTransactionDetails] = useState<any>('');
    const [alertErrorMessage, setAlertErrorMessage] = useState<any>('');
    const [transactionList, setTransactionList] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const queryBtnRef = useRef<HTMLButtonElement>(null);

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
        if (args.networkName === networkName) {
            if (!(window as any).wallet.connection) {
                networkName = args?.networkName;
                connectWallet(args.networkName);
            } else {
                createLedgerClient(args.nodeHost);
            }
        } else if (args.networkName === 'Signum-TESTNET') {
            if (!(window as any).wallet.connection) {
                networkName = args?.networkName;
                connectWallet(args.networkName);
            } else {
                createLedgerClient(args.nodeHost);
            }
        } else {
            alert("Wallet changed to another network - Disconnect wallet");
            disconnectWallet();
            return;
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

    async function connectWallet(networkName: any) {
        // if ((window as any).wallet.connection) return;
        try {
            console.log("start")
            // connecting the wallet is easy
            const connection = await (window as any).wallet.connect({
                // appName: 'SignumJS XT Wallet Demo',
                appName: 'Tura XT Wallet',
                // networkName: networkName
                networkName: networkName
            });

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
            setAlertErrorMessage('')
        } catch (error: any) {
            console.log('connecting walleterror:', error)
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
                await connectWallet(networkName);
            } catch (error) {
                console.log('There was a problem with wallet connect:', error);
            }
        };

        walletDetail();
    }, [networkName]);

    useEffect(() => {
        const getUserAddress = async () => {
            try {
                if (userData?.accountId) {
                    const ledger = LedgerClientFactory.createClient({
                        nodeHost: userData?.currentNodeHost,
                    });
                    const response = await ledger.account.getAccount({ accountId: userData?.accountId });
                    console.log('Account Response: ', response)
                    if (response) {
                        setUserDetails(response);
                    }
                }
            } catch (error: any) {
                console.log('account error', error)
                alert(error?.message);
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
                senderPublicKey: userDetails?.publicKey
            });

            const connection = await (window as any).wallet.connect({
                appName: 'Tura XT Wallet',
                networkName: networkName
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
            console.log('handleInscribe Error: ', error)
            if (buttonRef.current) {
                buttonRef.current.disabled = false; // Enable the button
            }
            if (error?.name === 'NotGrantedWalletError') {
                return alert('Permission to access the wallet was not granted. Please grant permission and try again.');
            } else if (error.name === 'Error' && alertErrorMessage === '') {
                return alert('Unable to connect to the network. Please select another network or verify your internet connection.');
            } else {
                return alert(alertErrorMessage);
            }
        }
    };

    const handleQuery = async () => {
        if (queryBtnRef.current) {
            queryBtnRef.current.disabled = true; // Disable the button
        }
        try {
            if (alertErrorMessage === '') {
                const accountId = Address.create(userDetails?.accountRS).getNumericId()
                const ledger = LedgerClientFactory.createClient({
                    nodeHost: userData?.currentNodeHost
                });
                // here we can explicitly filter by Transaction Types
                const { transactions } = await ledger.account.getAccountTransactions({ accountId });
                if (queryBtnRef.current) {
                    queryBtnRef.current.disabled = false; // Enable the button after get transaction
                }
                if (transactions?.length > 0) {
                    setTransactionList(transactions)
                }

            } else {
                if (queryBtnRef.current) {
                    queryBtnRef.current.disabled = false; // Enable the button after get transaction
                }
                alert(alertErrorMessage);
            }
        } catch (error: any) {
            console.log('Query button error==>>', error)
            if (queryBtnRef.current) {
                queryBtnRef.current.disabled = false; // Enable the button after get transaction
            }
            if (error?.name === 'Error') {
                return alert('Unable to connect to the network. Please select another network or verify your internet connection.');
            }
        }
    }

    /**
     * Converts a UNIX timestamp into a human-readable time difference from the current time.
     * @param timestamp The UNIX timestamp (in milliseconds) to be converted.
     * @returns A string representing the time difference from the current time, in the format "X days, X hours ago".
     */
    const convertTimestamp = (timestamp: number) => {
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        const transactionTime = new Date(timestamp).getTime(); // Get transaction time in milliseconds
        const difference = currentTime - transactionTime;

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        // Construct the result string
        let result = "";
        if (days > 0) {
            result += `${days} day${days > 1 ? 's' : ''}, `;
        }
        if (hours > 0) {
            result += `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        return result + " ago";
    }

    // Function to convert fee from NQT to TSIGNA format
    const convertFeeToTSIGNA = (feeNQT: any) => {
        const feeNQTNumber = parseInt(feeNQT);
        const feeTSIGNA = feeNQTNumber / 10000; // Convert from NQT to TSIGNA
        // const feeTSIGNA = feeNQTNumber ; // Convert from NQT to TSIGNA
        return feeTSIGNA.toFixed(4) + " Tura"; // Format to display two decimal places and append TSIGNA
    };

    // Function to handle next page button click
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to handle previous page button click
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Generate random transaction list based on the current page
    const randomTransactionList = useMemo(() => {
        let result: any[] = [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = currentPage * ITEMS_PER_PAGE;
        for (let index = startIndex; index < Math.min(endIndex, transactionList.length); index++) {
            result.push(transactionList[index]);
        }
        // Calculate total pages when transactionList changes
        setTotalPages(Math.ceil(transactionList?.length / ITEMS_PER_PAGE));

        return result;
    }, [transactionList, currentPage]);

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
                        <button className="w-full gap-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-2 rounded" type="button"
                            ref={queryBtnRef}
                            onClick={handleQuery}
                        >
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

                    {randomTransactionList?.length > 0 &&
                        <div>
                            <table className="border-slate-500 table-auto overflow-x-auto">
                                <thead className='bg-[#f0f8ff]'>
                                    <tr>
                                        <th className="border border-slate-600 px-6 py-3">Transaction ID</th>
                                        <th className="border border-slate-600 px-6 py-3">Block</th>
                                        <th className="border border-slate-600 px-6 py-3">Timestamp</th>
                                        <th className="border border-slate-600 px-6 py-3">Message</th>
                                        <th className="border border-slate-600 px-6 py-3">From</th>
                                        <th className="border border-slate-600 px-6 py-3">To</th>
                                        <th className="border border-slate-600 px-6 py-3">Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {randomTransactionList?.map((item: any, index: number) => {
                                        // Convert the timestamp from the transaction object to Epoch time
                                        const timestamp = ChainTime.fromChainTimestamp(item?.timestamp).getEpoch();
                                        const formattedTime = convertTimestamp(timestamp);

                                        // Get the fee in TSIGNA format from the transaction object
                                        const feeTSIGNA = convertFeeToTSIGNA(item?.feeNQT);

                                        return (
                                            <tr className='hover:bg-slate-200' key={index}>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">{item?.transaction}</td>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">{item?.height}</td>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">{formattedTime}</td>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">
                                                    {item?.attachment?.message ? item?.attachment?.message?.length > 15 ?
                                                        <div className='flex flex-wrap items-center'>
                                                            {item?.attachment?.message?.slice(0, 15) + '...'}
                                                            <span className='text-[#208320]' title={item?.attachment?.message}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 cursor-pointer">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        : item?.attachment?.message : '-'}
                                                </td>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">{item?.senderRS}</td>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">{item?.recipientRS}</td>
                                                <td className="border border-slate-700 whitespace-nowrap text-[14px] px-2 py-2">{feeTSIGNA}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className='flex flex-wrap items-center xl:justify-end lg:justify-end md:justify-start mt-2' style={{ justifyContent: 'space-between' }}>
                                <span className='px-2 py-2'>Total <span className='font-bold'>{transactionList?.length}</span> Transactions</span>
                                <div>
                                    <button className='hover:bg-neutral-100 px-2 py-2' onClick={handlePreviousPage} disabled={currentPage === 1}>
                                        Previous
                                    </button>
                                    <span className='ms-3 me-3'>
                                        {Array.from({ length: totalPages }, (_, index) => {
                                            const pageNumber = index + 1;
                                            return (
                                                <span
                                                    key={pageNumber}
                                                    className={`cursor-pointer rounded-full px-3 py-1 text-sm ${pageNumber === currentPage ? 'bg-black text-white' : 'bg-primary-100 text-primary-700'
                                                        }`}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </span>
                                            );
                                        })}
                                    </span>
                                    <button className='hover:bg-neutral-100 px-2 py-2' onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}
