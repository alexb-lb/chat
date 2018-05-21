const fs = require('fs');

const assert = require('expect');
const request = require('supertest');

const {ObjectId} = require('mongodb');

const {app} = require('../server');
const {User} = require('./../models/user');
const {users, populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);

describe('GET *', () => {
  it('should return index page with app html', done => {
    const html = fs.readFileSync('./public/app.html', 'utf8');

    request(app)
      .get('/')
      .expect(200)
      .expect(res => assert(res.text).toBe(html))
      .end(done);
  })
});

describe('POST /login', () => {
  it('should login user and return user info object with token', (done) => {
    request(app)
      .post('/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        assert(res.body.success).toBe(true);
        assert(res.body.user._id).toBe(users[1]._id.toString());
        assert(res.body.user.name).toBe(users[1].name);
        assert(typeof res.body.user.token).toBe('string');
      })
      .end(done)
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/login')
      .send({email: users[1].email, password: users[1].password + '1'})
      .expect(404)
      .expect('Content-Type', /json/)
      .expect(res => {
        assert(res.body).toEqual({
          success: false,
          message: 'Incorrect password',
          errorInElement: 'password'
        });
      })
      .end(done)
  })
});

describe('POST /register', () => {
  it('should register user and return user info object with token', (done) => {
    request(app)
      .post('/register')
      .send(users[2])
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        assert(res.body.success).toBe(true);
        assert(res.body.user._id).toBe(users[2]._id.toString());
        assert(res.body.user.name).toBe(users[2].name);
        assert(typeof res.body.user.token).toBe('string');
      })
      .end(done)
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/register')
      .send({email: 'trulala', password: '123456', name: 'Lolobot'})
      .expect(400)
      .expect(res => {
        assert(res.body).toEqual({
          success: false,
          message: 'Please provide a correct email address.',
          errorInElement: 'email'
        });
      })
      .end(done)
  });

  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/register')
      .send(users[0])
      .expect(409)
      .expect(res => {
        assert(res.body).toEqual({
          success: false,
          message: 'This email is already taken',
          errorInElement: 'email'
        });
      })
      .end(done)
  });
});