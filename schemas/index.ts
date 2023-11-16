import * as yup from "yup";

const numberRule = /^(?=.*\d)/;
const lowerCaseRule = /^(?=.*[a-z])/;
const upperCaseRule = /^(?=.*[A-Z])/;
const specialRule = /^(?=.*[A-Z])/;

export const registerSchema = yup.object().shape({
  // username: yup
  //   .string()
  //   .min(6)
  //   .matches(username, {
  //     message: "Username must be alphanumeric",
  //   })
  //   .matches(nospace, {
  //     message: "Username must not contain blank space",
  //   })
  //   .required("Username cannot be empty."),

  password: yup
    .string()
    .min(6)
    .matches(upperCaseRule, {
      message: "Password must contain UPPERCASE letter.",
    })
    .matches(lowerCaseRule, {
      message: "Password must contain an alphabet letter.",
    })
    .matches(specialRule, {
      message: "Password must contain a special character.",
    })
    .matches(numberRule, {
      message: "Password must contain a number.",
    })
    .required("Password cannot be empty."),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email cannot be empty"),

  password2: yup
    .string()
    .required("Confirm password cannot be empty.")
    .oneOf(
      //@ts-ignore
      [yup.ref("password"), null],
      "Password must match"
    ),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email cannot be empty"),

  password: yup.string().required("Password is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email cannot be empty"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6)
    .matches(upperCaseRule, {
      message: "Password must contain UPPERCASE letter.",
    })
    .matches(lowerCaseRule, {
      message: "Password must contain an alphabet letter.",
    })
    .matches(specialRule, {
      message: "Password must contain a special character.",
    })
    .matches(numberRule, {
      message: "Password must contain a number.",
    })
    .required("Password cannot be empty."),
});
