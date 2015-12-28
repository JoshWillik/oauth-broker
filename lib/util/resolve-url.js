module.exports = (baseUrl, url) => {
  return baseUrl.indexOf('://') === -1 ? baseUrl + url : url
}
