const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback"
        },

        async (accessToken, refreshToken, profile, done) => {
            try {

                const email = profile.emails[0].value;

                // 1️⃣ पहले googleId से check
                let user = await User.findOne({
                    googleId: profile.id
                });

                if (user) {
                    return done(null, user);
                }

                // 2️⃣ अगर email already exist है
                user = await User.findOne({ email });

                if (user) {

                    // existing account को google से link करो
                    user.googleId = profile.id;

                    if (!user.profilePic) {
                        user.profilePic = profile.photos[0].value;
                    }

                    await user.save();

                    return done(null, user);
                }

                // 3️⃣ new user create करो
                user = await User.create({
                    name: profile.displayName,
                    email,
                    googleId: profile.id,
                    profilePic: profile.photos?.[0]?.value || "",
                    isProfileComplete: false
                });

                return done(null, user);

            } catch (err) {

                return done(err, null);

            }
        }
    )
);


// session handling
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});