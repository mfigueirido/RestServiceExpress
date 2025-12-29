const { createResponse } = require('../helpers/mockResponse');
const { createRequest } = require('../helpers/mockRequest');

jest.mock('../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

let User;
let bcrypt;
let jwt;

describe('authController', () => {
  let controller;
  beforeEach(() => {
    jest.resetModules();
    User = require('../../src/models/User');
    bcrypt = require('bcryptjs');
    jwt = require('jsonwebtoken');
    controller = require('../../src/controllers/authController');
  });

  test('register - missing fields returns 400', async () => {
    const req = createRequest({ body: { email: 'a@b.com' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing fields' });
  });

  test('register - existing email returns 409', async () => {
    User.findOne = jest.fn().mockResolvedValue({ email: 'a@b.com' });
    const req = createRequest({ body: { name: 'x', email: 'a@b.com', password: 'p' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.register(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
  });

  test('register - success returns token and user', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
    bcrypt.hash = jest.fn().mockResolvedValue('hash');
    const createdUser = { _id: 'uid', name: 'Name', email: 'a@b.com' };
    User.create = jest.fn().mockResolvedValue(createdUser);
    jwt.sign = jest.fn().mockReturnValue('token');

    const req = createRequest({ body: { name: 'Name', email: 'a@b.com', password: 'p' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.register(req, res, next);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token: 'token',
      user: { id: 'uid', name: 'Name', email: 'a@b.com' },
    });
  });

  test('login - missing fields returns 400', async () => {
    const req = createRequest({ body: { email: '' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing fields' });
  });

  test('login - invalid credentials when user not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const req = createRequest({ body: { email: 'a@b.com', password: 'p' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('login - invalid credentials when password wrong', async () => {
    User.findOne = jest.fn().mockResolvedValue({ password: 'hash' });
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    const req = createRequest({ body: { email: 'a@b.com', password: 'p' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('login - success returns token and user', async () => {
    const foundUser = { _id: 'uid', name: 'Name', email: 'a@b.com', password: 'hash' };
    User.findOne = jest.fn().mockResolvedValue(foundUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('token');

    const req = createRequest({ body: { email: 'a@b.com', password: 'p' } });
    const res = createResponse();
    const next = jest.fn();

    await controller.login(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      token: 'token',
      user: { id: 'uid', name: 'Name', email: 'a@b.com' },
    });
  });
});
