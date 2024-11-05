import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase) { }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto;

      const { data: existingUser } = await this.supabase
        .from('users')
        .select()
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new HttpException(
          'Email already exists',
          HttpStatus.CONFLICT
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await this.supabase
        .from('users')
        .insert([{ email, password: hashedPassword }]);

      if (error) {
        throw new HttpException(
          'Registration failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return { message: 'Registration successful', user: { email } };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async login(loginDto: RegisterDto) {
    try {
      const { email, password } = loginDto;

      const { data: user, error } = await this.supabase
        .from('users')
        .select()
        .eq('email', email)
        .single();

      if (!user) {
        throw new HttpException(
          'Account does not exist',
          HttpStatus.NOT_FOUND
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException(
          'Incorrect password',
          HttpStatus.UNAUTHORIZED
        );
      }

      return { 
        message: 'Login successful',
        user: { 
          email: user.email,
          id: user.id 
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
