import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, {
    message: i18nValidationMessage('validation.EMAIL.INVALID')
  })
  email: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.PASSWORD.STRING')
  })
  password: string;
}