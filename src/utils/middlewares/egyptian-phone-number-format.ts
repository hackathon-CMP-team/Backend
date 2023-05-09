import { NestMiddleware } from '@nestjs/common';
import { ValidationArguments } from 'class-validator';

export const phoneNumberValidationObject = {
  name: 'isValidPhoneNumber',
  validator: {
    validate: (value: string) => {
      return /^(\+|0)?(20)?(1[0125]\d{8})$/.test(value);
    },
    defaultMessage: (args: ValidationArguments) => {
      return `phone number ${args.value} is not valid, it must be an Egyptian phone number`;
    },
  },
};
export class EgyptianPhoneNumberMiddleWare implements NestMiddleware {
  getReducedEgyptianPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/^(\+|0)?(20)?(10\d{8})$/, '$3');
  }
  use(req: any, _: any, next: any) {
    Object.keys(req.body).forEach((key) => {
      if (key.toLowerCase().includes('phone')) {
        req.body[key] = this.getReducedEgyptianPhoneNumber(req.body[key]);
      }
    });
    next();
  }
}
