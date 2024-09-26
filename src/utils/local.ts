const emailActivation = {
  title: 'Activate your PathQuest Account',
  subTitle: 'We have sent a confirmation email to',
  backButton: 'Back to Login',
}

const forgotConfirm = {
  title: 'Check Your Email',
  message: 'A password reset email has been sent to',
  description:
    'If you do not receive the email in a timely manner, please try again and make sure that you provide the correct email address.',
  backButton: 'Back to Login',
}

const forgotPasswordContent = {
  title: 'Forgot Password',
  sendEmailButton: 'SEND EMAIL',
  backButton: 'Back to Login',
}

const signInContent = {
  title: 'Sign In',
  forgotPassword: 'Forgot Password?',
  signInBtn: 'SIGN IN',
  continueWith: 'or Continue with',
  signUpBtn: 'Sign Up',
  notHaveAccount: "Don't have an account?",
}

const signUpContent = {
  title: "Let's Get Started!",
  subTitle: 'It will take just a few minutes.',
  signUpBtn: 'SIGN UP',
  termAndConditions: 'Terms & Conditions',
  continueWith: 'or Continue with',
  alreadyHaveAccount: 'Already have an account?',
  signInBtn: 'Sign In',
}

const verificationContent = {
  description: 'Account Verification',
  sendInfo: 'Please enter an OTP sent to you on',
  verifyBtn: 'VERIFY',
  resendBtn: 'Click here',
  linkText: `Haven't received the OTP yet?`,
  resendOtpMessage: 'We have resend the OTP to your registered email address',
}

const setPasswordContent = {
  description: 'Please set a new password for your account.',
  errorMessage: 'Password does not match!',
  continueBtn: 'CONTINUE',
}

const ConfirmationModalContent = {
  title: (value: string) => value,
  content: (value: string) => `Are you sure you want to remove this ${value} ?`,
}

export {
  emailActivation,
  forgotConfirm,
  forgotPasswordContent,
  signInContent,
  signUpContent,
  verificationContent,
  setPasswordContent,
  ConfirmationModalContent,
}
