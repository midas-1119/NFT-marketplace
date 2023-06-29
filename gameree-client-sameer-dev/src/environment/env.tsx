const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
const frontEndUrl = process.env.NEXT_PUBLIC_REACT_APP_FRONT_URL || "";
const appMode = process.env.NEXT_PUBLIC_APP_MODE || "dev";
const nftAddress = process.env.NEXT_PUBLIC_REACT_APP_NFT_ADDRESS || "";
const nftMarketplaceAddress =
  process.env.NEXT_PUBLIC_REACT_APP_NFT_MARKETPLACE_ADDRESS || "";
const sendRecieveOffersAddress =
  process.env.NEXT_PUBLIC_REACT_APP_SEND_RECIEVE_OFFERS_ADDRESS || "";
const ipfsProjectId = process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_ID || "";
const ipfsProjectSecret =
  process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_SECRET || "";
const ipfsProjectURL = process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_URL || "";
const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const platformOwnerAddress =
  process.env.NEXT_PUBLIC_REACT_APP_PLATFORM_OWNER_ADDRESS || "";
export {
  baseURL,
  frontEndUrl,
  appMode,
  nftAddress,
  nftMarketplaceAddress,
  sendRecieveOffersAddress,
  ipfsProjectId,
  ipfsProjectSecret,
  ipfsProjectURL,
  stripePublishableKey,
  platformOwnerAddress,
};
