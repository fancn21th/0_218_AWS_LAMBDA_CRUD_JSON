import s3Adaptor from "./s3Adaptor.js";
import { Low } from "lowdb";

export const jsonCrud = async (event) => {
  const db = new Low(new s3Adaptor());

  // read before usage
  await db.read();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        ok: true,
      },
      null,
      2
    ),
  };
};
