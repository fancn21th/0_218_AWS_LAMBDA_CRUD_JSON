import { _post, _put, _delete, _get } from "./dbAgent";
import { stringify } from "./utils";

const handlerMap = {
  POST: _post,
  GET: _get,
  DELETE: _delete,
  PUT: _put,
};

export const jsonCrud = async (event) => {
  try {
    const _method = event.httpMethod;
    const _name =
      _method === "GET" ? event.queryStringParameters.name : event.name;

    if (!_name) throw new Error("no db table name is provided");

    const _data = event.data || {};
    const result = await handlerMap[_method](_name, _data);

    return {
      statusCode: 200,
      body: stringify({
        ok: true,
        result,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: stringify({
        ok: false,
        error: error,
      }),
    };
  }
};
