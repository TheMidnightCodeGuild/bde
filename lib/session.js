import { getIronSession } from "iron-session";

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'bde-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function withSessionRoute(handler) {
  return async function sessionRoute(req, res) {
    req.session = await getIronSession(req, res, sessionOptions);
    return handler(req, res);
  };
} 