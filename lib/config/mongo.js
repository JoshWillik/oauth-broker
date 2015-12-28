module.exports = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT || 27017,
  db: process.env.MONGO_DB,
}
