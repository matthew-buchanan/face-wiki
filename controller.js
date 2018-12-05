const db = require('./model');

module.exports = {
  findUserById: function(req, res) {
    db.User.findById(id, function(err, user) {
      if (err) throw err;
      else return user;
    })
  },
  createUser: function(req, res) {
    var usern = verify.checkUsername(req.body.username);
    var passn = verify.checkPassword(req.body.password);
    if (usern === 'OK') {
      if (passn === 'OK') {
        db.User.create({username: req.body.username, password: req.body.password}, (err, user) => {
          if (err) console.log(err);
          else console.log('signup successful');
        })      
      }
      else {
        res.status(400).send('Bad password');
      }
    }
    else res.status(400).send('Bad username');
  }    
}

verify = {
  checkUsername: function(username) {
    if (username.length < 13 && username.length > 4) {
      db.User.findOne({username: username}, function(err, user) {
        if (err) return true;
        return 'Sorry that username already exists.';
      })
    }
    else return 'Enter username of 5-12 characters.';
  },
  checkPassword: function(password) {
    if (password.length < 26 && password.length > 9) {
      return 'OK';
    }
    else return 'Enter password of 10-25 characters.';
  }

}