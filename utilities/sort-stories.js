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
        return b.createdAt - a.createdAt;
    });
};
module.exports = sortStories;