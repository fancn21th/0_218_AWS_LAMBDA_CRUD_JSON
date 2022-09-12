import s3Adaptor from "./s3Adaptor.js";
import { Low } from "lowdb";

const db = new Low(new s3Adaptor());

// read before usage
await db.read();

const data = db.data;

const _post = async ({ itemType: name, data: payload, itemId: id }) => {
  if (!data.hasOwnProperty(name)) {
    // no table of given name created before
    data[name] = {
      id: payload,
    };
  } else {
    data[name][id] = payload;
  }
  await db.write();
  return data[name];
};

const _delete = async ({ itemType: name, isForced: force }) => {
  if (!force)
    throw new Error(
      "you have not confirmed the deletion, please contact with admin."
    );
  delete data[name];
  await db.write();
};

const _put = async ({
  itemType: name,
  data: payload,
  isForced: force,
  itemId: id,
}) => {
  if (!data.hasOwnProperty(name)) {
    throw new Error(`no ${name} found in db`);
  }

  const found = data[name][id];

  if (!found) {
    throw new Error(`no ${id} found in db ${name}`);
  }

  data[name][id] = payload;

  await db.write();
  return data[name];
};

const _get = ({ itemType: name }) => {
  if (!data.hasOwnProperty(name)) {
    throw new Error(`no ${name} found in db`);
  }
  return data[name];
};

export { _delete, _get, _post, _put };
