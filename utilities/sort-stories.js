function sortStories(stories) {
    return stories.sort((a, b) => {
        if (b.achievement || a.achievement) {
            if (b.achievement && a.achievement) {
                var orderList = ["winner", "runner-up", "popular"];
                return (orderList.indexOf(a.achievement) - orderList.indexOf(b.achievement)) > 0 ? 50 : -50;
            } else if (a.achievement) {
                return 100;
            } else {
                return -100;
            }
        }
        if (b.votes.length == a.votes.length) {
            return b.createdAt - a.createdAt > 0 ? 1 : -1;
        }
        return b.votes.length - a.votes.length > 0 ? 10 : -10;
    });
};
module.exports = sortStories;