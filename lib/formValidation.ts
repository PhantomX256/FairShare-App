/**
 * Represents a validation error with a specific error code.
 *
 * @extends {Error}
 */
class ValidationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ValidationError";
  }
}

/**
 * Validates whether the given email address is in a proper format.
 *
 */
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates whether the given password is at least 8 characters long.
 *
 */
const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validates whether the given password and confirm password match.
 *
 */
const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Validates the sign-in credentials provided by the user.
 *
 * @throws Will throw an error if the email address is empty.
 * @throws Will throw an error if the password is empty.
 * @throws Will throw an error if the email address is invalid.
 */
export const validateSignInCredentials = (
  email: string,
  password: string
): boolean => {
  // Check if email is null, empty, or just whitespace
  if (!email.trim())
    throw new ValidationError(
      "ERR_EMPTY_EMAIL",
      "Please enter an email address."
    );

  // Check if password is null, empty, or just whitespace
  if (!password.trim())
    throw new ValidationError("ERR_EMPTY_PASSWORD", "Please enter a password.");

  // If the email address is invalid then throw an error
  if (!validateEmail(email))
    throw new ValidationError("ERR_INVALID_EMAIL", "Invalid email address.");

  // Return true if the email address is valid
  return true;
};

/**
 * Validates the sign-up credentials provided by the user.
 *
 * @throws Will throw an error if any of the fields are empty.
 * @throws Will throw an error if the email address is invalid.
 * @throws Will throw an error if the password is less than 8 characters long.
 * @throws Will throw an error if the passwords do not match.
 */
export const validateSignUpCredentials = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  // Check if any of the fields are empty and if so throw an error
  if (
    !fullName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  )
    throw new ValidationError("ERR_EMPTY_FIELDS", "Please enter all fields.");

  // If the email address is invalid then throw an error
  if (!validateEmail(email))
    throw new ValidationError("ERR_INVALID_EMAIL", "Invalid email address.");

  // If the password is less than 8 characters then throw an error
  if (!validatePassword(password))
    throw new ValidationError(
      "ERR_SHORT_PASSWORD",
      "Password must be at least 8 characters long."
    );

  // If the passwords do not match then throw an error
  if (!validatePasswordMatch(password, confirmPassword))
    throw new ValidationError(
      "ERR_PASSWORD_MISMATCH",
      "Passwords do not match."
    );

  return true;
};
