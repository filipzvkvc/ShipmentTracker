export const BASE_URL = process.env.REACT_APP_API_URL || `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;
export const STORAGE_KEYS = {
  TOKEN : "token",
  USER_ID : "userId"
}


export const USER = {
  FULL_NAME : "fullName",
  EMAIL : "email",
  OLD_PASSWORD : "oldPassword",
  NEW_PASSWORD : "newPassword"
}


export const profileSubmitFields = [

];

export const PAGE_SIZE = 3;