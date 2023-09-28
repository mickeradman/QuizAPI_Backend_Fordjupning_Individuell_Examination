const middy = require('@middy/core');
const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../services/db');
const { userBodyVal } = require('../../../middleware/user/userBodyVal');
const { errorHandler } = require('../../../services/errorHandler');

async function regUser(body) {
    try {
        const user = await db.get({
            TableName: 'examinationQuizUsersDb',
            Key: {
                username: body.username
            },
            ProjectionExpression: "username"
        }).promise();

        if (user?.Item) {
            return { success: false }
        } else {
            await db.put({
                TableName: 'examinationQuizUsersDb',
                Item: {
                    'username': body.username,
                    'pwd': body.pwd
                }
            }).promise();

            return { success: true };
        };
    } catch (error) {
        console.log(error);
    }
}

const handler = middy().handler(async (event) => {
    const body = JSON.parse(event.body);

    try {
        if (event?.error) {
            return errorHandler(event.error);
        }

        const response = await regUser(body);

        if (response.success) {
            return sendResponse({ success: true, message: "User successfully created" });
        } else {
            return sendResponse({ success: false, message: "Username already in use" });
        }
    } catch (error) {
        return sendError(400, { success: false, message: error.message })
    }
}).use(userBodyVal);

module.exports = { handler };