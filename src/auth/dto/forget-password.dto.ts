import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateBy } from 'class-validator';
import { phoneNumberValidationObject } from '../../utils/middlewares/egyptian-phone-number-format';

export class ForgetPasswordDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  @ValidateBy(phoneNumberValidationObject)
  phoneNumber: string;
}

export class VerifyOTPDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  @ValidateBy(phoneNumberValidationObject)
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  otp: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  @ValidateBy(phoneNumberValidationObject)
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  newPassword: string;
}
