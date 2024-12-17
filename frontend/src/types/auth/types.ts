//AUTHENTICATION

//REGISTER
export interface RegisterValues {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

//KYC
export interface KycValues {
  ninNumber: string;
  dob: string;
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
