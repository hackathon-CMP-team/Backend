import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChildInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '09123456789' })
  childPhoneNumber: string;
}

// create another dto which has the same properties as the above dto

export class ReturnedChildInfoDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'fareed' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
