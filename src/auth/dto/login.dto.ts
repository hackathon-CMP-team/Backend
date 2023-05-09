import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, ValidateBy } from 'class-validator';
import { phoneNumberValidationObject } from '../../utils/middlewares/egyptian-phone-number-format';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: '09123456789' })
  @ValidateBy(phoneNumberValidationObject)
  readonly phoneNumber: string;

  @IsString()
  @ApiProperty({ example: '324245' })
  readonly password: string;
}
