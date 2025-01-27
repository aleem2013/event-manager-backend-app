import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private i18n: I18nService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Inside RolesGuard');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          await this.i18n.translate('auth.ROLES.INSUFFICIENT_PERMISSION')
        );
    }
    return true;
  }
}