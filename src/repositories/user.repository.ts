// UserRepository.ts
import { initializeDataSource, dataSource } from './../configs';
import { User, UserI } from './../entities';
import { Repository } from 'typeorm';
import {RegisterRequest} from '../requests/auth';

// Interface
interface UserRepositoryI {
  save(res: RegisterRequest): Promise<User | null>; 
  isUserExists(email: string): Promise<boolean>; 
  findByEmail(email: string): Promise<User | null>; 
}

//actual class
export class UserRepository implements UserRepositoryI {
  private userRepository: Repository<User>;

  constructor() {
  
    this.userRepository = dataSource.manager.getRepository(User);
  }

  async save(res: RegisterRequest): Promise<User | null> {
    try {
      await initializeDataSource();
      const user = new User();
      user.email_address = res.email;
      user.first_name = res.first_name;
      user.last_name = res.last_name;
      user.password = res.password;

      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error saving user:', error);
      return null;
    }
  }

  async isUserExists(email: string): Promise<boolean> {
    await initializeDataSource();
    const existingUser = await this.userRepository.findOne({ where: { email_address: email } });

    return !!existingUser; // Return true if the user exists, false otherwise
  }
  
  async findByEmail(email: string): Promise<User | null> {
    await initializeDataSource();
    const user = await this.userRepository.findOne({ where: { email_address: email } });

    return user; 
  }

  async findById(id: number): Promise<User | null> {
    await initializeDataSource();
    const user = await this.userRepository.findOne({ where: { id: id } });
  
    return user; 
  }
}

export default UserRepository;
