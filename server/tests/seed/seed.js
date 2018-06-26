/** Created by alex on 13.07.2017 **/
'use strict';
const {ObjectId} = require('mongodb');

const User = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userThreeId = new ObjectId();
const userFourId = new ObjectId();
const userFiveId = new ObjectId();

const users = [

  // users[0]
  {
    _id: userOneId,
    name: 'Alex',
    local: {
      email: 'test@gmail.com', // test@gmail.com - email must be the same with users[5]
      password: '123456',
    }
  },

  // users[1]
  {
    _id: userTwoId,
    name: 'Mary',
    avatar: '/pathToAvatar/avatar.png',
    facebook: {
      id: 'facebookId1',
      token: 'facebookToken1',
      email: 'mary@gmail.com', // mary@gmail.com - email must be the same with users[2]
    }
  },

  // users[2]
  {
    _id: userThreeId,
    name: 'Sam',
    local: {
      email: 'mary@gmail.com', // mary@gmail.com - email must be the same with users[1]
      password: 'password',
    }
  },

  // users[3]
  {
    _id: userFourId,
    name: 'Innokentiy',
    local: {
      email: 'deus_vult@gmail.com', // mary@gmail.com - email must be the same
      password: 'password',
    }
  },

  // users[4]
  {
    provider: 'facebook',
    token: 'facebookToken2',
    id: 'facebookId2',
    email: 'dmitriy@gmail.com',
    name: 'Dmitriy',
    avatar: '/avatar.png'
  },

  // users[5]
  {
    provider: 'facebook',
    token: 'facebookToken3',
    id: 'facebookId3',
    email: 'test@gmail.com', // test@gmail.com - email must be the same with users[0]
    name: 'Dmitriy',
    avatar: '/avatar.png'
  }
];

const populateUsers = async () => {
  const usersRemoved = await User.remove({});
  const userOne = await new User(users[0]).save();
  const userTwo = await new User(users[1]).save();
};


module.exports = {users, populateUsers};