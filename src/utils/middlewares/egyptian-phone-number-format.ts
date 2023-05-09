import { NestMiddleware } from '@nestjs/common';

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
