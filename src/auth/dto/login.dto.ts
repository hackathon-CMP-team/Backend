import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly phoneNumber: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}
