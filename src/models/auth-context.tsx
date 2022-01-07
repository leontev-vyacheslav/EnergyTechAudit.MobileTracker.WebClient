export type SignInAsyncFunc = (email: string, password: string) => Promise<void>;
export type SignOutAsyncFunc = () => Promise<void>;
export type GetUserAuthDataFromStorageFunc = () => any;

export type AuthContextModel = {
  user: any,
  signIn: SignInAsyncFunc,
  signOut: SignOutAsyncFunc,
  getUserAuthDataFromStorage: GetUserAuthDataFromStorageFunc
};
