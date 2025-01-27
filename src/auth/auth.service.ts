import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
        throw new UnauthorizedException(
            await this.i18n.translate('auth.LOGIN.USER_NOT_FOUND')
        );
    }
    
    if (await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException(
        await this.i18n.translate('auth.LOGIN.INVALID_CREDENTIALS')
    );
  }
  /*
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }*/

  //async login(user: User) {
  async login(user: Partial<User>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user.firstName,
      message: await this.i18n.translate('auth.LOGIN.SUCCESS')
    };
  }

  async register(createUserDto: any) {

    const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
    });
    
    if (existingUser) {
        throw new UnauthorizedException(
            await this.i18n.translate('auth.REGISTER.EMAIL_EXISTS')
        );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save<User>(newUser);
    //const { password: _, ...result } = savedUser;
    return {
        ...savedUser,
        message: await this.i18n.translate('auth.REGISTER.SUCCESS')
    };
  }
}