import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { create as ipfsClient } from 'ipfs-http-client';

import NFT from './abis/nft.json';
import MARKETPLACE from './abis/marketplace.json';

// console.log('NFT: ', NFT);
// console.log('MARKETPLACE: ', MARKETPLACE);

import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

const ownerPrivateKey: string = process.env.OWNER_PRIVATE_KEY;
const ownerAddress: string = process.env.OWNER_ADDRESS;

const marketplaceContractAddress: string =
  process.env.MARKETPLACE_CONTRACT_ADDRESS;
const nftContractAddress: string = process.env.NFT_CONTRACT_ADDRESS;

@Injectable()
export class ContractService {
  providerBscTestnet = new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
  );

  signer = new ethers.Wallet(ownerPrivateKey, this.providerBscTestnet);

  auth =
    'Basic ' +
    Buffer.from(
      '24H9a91GOjX7dAkB3msvLrQCrIF' + ':' + 'c7f7608d1e4752814d07d50ceacba720',
    ).toString('base64');

  client: any = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: this.auth,
    },
  });

  async mintToken(
    address: string,
    metadata: any,
    contractAddress: string,
    price: number,
  ) {
    try {
      console.log('inside mint tokens', price);

      const added = await this.client.add(metadata);
      const tokenUri = `https://metaruffy.infura-ipfs.io/ipfs/${added.path}`;

      const value = ethers.utils.parseEther(price.toString());
      console.log('Value:', value.toString());

      const Contract = new ethers.Contract(
        contractAddress,
        NFT.abi,
        this.signer,
      );

      let transaction = await Contract.mint(address, tokenUri, {
        value: Math.round(price).toString(),
      });
      const receipt = await transaction.wait();

      console.log('Minting successful');
      console.log('Transaction hash: ', transaction.hash);

      // Fetch the transaction receipt and return it
      //   const receipt = await tx.wait();
      //   console.log('Transaction receipt: ', receipt);

      return { success: true, hash: transaction.hash, receipt };
    } catch (error) {
      console.log('Minting to contract failed: ', error);

      return { success: false };
    }
  }

  async listToken(listingData: any, price: number, creatorAddress: String) {
    try {
      console.log('inside list token', listingData);

      const NftContract = new ethers.Contract(
        nftContractAddress,
        NFT.abi,
        this.signer,
      );

      const MarketplaceContract = new ethers.Contract(
        marketplaceContractAddress,
        MARKETPLACE.abi,
        this.signer,
      );

      if (listingData.ownerAddress === creatorAddress) {
        console.log('Setting Royalty');
        const transaction = await NftContract.setRoyalty(
          listingData.tokenId,
          creatorAddress,
          listingData.royalty,
        );

        const receipt = await transaction.wait();

        console.log('After Setting Royalty');
      }

      const approved = await NftContract.getApproved(listingData.tokenId);
      console.log('Is Approved: ', approved);
      console.log('Marketplace Address: ', marketplaceContractAddress);
      const isApproved = approved == marketplaceContractAddress;

      if (!isApproved) {
        console.log('Not Approved');
        const approve = await NftContract.approve(
          marketplaceContractAddress,
          listingData.tokenId,
        );
        await approve.wait();
      }

      console.log('After Approval');

      const listingPrice = ethers.utils.parseUnits(price.toString());

      const trans = await MarketplaceContract.addListing(
        nftContractAddress,
        listingData.tokenId,
        1,
        listingData.type === 'FIXED' ? 0 : 1, //sell mode 0 for fixed and 1 for auction
        listingPrice,
        listingData.startTime ?? '0',
        listingData.duration ?? '0',
      );
      const tx = await trans.wait();
      console.log('Tx: ', tx.logs[2].topics[1]);

      console.log('Listing successful');
      console.log('Transaction hash: ', trans.hash);

      return {
        success: true,
        hash: trans.hash,
        reciept: tx,
        listingId: tx.logs[2].topics[1],
      };
    } catch (error) {
      console.log('Listing to contract failed: ', error);

      return { success: false };
    }
  }

  async unlistToken(listingId: string) {
    try {
      console.log('inside unlist token', listingId);

      const MarketplaceContract = new ethers.Contract(
        marketplaceContractAddress,
        MARKETPLACE.abi,
        this.signer,
      );

      const trans = await MarketplaceContract.removeListing(listingId);
      const tx = await trans.wait();

      console.log('UnListing successful');
      console.log('Transaction hash: ', trans.hash);

      return {
        success: true,
        hash: trans.hash,
      };
    } catch (error) {
      console.log('Listing to contract failed: ', error);

      return { success: false };
    }
  }

  async transferNftAndTokens(
    tokenId: Number,
    buyer: String,
    seller: string,
    amount: Number,
    contractAddress: string,
  ) {
    try {
      console.log('inside Transfer NFT And Tokens');
      console.log('Token ID: ', tokenId);
      console.log('Buyer: ', buyer);
      console.log('Seller: ', seller);
      console.log('Amount: ', amount);
      console.log('Contract Address: ', contractAddress);

      const Contract = new ethers.Contract(
        contractAddress,
        NFT.abi,
        this.signer,
      );

      let transaction = await Contract.transferFrom(seller, buyer, tokenId);
      const receipt = await transaction.wait();

      console.log('Transfer NFT Successful');
      console.log('Transaction hash: ', receipt.transactionHash);

      const weiAmount = ethers.utils.parseEther(amount.toString());

      // Transfer the BNB amount to the seller's address
      const transferTx = await this.signer.sendTransaction({
        to: seller,
        value: weiAmount,
      });

      const tx = await transferTx.wait();

      console.log('Transfer Tokens Successful');
      console.log('Transaction hash: ', tx.transactionHash);

      return { success: true, hash: receipt.transactionHash, receipt };
    } catch (error) {
      console.log('Transfer NFT and Tokens failed: ', error);
      return { success: false };
    }
  }

  async transferOwnershipViaAdmin(
    listingId: String,
    buyer: String,
    contractAddress: string,
  ) {
    try {
      console.log('inside Transfer Ownership Via Admin: ', listingId);
      console.log('Contract Address: ', contractAddress);
      console.log('Buyer: ', buyer);

      const Contract = new ethers.Contract(
        contractAddress,
        MARKETPLACE.abi,
        this.signer,
      );

      let transaction = await Contract.transferOwnership(buyer, listingId);
      const receipt = await transaction.wait();

      console.log('Buy successful');
      console.log('Transaction hash: ', transaction.hash);

      return { success: true, hash: transaction.hash, receipt };
    } catch (error) {
      console.log('Transfer ownership via admin failed: ', error);
      return { success: false };
    }
  }

  async buyTokenFromListing(
    listingId: string,
    price: Number,
    contractAddress: string,
  ) {
    try {
      console.log('inside buy tokens', price);

      const priceWithFee = ((3 / 100) * Number(price) + Number(price)).toFixed(
        9,
      );

      const memePrice = ethers.utils.parseEther(priceWithFee.toString());

      console.log('Value:', memePrice.toString());

      const Contract = new ethers.Contract(
        contractAddress,
        MARKETPLACE.abi,
        this.signer,
      );

      let transaction = await Contract.buyNow(listingId, {
        value: memePrice,
      });
      const receipt = await transaction.wait();

      console.log('Buy successful');
      console.log('Transaction hash: ', transaction.hash);

      return { success: true, hash: transaction.hash, receipt };
    } catch (error) {
      console.log('Buy from contract failed: ', error);

      return { success: false };
    }
  }

  async buyTokenFromTokenContract(
    from: string,
    to: string,
    tokenId: Number,
    contractAddress: string,
  ) {
    console.log('From: ', from);
    console.log('To: ', to);
    console.log('Token Id: ', tokenId);
    console.log('Contract Address: ', contractAddress);
    try {
      console.log('inside buy tokens from token contract', tokenId);

      const Contract = new ethers.Contract(
        contractAddress,
        NFT.abi,
        this.signer,
      );

      console.log('Contract: ', Contract);

      let transaction = await Contract.transferFrom(from, to, tokenId);
      const receipt = await transaction.wait();

      console.log('Buy successful');
      console.log('Transaction hash: ', transaction.hash);

      return { success: true, hash: transaction.hash, receipt };
    } catch (error) {
      console.log('Buy from token contract failed: ', error);

      return { success: false };
    }
  }
}
