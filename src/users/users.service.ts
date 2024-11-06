import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) {}

  async findOne(id: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('id, email, created_at') 
      .eq('id', id)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    return user;
  }
}
