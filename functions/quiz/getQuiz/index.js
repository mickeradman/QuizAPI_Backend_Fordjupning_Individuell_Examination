const middy = require("@middy/core");
const { sendResponse, sendError } = require("../../../responses/index");
const { db } = require("../../../services/db");
const { errorHandler } = require("../../../services/errorHandler");
const { getQuizById, getQuizList } = require("./getQuizFunctions");

async function getQuiz(event) {
    try {
        const body = JSON.parse(event.body);

        const dbData = await db.scan({
            TableName: "quizDb"
        }).promise();

        if (body?.type === "id" && body?.quizId.length === 32) {
            return getQuizById(dbData.Items, body.quizId)
        } else if (body?.type === "list") {
            return getQuizList(dbData.Items)
        } else {
            return { success: false, message: "Invalid search parameters" }
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

        const result = await getQuiz(event);
        if (!result.success) {
            return sendError(401, { success: false, message: result.message });
        } else {
            return sendResponse({ success: true, message: "Quiz data retrieved", quizData: result.data });
        }
    })

module.exports = { handler };