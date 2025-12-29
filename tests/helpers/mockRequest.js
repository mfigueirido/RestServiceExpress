function createRequest({ body = {}, params = {}, user = {} } = {}) {
  return { body, params, user };
}

module.exports = { createRequest };
