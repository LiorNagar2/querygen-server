export default () => ({
  port: Number(process.env.PORT) || 3001,
  mongoUri: process.env.MOGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET || '',
  },
  googleClientID: process.env.GOOGLE_CLIENT_ID || '',
});
