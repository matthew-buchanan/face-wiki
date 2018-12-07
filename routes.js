const path = require('path');
const router = require('express').Router();
const db = require('./model');
const con = require('./controller');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({username: username}, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!(user.password === password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);      
    })
  }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, function(err, user)  {
    if (err) return done(null, false)
    return done(null, user)
  })
});

router.get('/', function(req, res) {
  if (req.session.passport && req.session.passport.user) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  }
  else {
    res.redirect('/auth');    
  }
})

router.get('/auth', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/login.html'));  
});

router.post('/auth/login', function(req,res) {
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/auth',  failureFlash: true }); 
});

router.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/auth'); 
});

router.route('/auth/signup').post(con.createUser);

router.get('/api/markdown')
  .all(function(req, res) {
    if (req.session.passport && req.session.passport.user) {
      res.redirect('/api/markdown/' + req.session.passport.user)
    }
    else {
      res.sendStatus(403).json('You are not signed in.')
    }
})

router.route('/api/markdown/:userid')
  .get(con.getWallInMarkdown)
  .post(con.updateWall)


module.exports = router;

