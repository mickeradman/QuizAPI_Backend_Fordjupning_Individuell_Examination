const userBodyVal = {
    before: async (request) => {
        try {
            const body = JSON.parse(request.event.body);

            if (body?.username && body?.pwd && body?.username !== "" && body?.pwd !== "") {
                return request.response;
            } else {
                request.event.error = '400';

                return request.response;
            }
        } catch (error) {
            request.event.error = '500';
            return request.response;
        }
    },
    onError: async (request) => {
        request.event.error = '401';
        return request.response;
    }
};

module.exports = { userBodyVal };