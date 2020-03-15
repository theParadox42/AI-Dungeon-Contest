module.exports = {
    string: process.env.MONGO_CONNECTION || console.warn("No mongo connection specified in .env!"),
    options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
}