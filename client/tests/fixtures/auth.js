export const notAuthenticated = {
  user: false,
  redirectToReferrer: false
};

export const authenticated = {
  user: {
    _id: 'abc123',
    name: 'Name',
    token: 'JWTabc123'
  },
  redirectToReferrer: true
};