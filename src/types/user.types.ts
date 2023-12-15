export interface UserInfo {
  avatar: string;
  nickName: string;
  email: string;
  captcha: string;
}
export interface UpdatePassword {
  username?: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}
