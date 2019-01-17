module.exports = function(req, res, next) {
  console.log('Test server middleware loaded')
  next()
}
