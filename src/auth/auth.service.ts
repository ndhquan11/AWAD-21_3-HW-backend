import { Injectable, Inject } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const data = await this.supabase.from('users').insert([{ email, password: hashedPassword }]);
      return { message: 'Signup successful', data };
    } catch (error) {
      throw new Error('Signup failed: ' + error.message);
    }
  }

  async signin(signinDto: SignupDto) {
    try {
      const { email, password } = signinDto;

      // Retrieve user
      const { data: existingUser } = await this.supabase.from('users').select().eq('email', email).single();
      if (!existingUser) {
        throw new Error('Account does not exist');
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        throw new Error('Invalid password');
      }

      return { message: 'Signin successful', user: existingUser };
    } catch (error) {
      throw new Error('Signin failed: ' + error.message);
    }
  }
}
