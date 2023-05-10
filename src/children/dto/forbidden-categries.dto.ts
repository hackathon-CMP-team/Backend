import { ApiProperty } from '@nestjs/swagger';
import { ValidateBy } from 'class-validator';
import { phoneNumberValidationObject } from '../../utils/middlewares/egyptian-phone-number-format';

export class ForbiddenCategoriesDto {
  @ApiProperty({ description: 'array of categories to be forbidden' })
  categories: string[];

  @ApiProperty({ description: 'child phone number' })
  @ValidateBy(phoneNumberValidationObject)
  childPhoneNumber: string;
}
