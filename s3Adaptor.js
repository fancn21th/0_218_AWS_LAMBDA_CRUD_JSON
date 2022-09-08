// thanks to
//  https://github.com/nicekiwi/lowdb-adapter-aws-s3

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { stringify, parse } from "./utils.js";

// refer to
//  https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html

// Create a helper function to convert a ReadableStream to a string.
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export default class s3Adaptor {
  constructor(
    source = "db.json",
    {
      bucketName = process.env.BUCKET,
      serialize = stringify,
      deserialize = parse,
    } = {}
  ) {
    this.source = source;
    this.contentType = "application/json";
    this.bucketName = bucketName;
    this.serialize = serialize;
    this.deserialize = deserialize;

    this.S3 = new S3Client();
  }

  read() {
    return new Promise(async (resolve, reject) => {
      try {
        const getObjectCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: this.source,
        });
        const data = await this.S3.send(getObjectCommand);
        const bodyContents = await streamToString(data.Body);
        resolve(this.deserialize(bodyContents));
      } catch (error) {
        reject(error);
      }
    });
  }

  write(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.S3.send(
          new PutObjectCommand({
            Body: this.serialize(data),
            Bucket: this.bucketName,
            Key: this.source,
            ContentType: this.contentType,
          })
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
