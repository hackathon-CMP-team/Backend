import { ApiProperty } from '@nestjs/swagger';
import { ReturnedUserInfoDto } from 'src/user/dto/returned-user.dto';

export class ReturnedAuthInfoDto {
  @ApiProperty({ example: 'ksjgkaslghejhgjehrieurighdjgjdhdgjhjehjehtheuit' })
  accessToken: string;

  @ApiProperty({ description: 'user info' })
  user: ReturnedUserInfoDto;
}
