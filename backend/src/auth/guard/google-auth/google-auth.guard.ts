import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions() {
    return {
      prompt: 'select_account', // forces account picker
      accessType: 'offline', // optional: ensures refresh token
    };
  }
}
