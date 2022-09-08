import s3Adaptor from "./s3Adaptor.js";
import { Low } from "lowdb";

const db = new Low(new s3Adaptor());

// read before usage
await db.read();

const _post = async (name, payload) => {
  db[name] = payload;
  await db.write();
  return db[name];
};

const _delete = async (name) => {
  delete db[name];
  await db.write();
};

const _put = (name, payload) => {
  return _post(name, payload);
};

const _get = (name) => {
  return db[name];
};

export default {
  _delete,
  _get,
  _post,
  _put,
};
