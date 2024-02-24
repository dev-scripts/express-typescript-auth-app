import { 
  Post, 
  Route, 
  Example, 
  SuccessResponse,
  Body, 
  Controller, 
  Security,
  Header,
  Response as TSOAResponse,
  Request
} from "tsoa";
import {
  LoginRequest, 
  RegisterRequest
} from '../requests/auth';
import { Validate } from "joi-typescript-validator"
import * as jwt from "jsonwebtoken";
import { ErrorResponse } from '../error'
import { 
  RegisterResponse, 
  LoginResponse,
  AuthenticatedUserResponse
 } from '../interfaces/auth'
import { AuthService } from './../services/auth.service'
import { envVariables } from "./../configs";

@Route("auth")
export class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  @Example<RegisterResponse>({
          id: 1,
          name: "tsoa user",
          email: "hello@tsoa.com",
          token: "token-string"
        })
  @Post("/register")
  @TSOAResponse<RegisterResponse>(200, 'OK')
  @TSOAResponse<ErrorResponse>(401, 'User already exists!')
  @TSOAResponse<ErrorResponse>(500, 'Internal Server Error')
    public async register( @Body() req: RegisterRequest): Promise<RegisterResponse | ErrorResponse> {
      try {
       const user =  await this.authService.register(req);
       console.log(user);
       if(!user) {
        this.setStatus(422)
         return {
          message : 'User details not available after registration.'
         }; 
       }
      
       const token = jwt.sign(
        { 
          id: user.id,
          username: user?.email_address 
        }
        , envVariables.SECRET_TOKEN,
        { 
          noTimestamp:true, 
          expiresIn: '1h' 
        }
        );

       return {
        id: user?.id,
        name: user?.first_name,
        email: user.email_address,
        token: token
      };
      } catch (error){
        if(error instanceof Error) {
         this.setStatus(422)
         return {
          message : error.message,
         };
        } else {
          this.setStatus(500)
          return {
           message : 'Unexpected error.',
          };
        }
      }
    }

    @Example<LoginResponse>({
      token: "52907745-7672-470e-a803-a2f8feb52944",
    })
   @Post("/login")
   public async login(@Body() req: LoginRequest): Promise<LoginResponse | ErrorResponse> {
      try {
         const { error } = Validate(LoginRequest, req);
         const user = await this.authService.login(req);
   
         const token = jwt.sign(
          { 
            id: user.id,
            username: user?.email_address 
          }
          , envVariables.SECRET_TOKEN,
          { 
            noTimestamp:true, 
            expiresIn: '1h' 
          }
          );

         if (error) {
            return {
               message: error.message,
            };
         }
         return {
            token: token,
         };
      } catch (error) {
         if (error instanceof Error) {
            this.setStatus(422);
            return {
               message: error.message,
            };
         } else {
            this.setStatus(500);
            return {
               message: 'Unexpected error.',
            };
         }
      }        
   }

    @Security('jwt')
    @Post('/me')
    @TSOAResponse('401', 'Unauthorized')
    @SuccessResponse('200', 'OK')
    public async me(@Request() req: Request, @Header('X-Access-Token') authorization: string): Promise<AuthenticatedUserResponse | null | ErrorResponse> {
        try {
            const token: any = authorization;
            console.log(token);
            const decodedToken: any = jwt.decode(token);

            if (!decodedToken || !decodedToken.id) {
                this.setStatus(401);
                return { message: 'Unauthorized' };
            }

            const user = await this.authService.findById(decodedToken.id);

            if (!user) {
                this.setStatus(404);
                return { message: 'Invalid user.' };
            }
            
            return {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              emailAddress: user.email_address
            };

        } catch (err) {
            this.setStatus(500);
            return { message: 'Internal Server Error' };
        }
    } 
}
