import { IsNotEmpty } from "class-validator";
import { IUserDocument } from "../user/user.schema";

export class NftListedDto {
    @IsNotEmpty()
    type: string;
  
    @IsNotEmpty()
    price: string;
  
    @IsNotEmpty()
    itemId: string;

    hash: string;
    from: string;
    tokenId: string;
}
export class GetByDnaDto {
    @IsNotEmpty()
    dna: string;
    @IsNotEmpty()
    size: string;
}
export class IsUserNFTDto {
    @IsNotEmpty()
    userId: IUserDocument;
    @IsNotEmpty()
    nftId: string;
}