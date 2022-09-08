import s3Adaptor from "./s3Adaptor.js";
import { Low } from "lowdb";

const db = new Low(new s3Adaptor());

// read before usage
await db.read();

const data = db.data;

const _post = async (name, payload) => {
  data[name] = payload;
  await db.write();
  return data[name];
};

const _delete = async (name) => {
  delete data[name];
  await db.write();
};

const _put = (name, payload) => {
  return _post(name, payload);
};

const _get = (name) => {
  return data[name];
};

export { _delete, _get, _post, _put };
