const jwt = require('jsonwebtoken');

const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '');

            const decoded = jwt.verify(token, 'a1b1c1');
            request.event.username = decoded.data;

            return request.response;
        } catch (error) {
            request.event.error = '401';
            request.event.errormsg = "Invalid token";
            return request.response;
        }
    },
    onError: async (request) => {
        request.event.error = '401';
        return request.response;
    }
};

module.exports = { validateToken };