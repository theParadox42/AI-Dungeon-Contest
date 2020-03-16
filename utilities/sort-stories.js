function sortStories(stories) {
    return stories.sort((a, b) => {
        if (b.achievement || a.achievement) {
            var largeSortNumber = 10000000000;
            if (b.achievement && a.achievement) {
                var orderList = ["winner", "runner-up", "popular"];
                return (orderList.indexOf(a.achievement) - orderList.indexOf(b.achievement)) * largeSortNumber;
            } else if (a.achievement) {
                return largeSortNumber;
            } else {
                return -largeSortNumber;
            }
        }
        if (b.votes.length == a.votes.length) {
            return b.createdAt - a.createdAt;
        }
        return b.votes.length - a.votes.length;
    });
};
module.exports = sortStories;