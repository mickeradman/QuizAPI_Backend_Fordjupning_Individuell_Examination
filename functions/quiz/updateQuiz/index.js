const middy = require("@middy/core");
const { validateToken } = require("../../../middleware/auth");
const randomCoordinates = require("random-coordinates");
const { sendResponse, sendError } = require("../../../responses/index");
const { updateBodyVal } = require("../../../middleware/quiz/updateBodyVal");
const { isIdInBodyVal } = require("../../../middleware/isIdInBodyVal");
const { db } = require("../../../services/db");
const { errorHandler } = require("../../../services/errorHandler");

async function updateQuiz(event) {
    try {
        const body = JSON.parse(event.body);

        for (i = 0; i < body.qandas.length; i++) {
            body.qandas[i].location = randomCoordinates();
        }

        await db.update({
            TableName: "quizDb",
            Key: {
                "id": body.quizId,
                "username": event.username
            },
            UpdateExpression: "SET #array = list_append(#array, :newArray)",
            ExpressionAttributeNames: { "#array": "qandas" },
            ExpressionAttributeValues: { ":newArray": body.qandas }
        }).promise();

        return { success: true, updateObj: body.qandas };
    } catch (error) {
        return { success: false };
    }
}

const handler = middy()
    .handler(async (event) => {
        if (event?.error) {
            return errorHandler(event.error, event.errormsg);
        }

        const result = await updateQuiz(event);
        if (!result.success) {
            return sendError(401, { success: false, message: "Quiz-id not found... probably..." });
        } else {
            return sendResponse({ success: true, message: "Quiz updated!", updateObj: result.updateObj });
        }
    })
    .use(validateToken)
    .use(isIdInBodyVal)
    .use(updateBodyVal);

module.exports = { handler };