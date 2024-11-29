require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const AWS = require("aws-sdk");


const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

AWS.config.update({
    region: bucketRegion,
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  });




  const s3 = new S3();

  
// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  try {
    return s3.getObject(downloadParams).createReadStream();
  } catch (error) {
    console.error(`Error fetching file from S3: ${error.message}`);
    throw new Error(`Could not retrieve file with key: ${fileKey}`);
  }
}
exports.getFileStream = getFileStream