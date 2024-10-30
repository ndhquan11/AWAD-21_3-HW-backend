import { Injectable, Inject } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase) { }

  async signup(signupDto: SignupDto) {
    try {
      const { email, password } = signupDto;

      // Check if email already exists
      const { data: existingUser } = await this.supabase.from('users').select().eq('email', email).single();
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Create new user
      const data = await this.supabase.from('users').insert([{ email, password }]);
      return { message: 'Signup successful', data };
    } catch (error) {
      throw new Error('Signup failed: ' + error.message);
    }
  }

  async signin(signinDto: SignupDto) {
    try {
      const { email, password } = signinDto;

      // Check if email and password match
      const { data: existingUser} = await this.supabase.from('users').select().eq('email', email).eq('password', password).single();
      if (!existingUser) {
        throw new Error('Invalid email or password');
      }

      // Return user
      const user = await this.supabase.from('users').select().eq('email', email).eq('password', password).single();
      return { message: 'Signin successful', user };
    } catch (error) {
      throw new Error('Signin failed: ' + error.message);
    }
  }
}
