import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenCategoriesDto {
  @ApiProperty({ description: 'array of categories to be forbidden' })
  categories: string[];

  @ApiProperty({ description: 'child phone number' })
  childPhoneNumber: string;
}
