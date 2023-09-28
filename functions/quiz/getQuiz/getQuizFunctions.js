function getQuizById(items, bodyQuizId) {
    for (let item of items) {
        if (item.id === bodyQuizId) {
            const data = {
                Title: item.title,
                Questions: item.qandas
            }

            return { success: true, data: data };
        } else {
            return { success: false, message: "There's no such quiz" };
        }
    }
}

function getQuizList(items) {
    try {
        let quizData = [];

        for (let item of items) {
            quizData.push({
                Title: item.title,
                Author: item.username,
                QuizId: item.id
            });
        }

        return { success: true, data: quizData };
    } catch (error) {
        return { success: false, message: error }
    }
}

module.exports = { getQuizById, getQuizList }