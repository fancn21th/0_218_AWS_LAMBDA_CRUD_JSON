import s3Adaptor from "./s3Adaptor.js";
import { Low } from "lowdb";

const db = new Low(new s3Adaptor());

// read before usage
await db.read();

const data = db.data;

const _post = async (name, payload, force) => {
  // the first level db name is already existed
  if (data.hasOwnProperty(name) && !force)
    throw new Error(
      "you have not confirm the overridden creation, please contact admin."
    );

  data[name] = payload;
  await db.write();
  return data[name];
};

const _delete = async (name, _, force) => {
  if (!force)
    throw new Error("you have not confirm the deletion, please contact admin.");
  delete data[name];
  await db.write();
};

const _put = (name, payload) => {
  return _post(name, payload);
};

const _get = (name) => {
  if (!data.hasOwnProperty(name)) {
    throw new Error(`no ${name} found in data`);
  }
  return data[name];
};

export { _delete, _get, _post, _put };
