import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { RedisCoreService } from "src/redis-core/redis-core.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly redisService: RedisCoreService
  ) {}

  async canActivate(context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest();
    // const ctx = context.switchToHttp() || context.switchToWs();
    let token: string | null = null;
    if (context.getType() === 'http') {
      // HTTP context
      console.log('inside1');
      const request = context.switchToHttp().getRequest();
      token = this.extractTokenFromHttp(request);
    } else if (context.getType() === 'ws') {
      console.log('inside2');
      // WebSocket context
      const client = context.switchToWs().getClient();
      token = this.extractTokenFromWs(client);
    } else {
      throw new UnauthorizedException('Unsupported context');
    }

    // const token = this.getTokenFromHeaders(request.headers);

    if (!token) throw new UnauthorizedException('Invalid token');

    const decodedToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    // request.token = token;

    // const cacheKey = `${process.env.USER_CACHE_KEY}${decodedToken.email}:${token}`;
    // const cacheKey = `${process.env.USER_CACHE_KEY}${decodedToken.email}:authToken`;

    // let user = await this.redisService.get(cacheKey);

    // if (!user) throw new UnauthorizedException('Invalid Token');

    // user = JSON.parse(user);

    if (!decodedToken.verified) {
      throw new UnauthorizedException('Please Verify Your Account First');
    }
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      request.user_details = decodedToken;
    } else if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient();
      client.user_details = decodedToken;
    }

    // request.user_details = Object.assign({}, decodedToken, decodedToken);

    return true;
  }

  // private getTokenFromHeaders(headers: any): string {
  //     if (headers && headers.authorization) {
  //         const authHeader = headers.authorization;

  //         const [bearer, token] = authHeader.split(' ');

  //         if (bearer === 'Bearer' && token) {
  //             return token;
  //         }
  //     }
  //     return null;
  // }
  private extractTokenFromHttp(request: any): string | null {
    console.log('inside3');
    if (request.headers && request.headers.authorization) {
      const [bearer, token] = request.headers.authorization.split(' ');
      if (bearer === 'Bearer' && token) {
        return token;
      }
    }
    return null;
  }

  private extractTokenFromWs(client: any): string | null {
    console.log('inside4');
    return (
      client.handshake.query.token ||
      client.handshake.headers['authorization']?.split(' ')[1]
    );
  }
}
