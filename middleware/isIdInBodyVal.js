const isIdInBodyVal = {
    before: async (request) => {
        try {
            const body = JSON.parse(request.event.body);

            if (body?.quizId.length === 32) {
                return request.response;
            } else {
                request.event.error = "400";
                request.event.errormsg = "Incorrect body: Invalid quiz-id";
                return request.response;
            }
        } catch (error) {
            
        }
    },
    onError: async (request) => {
        request.event.error = "401";
        request.event.errormsg = "Unknown error"
        return request.response;
    }
};

module.exports = { isIdInBodyVal };