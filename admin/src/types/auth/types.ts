//AUTHENTICATION

//REGISTER
export interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identificationType: string;
  ninNumber: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  password: string;
  confirmPassword: string;
}

//OTP
export interface OtpValues {
  otp: string;
}

//LOGIN
export interface LoginValues {
  emailOrPhone: string;
  password: string;
}


