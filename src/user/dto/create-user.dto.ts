import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  IsDate,
  isDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  maxLength,
  MinLength,
  ValidateBy,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { UserGender, UserRole } from '../user.schema';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'must be a valid email' })
  @ApiProperty({ description: 'email of the user' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'phone number of the user' })
  @ValidateBy({
    name: 'isEgyptianPhoneNumber',
    validator: {
      validate: (value: string) => {
        return /^01[0125][0-9]{8}$/.test(value);
      },
      defaultMessage: (args: ValidationArguments) => {
        return `${args.value} must be a valid egyptian phone number`;
      },
    },
  })
  readonly phoneNumber: string;

  @ApiProperty({ description: 'password of the user', example: '123456' })
  @Length(6, 6, { message: 'password must be 6 digit number' })
  @ValidateBy({
    name: 'isNumberString',
    validator: {
      validate: (value: string) => {
        return !isNaN(Number(value));
      },
      defaultMessage: (args: ValidationArguments) => {
        return `password ${args.value} is not valid, it must be a 6-digit number`;
      },
    },
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name of the user', example: 'omar' })
  name: string;

  @IsDateString()
  @ApiProperty({
    description: 'date of birth of the user',
    example: new Date(),
  })
  dateOfBirth: Date;

  @IsEnum(UserRole)
  @ApiProperty({ description: 'role of the user', example: UserRole.PARENT })
  role: UserRole;

  @IsEnum(UserGender)
  @ApiProperty({ example: 'male', description: 'gender of the user' })
  gender: string;

  @ValidateIf((o) => o.role === UserRole.CHILD)
  @IsString()
  @ApiProperty({ example: '01033304427', description: 'parent phone number' })
  parentPhoneNumber?: string;
}
