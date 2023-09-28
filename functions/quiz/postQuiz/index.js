const middy = require("@middy/core");
const { validateToken } = require("../../../middleware/auth");
const { nanoid } = require("nanoid");
const { DateTime } = require("luxon");
const randomCoordinates = require('random-coordinates');
const { sendResponse, sendError } = require("../../../responses/index");
const { postBodyVal } = require("../../../middleware/quiz/postBodyVal");
const { db } = require('../../../services/db');
const { errorHandler } = require('../../../services/errorHandler');

async function createQuiz(event) {
    try {
        const body = JSON.parse(event.body);

        for (i = 0; i < body.qandas.length; i++) {
            body.qandas[i].location = randomCoordinates();
        }

        const quizObj = {
            quizId: DateTime.local().setZone("Europe/Stockholm").toFormat("yyyy-MM-dd") + "-" + nanoid(),
            username: event.username,
            title: body.title,
            qandas: body.qandas,
        }

        await db.put({
            TableName: "quizDb",
            Item: {
                "id": quizObj.quizId,
                "username": quizObj.username,
                "title": quizObj.title,
                "qandas": quizObj.qandas
            }
        }).promise();

        return quizObj;
    } catch (error) {
        return { success: false };
    }
}

const handler = middy()
    .handler(async (event) => {
        if (event?.error) {
            return errorHandler(event.error, event.errormsg);
        }

        const result = await createQuiz(event);
        if (!result?.quizId) {
            return sendError(401, { success: false, message: "Something went wrong in the connection with the database" });
        } else {
            return sendResponse({ success: true, message: "Quiz saved!", quizObj: result });
        }
    })
    .use(validateToken)
    .use(postBodyVal);

module.exports = { handler };