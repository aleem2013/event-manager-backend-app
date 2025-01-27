import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterDto {
  @ApiProperty()
  @IsEmail({}, {
    message: i18nValidationMessage('validation.EMAIL.INVALID')
  })
  email: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.PASSWORD.STRING')
  })
  @MinLength(6, {
    message: i18nValidationMessage('validation.PASSWORD.MIN_LENGTH')
  })
  password: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.FIRSTNAME.STRING')
  })
  firstName: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.LASTNAME.STRING')
  })
  lastName: string;
}