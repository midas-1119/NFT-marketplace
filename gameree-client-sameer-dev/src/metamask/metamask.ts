import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, Signer } from "ethers";
import { toast } from "react-toastify";
import { serializeError } from "eth-rpc-errors";
import axios from "axios";
import Web3Modal from "web3modal";
import {
  ipfsProjectId,
  ipfsProjectSecret,
  ipfsProjectURL,
  nftAddress,
  nftMarketplaceAddress,
  sendRecieveOffersAddress,
} from "../environment/env";
import NFT from "./abi/nft.json";
import MARKETPLACE from "./abi/marketplace.json";
import SEND_RECIEVE_OFFERS from "./abi/sendRecieveOffers.json";
import { create as ipfsClient } from "ipfs-http-client";
// import { Action, Dispatch } from '../../types';
import Router from "next/router";
// import { NFT_TYPES } from '../../constants/enums';
// import { GET_NFT } from '../user/actionTypes';
// import { NFTContract } from "../../core";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { NFT_TYPES } from "../constants/nftType.enum";
const auth =
  "Basic " +
  Buffer.from(
    "24H9a91GOjX7dAkB3msvLrQCrIF" + ":" + "c7f7608d1e4752814d07d50ceacba720"
  ).toString("base64");
//@ts-ignore
// const client: any = ipfsHttpClient ("https://ipfs.infura.io:5001/api/v0");

// console.log(ipfsProjectId, ipfsProjectSecret,auth)

const client: any = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

//@ts-ignore
var provider: any;
var signer: any;
var signerAddress: any;

export const connectMetamask = async (hasUser = true) => {
  try {
    let connectprovider: any = await detectEthereumProvider();

    if (connectprovider) {
      const accounts = await connectprovider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await connectprovider.request({ method: "eth_chainId" });

      if (chainId !== "0x61") {
        try {
          const res = await switchNetwork();
          if (!res)
            return { success: false, message: "Switch network to continue" };
        } catch (error) {
          toast.error("Install metamask");
          return { success: false, message: "Switch network to continue" };
        }
      }
      connectprovider = new ethers.providers.Web3Provider(connectprovider);
      let signerConnect = connectprovider.getSigner();
      signerAddress = await signerConnect.getAddress();
      return { success: true, account: accounts[0], message: "connected" };
    } else {
      window.location.href = "https://metamask.io/download/";
      return { success: false, message: "Install Metamask" };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const isMetaMaskConnected = async () => {
  try {
    //@ts-ignore
    let connectprovider: any = await detectEthereumProvider();

    if (connectprovider) {
      const accounts = await connectprovider.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        const chainId = await connectprovider.request({
          method: "eth_chainId",
        });
        if (chainId === "0x61") {
          const getBalance = await connectprovider.request({
            method: "eth_getBalance",
            params: [accounts[0]],
          });
          const res: any = ethers.utils.formatEther(getBalance);
          const balance = Math.round(res * 1e4) / 1e4;
          return {
            connected: true,
            account: accounts[0],
            balance: balance,
          };
        }
      }
      return { connected: false, account: "0x0000000000000000000", balance: 0 };
    }
    return { connected: false, account: "0x0000000000000000000", balance: 0 };
  } catch (error) {
    console.log(error, "ERROR");

    return { connected: false, account: "0x0000000000000000000", balance: 0 };
  }
};

export const getChainId = async () => {
  provider = await detectEthereumProvider();
  if (provider) {
    try {
      const chainId = await provider.request({ method: "eth_chainId" });
      return chainId;
    } catch (error) {
      return undefined;
    }
  } else return undefined;
};
export const getBalance = async () => {
  let provider: any = await detectEthereumProvider();
  if (provider) {
    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0]],
      });
      const res: any = ethers.utils.formatEther(balance);
      return Math.round(res * 1e4) / 1e4;
    } catch (error) {
      console.log(error, "error getting balance");
    }
  } else {
    console.log("cannot get balance");
  }
};
export const switchNetwork = async () => {
  const provider: any = await detectEthereumProvider();

  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }],
      });
      return true;
    } catch (switchError: any) {
      console.log(switchError, "switchError");
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          const res = await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x61",
                chainName: "Binance Smart Chain Testnet",
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              },
            ],
          });
          return true;
        } catch (addError) {
          // handle "add" error
          console.log(addError);
          return false;
        }
      }
      // handle other "switch" errors
      return false;
    }
  }
};

export const getBNBRate = async (convType: string = "") => {
  try {
    const coin = convType || "USD";
    console.log("converserionType:-=-=-=", convType);
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=${coin}`
    );
    return data?.[coin] || 0;
  } catch (error) {}
};

export const getEthRate = async () => {
  try {
    const res: any = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    return res.data?.USD ?? 0;
  } catch (error) {}
};

export const getSigner = async () => {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (e) {
      console.error(e);
    }
  }
};

export const mintNFT = async (nft: any) => {
  // console.log("NFT: ", nft);
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io");
      return;
    }
    const connect = await connectMetamask();
    if (!connect.success) {
      alert(connect.message);
      return;
    }
    const data = JSON.stringify({
      name: nft.address,
      description: "",
      image: nft.image,
      imageHash: "",
      edition: 1,
      date: Date.now(),
      attributes: [],
      address: nft.address,
      area: nft.area,
      geometry: nft.geometry,
      incAddress: nft.incAddress,
      location: nft.location,
      sequence: nft.sequence,
      categories: [],
      collectionId: "",
      fileType: "",
      id: nft.id,
    });
    console.log("NFT Data: ", data);
    console.log("NFT: ", nft);
    const added = await client.add(data);
    const url = `https://metaruffy.infura-ipfs.io/ipfs/${added.path}`;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    /* next, create the item */
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const metamaskAddress = await getSigner();
    console.log("Metamask Address: ", metamaskAddress);
    let transaction = await contract.mint(metamaskAddress, url, {
      value: Math.round(nft.price).toString(),
    });
    let tx = await transaction.wait();

    console.log("Transaction: ", transaction);
    console.log("Tx: ", tx);

    return {
      success: true,
      ownerAddress: metamaskAddress,
      hash: tx.transactionHash,
      to: tx.to,
      from: tx.from,
      tokenId: parseInt(tx.events[0].args.tokenId._hex, 16),
    };
  } catch (error: any) {
    const errorResponse: any = serializeError(error);
    console.log("Error uploading file: ", errorResponse);
    const err = errorResponse.data.originalError;
    toast.error(err.reason);
    return {
      success: false,
    };
  }
};

// export const getTokenId = async () => {
//   try {
//     if (!window.ethereum) {
//       window.open("https://metamask.io");
//       return;
//     }
//     const connect = await connectMetamask();
//     if (!connect.success) {
//       alert(connect.message);
//       return;
//     }

//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();
//     /* next, create the item */
//     let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
//     const metamaskAddress = await getSigner();
//     console.log("Metamask Address: ", metamaskAddress);
//     let tokenId = await contract.totalSupply();

//     console.log("Token ID: ", parseInt(tokenId._hex, 16));

//     return {
//       success: true,
//       tokenId: parseInt(tokenId._hex, 16),
//     };
//   } catch (error: any) {
//     const errorResponse: any = serializeError(error);
//     console.log("Error uploading file: ", errorResponse);
//     const err = errorResponse.data.originalError;
//     toast.error(err.reason);
//     return {
//       success: false,
//     };
//   }
// };

export const setRoyalties = async (
  tokenId: any,
  receiver: string,
  royalty: number
) => {
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io");
      return;
    }
    const connect = await connectMetamask();
    if (!connect.success) {
      alert(connect.message);
      return;
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const transaction = await contract.setRoyalty(tokenId, receiver, royalty);
    let tx = await transaction.wait();

    return true;
  } catch (error: any) {
    toast.error(error.message);
    if (error.code === -32603) {
      alert("Insufficient funds");
    }
    return false;
  }
};

export const sendOFFER: any = async (data: any) => {
  console.log("Data: ", data);
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("Connection: ", connection);
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log("Signer: ", signer);
    const { price, tokenId, listingId } = data;

    const marketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );

    const offerPrice = ethers.utils.parseUnits(price.toString(), "ether");
    const transaction = await marketPlaceContract.offerNFT(
      tokenId,
      offerPrice,
      listingId
    );
    let tx = await transaction.wait();
    console.log("Tx: ", tx.events[0].args.offerId._hex);

    return {
      success: true,
      hash: tx.transactionHash,
      offerId: parseInt(tx.events[0].args.offerId._hex, 16),
    };
  } catch (error: any) {
    console.log("error while sending offer: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};

export const acceptOFFER: any = async (data: any) => {
  console.log("Data: ", data);
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("Connection: ", connection);
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log("Signer: ", signer);
    const { tokenId, offerId, listingId } = data;

    const marketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );

    const transaction = await marketPlaceContract.acceptOffer(
      tokenId,
      offerId,
      listingId
    );
    let tx = await transaction.wait();
    console.log("Tx: ", tx);

    const nft = new ethers.Contract(nftAddress, NFT.abi, signer);

    const approve = await nft.approve(nftMarketplaceAddress, tokenId);
    await approve.wait();

    return {
      success: true,
      hash: tx.transactionHash,
    };
  } catch (error: any) {
    console.log("error while accepting offer: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};

export const completePurchaseOFFER: any = async (data: any) => {
  console.log("Data: ", data);
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("Connection: ", connection);
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log("Signer: ", signer);
    const { tokenId, offerId, price } = data;

    const marketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );

    const transaction = await marketPlaceContract.confirmPurchase(
      tokenId,
      offerId,
      {
        value: ethers.utils.parseUnits(price.toString(), "ether"),
      }
    );
    let tx = await transaction.wait();
    console.log("Tx: ", tx);

    return {
      success: true,
      hash: tx.transactionHash,
    };
  } catch (error: any) {
    console.log("error while complete purchase offer: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};

export const transferTokens: any = async (data: any) => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("Connection: ", connection);
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const { sellerAddress, bnbAmount } = data;

    // Convert BNB amount to Wei
    const weiAmount = ethers.utils.parseEther(bnbAmount.toString());

    // Transfer the BNB amount to the seller's address
    const transferTx = await signer.sendTransaction({
      to: sellerAddress,
      value: weiAmount,
    });

    const tx = await transferTx.wait();

    return {
      success: true,
      hash: tx.transactionHash,
    };
  } catch (error: any) {
    console.log("error while transfer: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};

export const approve: any = async (data: any) => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("Connection: ", connection);
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const { tokenId, sellerAddress } = data;

    const nft = new ethers.Contract(nftAddress, NFT.abi, signer);
    const approved = await nft.getApproved(tokenId);
    console.log("Approved: ", approved);
    console.log("Seller Address: ", sellerAddress);
    const isApproved = approved == sellerAddress;
    console.log("Approved");
    if (!isApproved) {
      console.log("Not Approved");
      const approve = await nft.approve(sellerAddress, tokenId);
      await approve.wait();
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.log("error while approving: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};

export const listNFT: any = async (data: any) => {
  console.log("Data: ", data);
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("Connection: ", connection);
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log("Signer: ", signer);
    if (data.royalty) {
      const response = await setRoyalties(
        data.tokenId,
        data.receiver,
        data.royalty
      );
      console.log("Set Royalties Response: ", response);
      if (!response) return false;
    }
    const { price, tokenId, type } = data;
    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );

    const nft = new ethers.Contract(nftAddress, NFT.abi, signer);
    // const nft = new ethers.Contract(nftAddress, NFT.abi, provider);
    // const nftWithSigner = new ethers.Contract(nftAddress, NFT.abi, signer);
    const approved = await nft.getApproved(tokenId);
    console.log("Approved: ", approved);
    console.log("Marketplace Address: ", nftMarketplaceAddress);
    const isApproved = approved == nftMarketplaceAddress;
    console.log("Approved");
    if (!isApproved) {
      console.log("Not Approved");
      const approve = await nft.approve(nftMarketplaceAddress, tokenId);
      await approve.wait();
    }

    console.log("After Approval");

    const listingPrice = ethers.utils.parseUnits(price.toString(), "ether");
    const transaction = await contract.addListing(
      nftAddress,
      tokenId,
      1,
      type === NFT_TYPES.fixedPrice ? 0 : 1, //sell mode 0 for fixed and 1 for auction
      listingPrice,
      data.startTime ?? "0",
      data.duration ?? "0"
    );
    let tx = await transaction.wait();
    console.log("Tx: ", tx.logs[2].topics[1]);

    return {
      success: true,
      hash: tx.transactionHash,
      listingId: tx.logs[2].topics[1],
    };
  } catch (error: any) {
    console.log("error while creating sale: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};

export const checkRoyaltity = async (tokenId: any) => {
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io");
      return;
    }
    const connect = await connectMetamask();
    if (!connect.success) {
      alert(connect.message);
      return;
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const transaction = await contract.royaltyInfo(tokenId, 100);

    return transaction;
  } catch (error: any) {
    toast.error(error.message);
    if (error.code === -32603) {
      alert("Insufficient funds");
    }
    return false;
  }
};
export const unlistNft = async (listingId: string, owner: string) => {
  console.log("Listing Id: ", listingId);
  console.log("Owner: ", owner);
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io");
      return false;
    }
    const connect = await connectMetamask();
    if (!connect.success) {
      alert(connect.message);
      return false;
    }

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );
    const transaction = await contract.removeListing(listingId);

    let tx = await transaction.wait();
    let hash = tx.transactionHash;
    return { success: true, hash: hash };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const buyNFT = async (price: any, listingId: string) => {
  console.log("Price: ", price);
  console.log("ListingId: ", listingId);
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io");
      return false;
    }
    const connect = await connectMetamask();
    if (!connect.success) {
      alert(connect.message);
      return false;
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const priceWithFee = ((3 / 100) * Number(price) + Number(price)).toFixed(9);
    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );
    const memePrice = ethers.utils.parseEther(priceWithFee.toString());

    // const pricee = ethers.utils.parseUnits(price.toString(), "ether");

    const metamaskAddress = await getSigner();
    console.log("Metamask Address: ", metamaskAddress);

    const transaction = await contract.buyNow(listingId, {
      value: memePrice,
    });
    const tx = await transaction.wait();

    console.log("Transaction: ", transaction);
    console.log("Tx: ", tx);

    return {
      success: true,
      hash: tx.transactionHash,
      ownerAddress: metamaskAddress,
    };
  } catch (error: any) {
    console.log(error, "error");
    const errorResponse: any = serializeError(error);
    console.log("Error uploading file: ", errorResponse);
    const err = errorResponse.data.message;
    if (err.includes("insufficient funds"))
      toast.error("You do not have enough balance!");
    else toast.error(err);
    return false;
  }
};

export const placeBid = async (price: any, listingId: any) => {
  try {
    if (!window.ethereum) {
      window.open("https://metamask.io");
      return;
    }
    const connect = await connectMetamask();
    if (!connect.success) {
      alert(connect.message);
      return;
    }

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const bidPrice = ethers.utils.parseEther(price.toString());
    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKETPLACE.abi,
      signer
    );
    const transaction = await contract.placeBid(listingId, { value: bidPrice });
    let tx = await transaction.wait();
    console.log("Tx: ", tx.events[tx.events.length - 1].args);
    // console.log("Tx: ", tx.events[tx.events.length - 1].args.biddingId);

    return {
      success: true,
      hash: tx.transactionHash,
      biddingId: tx.events[tx.events.length - 1].args.biddingId,
    };
  } catch (error: any) {
    console.log("error while placing bid: ", error);
    toast.error(error?.reason || error?.data?.message || error?.message);
    return { success: false };
  }
};
