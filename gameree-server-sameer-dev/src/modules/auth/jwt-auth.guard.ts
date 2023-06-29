
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // console.log( user, errs, info )
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          console.log('ERROR', err);
          throw err || new UnauthorizedException();
        }
        return user;
      }
}
