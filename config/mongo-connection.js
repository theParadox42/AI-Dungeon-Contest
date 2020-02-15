module.exports = {
    string: process.env.MONGO_CONNECTION,
    options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
}