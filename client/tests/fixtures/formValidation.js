export const noErrorState = {
  success: true,
  message: '',
  errorInElement: false
};

export const errorStateEmail = {
  success: false,
  message: 'Please provide a correct email address.',
  errorInElement: 'email'
};

export const errorStateTokenInvalid = {
  success: false,
  message: 'Could not authenticate. Please contact site administration',
  errorInElement: false
};

export const undefinedError = {
  success: false,
  message: 'Cannot connect to server',
  errorInElement: false
};
