require("dotenv").config(); //MAKE THIS WHOLE FILE IN THE ROOT LEVEL.
const express = require("express"),
  bodyParser = require("body-parser"),
  massive = require("massive"),
  session = require("express-session"),
  Auth0Strategy = require("passport-auth0"), //With auth0.com go into client advanced setting 0Auth and turn off OIDC Conformant.
  passport = require("passport");
// cors = require("cors");

const app = express(); //Require everything that is needed and try to think of everything you will use.

app.use(bodyParser.json());
// app.use(cors());
app.use(
  session({
    secret: process.env.SECRET, //With the .env use process.env.*Subject in the env file*.
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session()); //Always do the passport in this order  .use passport secret > passport initialize > session.

massive(process.env.CONNECTION_STRING).then(db => {
  //If there is a connection issue or promise problem with the connection to the database the .then() will not fire.
  //This takes in the db from the string sends it in as a parameter and sets it to "db".
  app.set("db", db);
});

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH_DOMAIN,
      clientID: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET, //Pull the first three values from auth0.com site with a new client.
      callbackURL: process.env.CALLBACK_URL // Callback will be input afterwards an will take you to the__
      // page after you login. Usually your dashboard. This also needs to be input into autho.com allowed callback urls.
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      //These variables HAVE to go into thise function and this function is required.
      //db calls go here!
      const db = app.get("db");

      db.find_user([profile.identities[0].user_id]).then(user => {
        //This fire and if successful sends to serialize user.
        if (user[0]) {
          return done(null, user[0].id);
        } else {
          const user = profile._json;
          db
            .create_user([
              user.name,
              user.email,
              user.picture,
              user.identities[0].user_id
            ])
            .then(user => {
              return done(null, user[0].id);
            });
        }
      }); //This accesses the user id given to the user through auth 0 and helps find the database items that match that id,__
      //and this is how we are able to get a user id and set it to elements in the database or elsewhere.
    }
  )
);

app.get("/auth", passport.authenticate("auth0")); //Have to pass in auth0 as a params exactly like that.
app.get(
  "/auth/callback",
  passport.authenticate("auth0", {
    successRedirect: "http://localhost:3000/#/private",
    failureRedirect: "/auth"
  })
);
app.get("/auth/me", (req, res) => {
  if (!req.user) {
    return res.status(404).send("User not found");
  }
  return res.status(200).send(req.user);
});
app.get("/auth/logout", (req, res) => {
  req.logOut();
  res.redirect(302, "http://localhost:3000/#/");
});
passport.serializeUser(function(id, done) {
  done(null, id); //First parameter is the information passed in for the user. This gets hit once and the parameter gets set to an express session.
});

passport.deserializeUser(function(id, done) {
  //Putting this on req.user. Only for the life of the request.
  //Any endpoints we hit from here on out we have access to the currently logged on user's information from req.user.
  app
    .get("db")
    .find_current_user([id])
    .then(user => {
      done(null, user[0]);
    });
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
