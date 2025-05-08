import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles.length) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        // console.log(user, requiredRoles);
        if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        return requiredRoles.some((role) => user.roles?.includes(role));
    }
}
