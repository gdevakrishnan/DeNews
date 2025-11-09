import React, { Fragment, useEffect, useState } from 'react'
import appContext from './context/appContext'
import ABI from './contractJson/DeNews.json'
import { ethers } from 'ethers';
import './App.css';
import Router from './router/Router';

const App = () => {
  const initialState = {
    WindowEthereum: false,
    // Contract Adress
    ContractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    // Wallet Address
    WalletAddress: null,
    // ABI
    ContractAbi: ABI.abi,
    // Provider and Signer
    Provider: null,
    Signer: null,
    // DeNews
    ReadContract: null,
    WriteContract: null
  };
  const [State, setState] = useState(initialState);

  useEffect(() => {
    getStateParameters();
  }, []);


  const getStateParameters = async () => {
    if (window.ethereum) {
      setState(prevState => ({
        ...prevState,
        WindowEthereum: true
      }));

      const Provider = window.ethereum 
        ? new ethers.providers.Web3Provider(window.ethereum) 
        : null;

      if (!Provider) {
        console.error("Ethereum provider not found");
        return;
      }

      await Provider.send("eth_requestAccounts", []);
      const Signer = await Provider.getSigner();
      const WalletAddress = await Signer.getAddress();

      setState(prevState => ({
        ...prevState,
        WalletAddress,
        Provider,
        Signer
      }));

      const ReadContract = new ethers.Contract(
        State.ContractAddress,
        State.ContractAbi,
        Provider
      );

      const WriteContract = new ethers.Contract(
        State.ContractAddress,
        State.ContractAbi,
        Signer
      );

      setState(prevState => ({
        ...prevState,
        ReadContract,
        WriteContract
      }));
    } else {
      console.log("Metamask Not Found");
    }
  };

  const context = {
    State,
    setState,
    getStateParameters
  }

  return (
    <appContext.Provider value={context}>
      <Fragment>
        <Router />
      </Fragment>
    </appContext.Provider>
  )
}

export default App