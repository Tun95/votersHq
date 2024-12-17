//AUTHENTICATION

//REGISTER
export interface RegisterValues {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

//KYC
export interface VerifyKycValues {
  ninNumber: string;
  dob: string;
}

export interface SubmitKycValues {
  ninNumber: string;
  dob: string;
  gender: string;
  firstName: string;
  lastName: string;
  stateOfOrigin: string;
  stateOfResidence: string;
}

export interface FetchedKYCData {
  userData: {
    firstName: string;
    lastName: string;
    stateOfOrigin: string;
    stateOfResidence: string;
  };
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
