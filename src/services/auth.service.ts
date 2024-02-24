import passport from "passport";
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import {LoginRequest, RegisterRequest} from '../requests/auth';
import { User, UserI } from "@src/entities";
import './../configs/auth.config';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(res: RegisterRequest) {
      const userExists = await this.userRepository.isUserExists(res.email);

      if (!userExists) {
        //hash the password
        const passwordHash = await bcrypt.hash(res.password, 8);
        res.password = passwordHash

        const user =  await this.userRepository.save(res);
        return user;
      } else {
        console.log('User already exists!');
        throw new Error('User already exists!');
      }
  }

 public async login(req: LoginRequest): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        passport.authenticate('local', { session: false }, (err:Error, user: User, info: any) => {
           if (err) {
              reject(new Error('Internal Server Error.'));
           }
  
           if (!user) {
              reject(new Error('Invalid username or password.'));
           }
  
           resolve(user);
        })({body: {email: req.email, password: req.password}}, null, null);
     });
  }

  public async findById(id: number): Promise<User | null> {
   const user = await this.userRepository.findById(id);
   return user;
 }
}