import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id!,
      clientSecret: config.google_client_secret!,
      callbackURL: config.google_callback_url!,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);

        const googleUser = {
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          image: profile.photos?.[0]?.value,
        };

        return done(null, googleUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;