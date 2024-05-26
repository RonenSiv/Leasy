export interface FormData {
  email: string;
  password: string;
}

export interface SignupFormData extends FormData {
  fullName: string;
}
