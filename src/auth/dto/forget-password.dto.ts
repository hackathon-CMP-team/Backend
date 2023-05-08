import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyOTPDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  otp: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  newPassword: string;
}
