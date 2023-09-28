const middy = require("@middy/core");
const { validateToken } = require("../../../middleware/auth");
const { sendResponse, sendError } = require("../../../responses/index");
const { isIdInBodyVal } = require("../../../middleware/isIdInBodyVal");
const { db } = require("../../../services/db");
const { errorHandler } = require("../../../services/errorHandler");

async function deleteQuiz(event) {
    try {
        const body = JSON.parse(event.body);

        const dbData = await db.delete({
            TableName: "quizDb",
            Key: {
                "id": body.quizId,
                "username": event.username
            },
            ReturnValues: "ALL_OLD"
        }).promise();

        if (Object.keys(dbData).length === 0) {
            return { success: false, message: "No such quiz-id connected to this user" };
        } else {
            return { success: true, message: "Quiz deleted" }
        }
    } catch (error) {
        return { success: false, message: "Something went wrong in the connection with the database" };
    }
}

const handler = middy()
    .handler(async (event) => {
        if (event?.error) {
            return errorHandler(event.error, event.errormsg);
        }

        const result = await deleteQuiz(event);
        if (!result.success) {
            return sendError(401, { success: false, message: result.message });
        } else {
            return sendResponse({ success: true, message: result.message });
        }
    })
    .use(validateToken)
    .use(isIdInBodyVal)

module.exports = { handler };