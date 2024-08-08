import { CanActivate, ExecutionContext, Injectable , UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private jwtService: JwtService){}

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const rq = context.switchToHttp().getRequest();
    const token = this.getToken(rq);
    if(!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.ACCESS_TOKEN
          }
      );
      rq['account'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    
    return true;
  }

  private getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
