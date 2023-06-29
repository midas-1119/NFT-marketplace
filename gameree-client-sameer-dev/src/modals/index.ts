import NiceModal from "@ebay/nice-modal-react";
import LoginModal from "./authentication/LoginModal";
import * as CONSTANTS from "../constants";
import Signup from "./authentication/Signup";
import ForgotPassword from "./authentication/ForgotPassword";
import TwoFA from "./authentication/TwoFA";
import ResetPassword from "./authentication/ResetPassword";
import SentEmail from "./authentication/SentEmail";
import LoadingModal from "./actions/LoadingModal";
import SuccessModal from "./actions/SuccessModal";
import ChangePasswordModal from "./profile/ChangePasswordModal";
import EditProfileModal from "./profile/EditProfileModal";
import SettingsModal from "./profile/SettingsModal";
import BuyNFTSuccessModal from "./actions/BuyNFTSuccessModal";
import BuyNFTModal from "./marketplace/buyNft/BuyNFTModal";
import MakeAnOfferModal from "./marketplace/buyNft/MakeAnOfferModal";
import ListNftModal from "./marketplace/listNft/ListNftModal";
import MintNFTModal from "./marketplace/buyNft/MintNFTModal";
import MapViewModal from "./map/MapViewModal";
import StreetViewModal from "./map/SteetViewModal";
import SendOfferNftModal from "./marketplace/sendRecieveOffersNft/SendOfferNftModal";
import ViewOfferNftModal from "./marketplace/sendRecieveOffersNft/ViewOfferNftModal";
import ViewSentOfferNftModal from "./marketplace/sendRecieveOffersNft/ViewSentOfferNftModal";
import ProfileModal from "./map/ProfileModal";
import MapboxSearch from "./map/MapSearchModal";
import AddPropertyModal from "./map/AddPropertyModal";

//AUTHENTICATION MODALS
NiceModal.register(CONSTANTS.LOGIN, LoginModal);
NiceModal.register(CONSTANTS.SIGNUP, Signup);
NiceModal.register(CONSTANTS.FORGOT_PASSWORD, ForgotPassword);
NiceModal.register(CONSTANTS.TWOFA, TwoFA);
NiceModal.register(CONSTANTS.RESET_PASSWORD, ResetPassword);
NiceModal.register(CONSTANTS.EMAIL_COFIRMATION, SentEmail);

//ACTION MODALS
NiceModal.register(CONSTANTS.LOADING, LoadingModal);
NiceModal.register(CONSTANTS.SUCCESS, SuccessModal);

NiceModal.register(CONSTANTS.BUY_NFT_SUCCESS, BuyNFTSuccessModal);

//PROFILE MODALS
NiceModal.register(CONSTANTS.CHANGE_PASSWORD, ChangePasswordModal);
NiceModal.register(CONSTANTS.EDIT_PROFILE, EditProfileModal);
NiceModal.register(CONSTANTS.SETTINGS, SettingsModal);

//MARKETPLACE
NiceModal.register(CONSTANTS.BUY_NFT, BuyNFTModal);
NiceModal.register(CONSTANTS.MAKE_AN_OFFER, MakeAnOfferModal);
NiceModal.register(CONSTANTS.LIST_NFT, ListNftModal);
NiceModal.register(CONSTANTS.MINT_NFT, MintNFTModal);
NiceModal.register(CONSTANTS.NFT_MAP_VIEW, MapViewModal);
NiceModal.register(CONSTANTS.SEND_OFFER, SendOfferNftModal);
NiceModal.register(CONSTANTS.VIEW_OFFER, ViewOfferNftModal);
NiceModal.register(CONSTANTS.VIEW_SENT_OFFER, ViewSentOfferNftModal);

//MAP MODALS
NiceModal.register(CONSTANTS.STREET_VIEW, StreetViewModal);
NiceModal.register(CONSTANTS.PROFILE_MODAL, ProfileModal);
NiceModal.register(CONSTANTS.MAP_SEARCH_MODAL, MapboxSearch);
NiceModal.register(CONSTANTS.PROPERTY_ADD_MODAL, AddPropertyModal);
