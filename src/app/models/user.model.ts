export interface UserModel {
  name: string
  validTo: Date;
  email: string
  roles: string[]
  token: string
}
