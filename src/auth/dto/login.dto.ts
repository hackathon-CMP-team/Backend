import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: '09123456789' })
  readonly phoneNumber: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: '324245' })
  readonly password: string;
}

