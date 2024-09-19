import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, (user as { id: number }).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return done(new Error('User not found'), null);

    return done(null, user);
  } catch (e) {
    return done(e, null);
  }
});


export default passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // Use 'email' field for username
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email : email.toLowerCase() },
        });

        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);