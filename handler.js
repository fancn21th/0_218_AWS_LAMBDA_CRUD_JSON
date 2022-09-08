import { _post, _put, _delete, _get } from "./dbAgent.js";
import { stringify, parse } from "./utils.js";

const handlerMap = {
  POST: _post,
  GET: _get,
  DELETE: _delete,
  PUT: _put,
};

const noBodyMethods = ["GET", "DELETE"];

export const jsonCrud = async (event) => {
  // console.log({
  //   event,
  // });

  try {
    const _method = event.httpMethod;
    const _body = parse(event.body); // body
    const _query = event.queryStringParameters; // query string

    // derived properties
    const _name = noBodyMethods.includes(_method) ? _query.name : _body.name;
    const _data = noBodyMethods.includes(_method) ? null : _body.data;

    // console.log({
    //   _name,
    //   _data,
    // });

    if (!_name) throw new Error("no db name is provided");

    const _value = await handlerMap[_method](_name, _data);

    return {
      statusCode: 200,
      body: stringify({
        ok: true,
        data: {
          [_name]: _value,
        },
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: stringify({
        ok: false,
        error: error && error.message,
      }),
    };
  }
};
