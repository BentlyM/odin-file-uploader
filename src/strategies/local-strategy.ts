import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) return done(null, false, { message: 'Incorrect email' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });

        return done(null, {
          id: user.id,
          email: user.email,
        });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, (user as {id: number}).id);
})

passport.deserializeUser(async (id : number, done) => {
    try {
        const user = await prisma.user.findUnique({where: {id}});
        if(!user) return done(new Error('User not found'), null);

        return done(null, {id : user.id, email: user.email});
    }catch(e){
        return done(e, null);
    }
})