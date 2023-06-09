import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { UserRole } from '../user.schema';

export class ReturnedUserInfoDto {
  @ApiProperty({ example: 'parent' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'omar' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1033304427' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'male' })
  @IsEnum(UserRole)
  gender: string;
}
