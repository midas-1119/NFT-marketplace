import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
  
export class UpdateProfileDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  email: string;

  coverImage: any
  avatar: any
  cover: any
}

export class validateEmailDto {
  @IsString()
  identifier: string;
}
