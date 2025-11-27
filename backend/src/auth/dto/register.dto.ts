import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'ユーザー名は必須です。' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'メールアドレスは必須です。' })
  @IsEmail({}, { message: 'メールアドレスの形式が正しくありません。' })
  email: string;

  @IsNotEmpty({ message: 'パスワードは必須です。' })
  @MinLength(8, { message: 'パスワードは8文字以上にしてください。' })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
