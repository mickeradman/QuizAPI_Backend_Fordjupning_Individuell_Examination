const updateBodyVal = {
    before: async (request) => {
        try {
            const body = JSON.parse(request.event.body);

            if (body?.qandas) {
                if (body.qandas.length > 1 && body.qandas.length < 21) {
                    let confirmedCorrectObjects = 0;
                    
                    for (i = 0; i < body.qandas.length; i++) {
                        if (body.qandas[i].q && body.qandas[i].a) {
                            confirmedCorrectObjects += 1;
                        }
                    }

                    if (body.qandas.length === confirmedCorrectObjects) {
                        return request.response;
                    } else {
                        request.event.error = "400";
                        request.event.errormsg = "Incorrect body - question or answer missing";
                        return request.response;
                    }
                } else {
                    request.event.error = "400";
                    request.event.errormsg = "Too few or too many Q&A:s";
                    return request.response;
                }
            } else {
                request.event.error = "400";
                request.event.errormsg = "No Q&A:s in body";
                return request.response;
            }
        } catch (error) {
            request.event.error = "500";
            return request.response;
        }
    },
    onError: async (request) => {
        request.event.error = "401";
        request.event.errormsg = "Unknown error"
        return request.response;
    }
};

module.exports = { updateBodyVal };