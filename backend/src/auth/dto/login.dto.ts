import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'メールアドレスは必須です。' })
  @IsEmail({}, { message: 'メールアドレスの形式が正しくありません。' })
  email: string;

  @IsNotEmpty({ message: 'パスワードは必須です。' })
  @IsString()
  password: string;
}
