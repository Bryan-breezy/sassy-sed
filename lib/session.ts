import { getIronSession, IronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionData } from '@/types'

class SessionManager {
  private static instance: SessionManager
  private sessionOptions: SessionOptions

  private constructor() {
    const password = this.getValidatedPassword()
    
    this.sessionOptions = {
      password: password,
      cookieName: 'sassy-web-cookie',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      },
    };
  }

  private getValidatedPassword(): string {
    const password = process.env.SECRET_COOKIE_PASSWORD

    if (!password) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using development fallback password. Set SECRET_COOKIE_PASSWORD for production.');
        return 'dev-secret-password-32-chars-minimum-required'.slice(0, 32);
      }
      throw new Error('SECRET_COOKIE_PASSWORD environment variable is required');
    }

    if (password.length < 32) {
      console.warn('SECRET_COOKIE_PASSWORD should be at least 32 characters for security');
    }

    return password
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  public async getSession(): Promise<IronSession<SessionData>> {
    return await getIronSession<SessionData>(await cookies(), this.sessionOptions)
  }
}

export const sessionManager = SessionManager.getInstance()
export const getSession = () => sessionManager.getSession()