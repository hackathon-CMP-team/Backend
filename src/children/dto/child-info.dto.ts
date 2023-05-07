import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChildInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '09123456789' })
  childPhoneNumber: string;
}
