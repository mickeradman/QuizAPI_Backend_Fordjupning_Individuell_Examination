const middy = require('@middy/core');
const jwt = require('jsonwebtoken');
const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../services/db');
const { userBodyVal } = require('../../../middleware/user/userBodyVal');
const { errorHandler } = require('../../../services/errorHandler');

async function loginUser(body) {
    try {
        const user = await db.get({
            TableName: 'examinationQuizUsersDb',
            Key: {
                username: body.username
            }
        }).promise();

        if (user?.Item?.username && user?.Item?.pwd) {
            const { username, pwd } = user.Item;
            if (body.username === username && body.pwd === pwd) {
                return { success: true, username: username };
            } else {
                return { success: false }
            }
        } else {
            return { success: false };
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

        const response = await loginUser(body);

        if (response.success) {
            const token = jwt.sign({ data: response.username }, 'a1b1c1', { expiresIn: '15min' });

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    authorization: 'Bearer ' + token
                },
                body: JSON.stringify({ success: true, message: "Successfully logged in" })
            };
        } else {
            return sendError(401, { success: false, message: "User doesn't exist or username and/or password are wrong" });
        }
    } catch (error) {
        return sendError(400, { success: false, errormessage: error.message })
    }
}).use(userBodyVal);

module.exports = { handler };