/** Created by alex on 13.07.2017 **/
'use strict';
const {ObjectId} = require('mongodb');

const User = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userThreeId = new ObjectId();

const users = [
  {
    _id: userOneId,
    email: 'test@gmail.com',
    password: '123456',
    name: 'Alex'
  },
  {
    _id: userTwoId,
    email: '12@gmail.com',
    password: 'QQQQQQ',
    name: 'Mary'
  },
  {
    _id: userThreeId,
    email: 'newuser@lol.com',
    password: 'password',
    name: 'Sam',
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo])
    })
    .then(() => done());
};


module.exports = {users, populateUsers};