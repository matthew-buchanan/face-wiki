const mongoose = require('mongoose');
const Schema = require(mongoose.Schema);

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});
const wallSchema = new Schema({
  text: {type: String, required: true},
  user_id: {type: Schema.Types.ObjectId, required: true}
})

const User = mongoose.model('User', userSchema);
const Wall = mongoose.model('Wall', wallSchema);

module.exports = {
  User: User,
  Wall: Wall
};