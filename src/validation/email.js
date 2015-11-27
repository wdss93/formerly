const pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

module.exports = value => typeof value === 'string'
  ? Boolean(value.match(pattern))
  : false