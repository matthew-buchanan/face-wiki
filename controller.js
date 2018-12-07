const db = require('./model');
const bcrypt = require('bcrypt');
var markdown = require('markdown').markdown;
const saltRounds = 10;

module.exports = {
  findUserById: function(req, res) {
    db.User.findById(id, function(err, user) {
      if (err) res.sendStatus(404).json('User not found');
      else res.sendStatus(200).json(user);
    })
  },
  createUser: function(req, res) {
    if ((typeof req.body.username === 'undefined') || (typeof req.body.password === 'undefined')) {
      res.sendStatus(403).json('Username or password missing');
    }
    else {
      this.checkUsername(req.body.username, (username, err) =>{
        if(err) res.sendStatus(403).json(err);
        else this.checkPassword(req.body.password, (password, err) => {
          if(err) res.sendStatus(403).json(err);
          else {
            bcrypt.hash(req.body.password, saltRounds).then(hash => {
              db.User.create({username: req.body.username, password: hash}).then((err, user) => { 
                if (err) res.sendStatus(500).json(err);
                else {
                  db.Wall.create({user_id: user._id, text: "Your Markdown text here."})
                  res.sendStatus(202).json(user);
                }
              })
            })
          }
        })
      })
    }
  },
  checkUsername: function(username, cb) {
    if (username.length < 13 && username.length > 3) {
      db.User.findOne({username: username}, function(err, user) {
        if (err) cb(username);
        else cb(new Error('Sorry that username already exists.'));
      })
    }
    else return new Error('Username should be between 4 and 12 characters long');
  },
  checkPassword: function(password, cb) {
    if (password.length < 26 && password.length > 9) {
      cb(password)
    }
    else cb(new Error('Enter password between 10-25 characters'));
  },

  updateWall: function(req, res) {
    if (req.params.userid === {} || (typeof req.body.text === 'undefined')) {
      res.sendStatus(500).json('Error receiving user param or text')
    }
    else {
      db.Wall.findByIdAndUpdate(req.params.userid, {text: req.body.text}, (err, wall) => {
        if (err) res.sendStatus(500).json('Error processing text data')
        res.json(wall);
      })
    }
  },
  getWallInMarkdown: function(req, res) {
    db.Wall.findById(req.params.userid, function(err, user) {
      if(err) res.sendStatus(404).json(err);
      var html = markdown.toHTML(user.text);
      res.sendStatus(200).json(html);
    })
  }

}