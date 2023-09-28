const { sendResponse, sendError } = require('../responses/index');

function errorHandler(error, errormsg) {
    if (error) {
        if (error === "400") {
            return sendError(400, { success: false, message: errormsg });
        } else if (error === "401") {
            return sendError(401, { success: false, message: errormsg });
        }else if (error === "500") {
            return sendError(500, { success: false, message: "Server error" });
        }
    }
}

module.exports = { errorHandler };