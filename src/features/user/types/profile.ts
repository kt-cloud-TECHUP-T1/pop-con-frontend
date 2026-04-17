export type UpdateProfileData = {
  nickname: string;
  profileImage: string | null;
};

export type UpdateProfileSuccessResponse = {
  code: 'SUCCESS';
  message: string;
  data: UpdateProfileData;
};

export type UpdateProfileErrorCode =
  | 'C001'
  | 'U003'
  | 'F001'
  | 'F002'
  | 'A002'
  | 'A003'
  | 'S001'
  | string;

export type UpdateProfileErrorResponse = {
  code: UpdateProfileErrorCode;
  message: string;
  data: null;
};

export type UpdateProfileResponse =
  | UpdateProfileSuccessResponse
  | UpdateProfileErrorResponse;
