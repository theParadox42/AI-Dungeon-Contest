function sortStories(stories) {
    return stories.sort((a, b) => b.createdAt - a.createdAt);
};
module.exports = sortStories;