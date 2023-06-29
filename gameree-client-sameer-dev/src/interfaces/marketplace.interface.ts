export interface IBuilding {
  _id: string;
  image: string;
  location: ILocation;
  incAddress: any;
  geometry: any;
  address: any;
  price: number;
  area: number;
  updatedAt?: Date;
  ownerId?: IOwner;
  status?: string;
  tokenId?: string;
  owner?: string;
  ownerAddress?: string;
  creatorAddress?: string;
  royalty?: number;
}
export interface ILocation {
  lat: Number;
  lng: Number;
}
export interface IOwner {
  fullName?: String;
  username?: String;
  _id?: String;
}
