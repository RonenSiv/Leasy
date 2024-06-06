import validator from "validator";

const loginFormValidator = (values: any) => {
  const data = {
    email: !validator.isEmail(values.email),
    password: !validator.isStrongPassword(values.password),
  };
  const result =
    validator.isEmail(values.email) &&
    validator.isStrongPassword(values.password);
  return { data, result };
};

const registerFormValidator = (values: any) => {
  const fullNameValidator = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;

  const data = {
    email: !validator.isEmail(values.email),
    password: !validator.isStrongPassword(values.password),
    confirmPassword: !validator.equals(values.password, values.confirmPassword),
    fullName: !fullNameValidator.test(values.fullName),
  };

  const result =
    validator.isEmail(values.email) &&
    validator.isStrongPassword(values.password) &&
    validator.equals(values.password, values.confirmPassword) &&
    fullNameValidator.test(values.fullName);
  return { data, result };
};

export { loginFormValidator, registerFormValidator };
