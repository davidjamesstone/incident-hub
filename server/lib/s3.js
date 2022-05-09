const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

module.exports = s3
