import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateBy,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'must be a valid email' })
  @ApiProperty({ description: 'email of the user' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'phone number of the user' })
  readonly phoneNumber: string;

  @MinLength(8, { message: 'Password Must have at least 8 characters' })
  @ApiProperty({ description: 'password of the user' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name of the user' })
  name: string;
}
