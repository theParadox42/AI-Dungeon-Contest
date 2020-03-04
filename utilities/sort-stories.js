function sortStories(stories) {
    return stories.sort((a, b) => {
        if (b.achievement || a.achievement) {
            if (b.achievement && a.achievement) {
                var orderList = ["winner", "runner-up", "popular"];
                return orderList.indexOf(a.achievement) - orderList.indexOf(b.achievement);
            } else if (a.achievement) {
                return 1;
            } else {
                return -1;
            }
        }
        if (b.votes.length == a.votes.length) {
            return b.createdAt - a.createdAt;
        }
        return b.votes.length - a.votes.length;
    });
};
module.exports = sortStories;