const server = 'https://dev.sigsense.tech';

export const environment = {
  production: false,
  endpoints: {
    server,
    login: `${server}/login`,
    companies: `${server}/companies`
  }
};
