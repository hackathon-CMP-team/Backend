import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ResponseToRequestDto {
  @ApiProperty({ description: 'id of the request' })
  @IsMongoId()
  requestId: Types.ObjectId;

  @ApiProperty({ description: 'requester phone number' })
  @IsString()
  requesterPhone: string;
}
