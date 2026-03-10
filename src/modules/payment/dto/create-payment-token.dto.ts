import {
  IsBoolean,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserIdDto {
  @IsString()
  value: string;
}

class UserCountryDto {
  @IsString()
  value: string;
}

class UserDto {
  @ValidateNested()
  @Type(() => UserIdDto)
  id: UserIdDto;

  @ValidateNested()
  @Type(() => UserCountryDto)
  @IsOptional()
  country?: UserCountryDto;
}

class PurchaseItemDto {
  @IsString()
  sku: string;

  @IsOptional()
  quantity?: number;
}

class PurchaseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];
}

class SettingsDto {
  @IsString()
  external_id: string;

  @IsString()
  @IsOptional()
  return_url?: string;
}

export class CreatePaymentTokenDto {
  @IsBoolean()
  sandbox: boolean;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => PurchaseDto)
  purchase: PurchaseDto;

  @ValidateNested()
  @Type(() => SettingsDto)
  @IsOptional()
  settings?: SettingsDto;
}
