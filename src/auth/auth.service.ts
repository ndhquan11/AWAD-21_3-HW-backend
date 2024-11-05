import { Injectable, Inject } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase) { }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto;

      // Check if email already exists
      const { data: existingUser } = await this.supabase.from('users').select().eq('email', email).single();
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const data = await this.supabase.from('users').insert([{ email, password: hashedPassword }]);
      return { message: 'Register successful', data };
    } catch (error) {
      throw new Error('Register failed: ' + error.message);
    }
  }

  async login(loginDto: RegisterDto) {
    try {
      const { email, password } = loginDto;

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

      return { message: 'Login successful', user: existingUser };
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }
}
