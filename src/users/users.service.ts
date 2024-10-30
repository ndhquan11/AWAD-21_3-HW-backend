import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const { data, error } = await this.supabase.from('users').insert([{ email, password }]);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
