const { createResponse } = require('../helpers/mockResponse');
const { createRequest } = require('../helpers/mockRequest');

jest.mock('../../src/models/Recipe');

let Recipe;

describe('recipeController', () => {
  let controller;
  beforeEach(() => {
    jest.resetModules();
    Recipe = require('../../src/models/Recipe');
    controller = require('../../src/controllers/recipeController');
  });

  test('createRecipe - success', async () => {
    const saveMock = jest.fn().mockResolvedValue();
    Recipe.mockImplementation(data => ({ ...data, save: saveMock }));

    const req = createRequest({ body: { title: 'R' } });
    const res = createResponse();

    await controller.createRecipe(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'R' }));
  });

  test('getAllRecipes - returns list', async () => {
    Recipe.find = jest.fn().mockResolvedValue([{ title: 'A' }]);
    const req = createRequest();
    const res = createResponse();

    await controller.getAllRecipes(req, res);

    expect(Recipe.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ title: 'A' }]);
  });

  test('getRecipeById - not found returns 404', async () => {
    Recipe.findById = jest.fn().mockResolvedValue(null);
    const req = createRequest({ params: { id: '1' } });
    const res = createResponse();

    await controller.getRecipeById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
  });

  test('updateRecipe - not found returns 404', async () => {
    Recipe.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    const req = createRequest({ params: { id: '1' }, body: { title: 'x' } });
    const res = createResponse();

    await controller.updateRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
  });

  test('deleteRecipe - not found returns 404', async () => {
    Recipe.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    const req = createRequest({ params: { id: '1' } });
    const res = createResponse();

    await controller.deleteRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
  });

  test('addRating - recipe not found returns 404', async () => {
    Recipe.findById = jest.fn().mockResolvedValue(null);
    const req = createRequest({
      params: { id: '1' },
      body: { score: 5, comment: 'c' },
      user: { id: 'u1' },
    });
    const res = createResponse();

    await controller.addRating(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
  });

  test('addRating - success', async () => {
    const recipe = { ratings: [], save: jest.fn().mockResolvedValue(), toJSON: () => {} };
    Recipe.findById = jest.fn().mockResolvedValue(recipe);
    const req = createRequest({
      params: { id: '1' },
      body: { score: 5, comment: 'c' },
      user: { id: 'u1' },
    });
    const res = createResponse();

    await controller.addRating(req, res);

    expect(recipe.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(recipe);
  });

  test('deleteRating - recipe not found returns 404', async () => {
    Recipe.findById = jest.fn().mockResolvedValue(null);
    const req = createRequest({ params: { id: '1', ratingId: 'r1' }, user: { id: 'u1' } });
    const res = createResponse();

    await controller.deleteRating(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
  });

  test('deleteRating - rating not found returns 404', async () => {
    const recipe = { ratings: { id: () => null } };
    Recipe.findById = jest.fn().mockResolvedValue(recipe);
    const req = createRequest({ params: { id: '1', ratingId: 'r1' }, user: { id: 'u1' } });
    const res = createResponse();

    await controller.deleteRating(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Rating not found' });
  });

  test('deleteRating - forbidden when not owner', async () => {
    const recipeObj = {
      ratings: [{ _id: 'r1', userId: 'owner' }],
      save: jest.fn(),
    };
    recipeObj.ratings.id = function (rid) {
      return this.find(r => r._id === rid);
    };
    recipeObj.ratings.pull = function () {};

    Recipe.findById = jest.fn().mockResolvedValue(recipeObj);

    const req = createRequest({ params: { id: '1', ratingId: 'r1' }, user: { id: 'someoneElse' } });
    const res = createResponse();

    await controller.deleteRating(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: You can only delete your own ratings',
    });
  });
});
