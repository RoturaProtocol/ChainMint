'use client'

import React, { useState, useEffect } from 'react'

declare global {
    interface Window {
        nostr?: {
            sendTransaction: (data: string) => Promise<void>;
            getPublicKey: () => Promise<string>;
            getCurrentAccountDetails: () => Promise<AccountDetails>; // Adjust the type as per actual implementation

        };
    }
}
interface AccountDetails {
    address: string;
    // Other account details if available
}

export default function Details() {
    const [userAddress, setUserAddress] = useState<string>('');
    console.log('userAddress: ', userAddress)

    useEffect(() => {
        const getUserAddress = async () => {
            if (window?.nostr) {
                try {
                    const address = await window.nostr.getPublicKey();
                    console.log('address==>>: ', address)
                    setUserAddress(address);
                } catch (error) {
                    console.log("Error getting user's address==>>", error);
                }
            }
        };

        getUserAddress();
    }, []);

    const handleInscribe = async () => {
        const inputData = (document.getElementById(
            "inputValue"
        ) as HTMLInputElement)?.value;

        console.log('inputData: ', inputData)

        if (!window.nostr) {
            console.log("Wallet extension not found");
            return;
        }
        try {
            await window.nostr.sendTransaction(inputData);
        } catch (error) {
            console.log("Error sending transaction==>>", error);
        }
    };

    return (
        <section className='w-full mb-0'>
            <div className='container mx-auto px-4'>
                <div className="flex justify-center items-center flex-wrap flex-col gap-4 mt-[30px] mb-5">
                    <div className='shadow-2xl'>
                        <input className="shadow rounded w-full sm:w-[700px] py-2 px-3" id="inputValue" type="text" value={userAddress} disabled />
                    </div>
                    <div className="flex gap-4 w-full sm:w-[700px] flex-wrap sm:justify-between sm:flex-nowrap">
                        <button className="w-full gap-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-2 rounded" type="button"
                            onClick={handleInscribe}
                        >
                            Inscribe Button
                        </button>
                        <button className="w-full gap-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-2 rounded" type="button">
                            Query Button
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
