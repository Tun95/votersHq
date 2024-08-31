import * as yup from "yup";

//SUBSCRIBER
export const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const passwordValidationSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Please confirm your new password"),
});

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "First name is too short!")
    .max(50, "First name is too long!")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name is too short!")
    .max(50, "Last name is too long!")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^(\+234|0)[789]\d{9}$/, "Phone number must be in a valid format")
    .required("Phone number is required"),
  identificationType: yup.string().required("Identification type is required"),
  ninNumber: yup
    .string()
    .matches(/^[0-9]{11}$/, "NIN Number must be exactly 11 digits")
    .required("NIN Number is required"),
  stateOfOrigin: yup.string().required("State of Origin is required"),
  stateOfResidence: yup.string().required("State of Residence is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits"),
});

export const loginSchema = yup.object().shape({
  emailOrPhone: yup
    .string()
    .required("Email address or phone number is required")
    .test(
      "emailOrPhone",
      "Please enter a valid email address or phone number",
      function (value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[0-9]{11}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("password is required"),
});

export const timelineSchema = yup.object({
  timelineYear: yup
    .string()
    .required("Year is required")
    .matches(/^\d{4}$/, "Year must be a valid year"),
  timelineTitle: yup.string().required("Title is required"),
  timelineDetails: yup.string().required("Details are required"),
});
