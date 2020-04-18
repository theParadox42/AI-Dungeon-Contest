module.exports = story => {
    var categories = ["relevancy", "humor", "entertainment", "creativity"];
    var totalScore = 0;
    story.scores.forEach(function (score) {
        categories.forEach(function (category) {
            totalScore += Math.max(Math.min(10, score[category]), 0);
        });
    });
    totalScore /= (story.scores.length * categories.length) || 1;
    story.rating = totalScore;
};