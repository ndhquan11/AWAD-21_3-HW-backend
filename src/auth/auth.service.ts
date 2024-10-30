import { Injectable, Inject } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase) { }

  async signup(signupDto: SignupDto) {
    try {
      const { email, password } = signupDto;
      const { data, error } = await this.supabase.from('users').insert([{ email, password }]);
      if (error) {
        throw new Error('Signup failed: ' + error.message);
      }
      return data;
    } catch (error) {
      throw new Error( error.message);
    }
  }

  async signin(signinDto: SignupDto) {
    try {
      const { email, password } = signinDto;
      const { user, error } = await this.supabase.from('users').select().eq('email', email).eq('password', password).single();
      if (error) {
        throw new Error('Signin failed: ' + error.message);
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
