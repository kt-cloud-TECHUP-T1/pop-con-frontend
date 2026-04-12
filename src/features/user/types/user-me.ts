export type UserMe = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  profileImage: string;
  joinDate: string;
};

export type UserMeResponse = {
  code: 'SUCCESS';
  message: string;
  data: UserMe;
};

export type UserMeErrorResponse = {
  code: string;
  message: string;
  data: null;
};