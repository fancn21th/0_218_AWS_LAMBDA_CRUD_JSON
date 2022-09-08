import { _post, _put, _delete, _get } from "./dbAgent.js";
import { stringify, parse } from "./utils.js";

const handlerMap = {
  POST: _post,
  GET: _get,
  DELETE: _delete,
  PUT: _put,
};

export const jsonCrud = async (event) => {
  console.log({
    event,
  });

  try {
    const _method = event.httpMethod;
    const _body = parse(event.body); // body
    const _query = event.queryStringParameters; // query string

    const _name = _method === "GET" ? _query.name : _body.name;

    if (!_name) throw new Error("no db name is provided");

    const _data = _body.data || {};
    const _value = await handlerMap[_method](_name, _data);

    return {
      statusCode: 200,
      body: stringify({
        ok: true,
        data: {
          _name: _value,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: stringify({
        ok: false,
        error: error,
      }),
    };
  }
};
