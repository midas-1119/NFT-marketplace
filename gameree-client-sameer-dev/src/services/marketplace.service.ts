import axios from "axios";
import { HttpService } from "./base.service";

class MarketplaceService extends HttpService {
  private readonly prefix: string = "marketplace";

  getBuildings = (body: any): Promise<any> => this.get(this.prefix, body);
  addProperty = (body: any): Promise<any> =>
    this.post(`${this.prefix}/addnft`, body);
  getFeaturedBuildings = (): Promise<any> =>
    this.get(`${this.prefix}/featured`);
  getMostFeaturedBuilding = (): Promise<any> =>
    this.get(`${this.prefix}/most-featured`);
  getUserBuildings = (body: any): Promise<any> =>
    this.get(`${this.prefix}/user`, body);
  getUserStatistics = (): Promise<any> => this.get(`${this.prefix}/stats`);
  getNewlyMinted = (): Promise<any> => this.get(`${this.prefix}/newly-minted`);
  getSimilarBuildings = (): Promise<any> => this.get(`${this.prefix}/similar`);
  getById = (id: string): Promise<any> => this.get(`${this.prefix}/${id}`);
  getByLocationId = (id: string): Promise<any> =>
    this.get(`${this.prefix}/location/${id}`);
  getNftActivity = (id: string, body: any): Promise<any> =>
    this.get(`${this.prefix}/activity/${id}`, body);
  buyNft = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/buy/${id}`, body);
  mintNft = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/mint/${id}`, body);
  buyNftInternal = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/buy-nft-internal/${id}`, body);
  listNft = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/list/${id}`, body);
  placeBid = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/place-bid/${id}`, body);
  getBidsByListingId = (body: any): Promise<any> =>
    this.post(`${this.prefix}/getBidsByListingId`, body);
  getSentBids = (body: any): Promise<any> =>
    this.post(`${this.prefix}/getSentBids`, body);
  getUserAuctions = (body: any): Promise<any> =>
    this.post(`${this.prefix}/getUserAuctions`, body);
  getListing = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/getListing/${id}`, body);
  unlistNft = (id: string, body: any): Promise<any> =>
    this.post(`${this.prefix}/unlist/${id}`, body);
  // getGoogleData = (lat: any, lng: any) =>axios.get( `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&key=AIzaSyBxZ5mUOwo3CUldbWrsKCZyeVJVffyP8AU`);
  getMapBuilding = (lat: any, lng: any) =>
    axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?limit=1&access_token=pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg`
    );
}

export const marketplaceService = new MarketplaceService();
