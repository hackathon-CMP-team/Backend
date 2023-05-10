import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateBy } from 'class-validator';
import { phoneNumberValidationObject } from '../../utils/middlewares/egyptian-phone-number-format';

export class ChildInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '09123456789' })
  @ValidateBy(phoneNumberValidationObject)
  childPhoneNumber: string;
}

// create another dto which has the same properties as the above dto

export class ReturnedChildInfoDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  @ValidateBy(phoneNumberValidationObject)
  phoneNumber: string;

  @ApiProperty({ example: 'fareed' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
