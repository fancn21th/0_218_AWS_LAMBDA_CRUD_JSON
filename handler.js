import { _post, _put, _delete, _get } from "./dbAgent.js";
import { stringify, parse } from "./utils.js";

// HTTP API has different way to identify the http methods

const handlerMap = {
  "GET /db/{name}": _get,
  "DELETE /db/{name}": _delete,
  "POST /db/{name}": _post,
  "PUT /db/{name}": _put,
};

const noBodyRequiredMethods = ["GET /db/{name}", "DELETE /db/{name}"];

const dataFieldInBody = "data";
const forceDeleteFieldInBody = process.env.FORCE_DELETE_FIELD;

export const jsonCrud = async (event) => {
  try {
    const _method = event.routeKey; // routeKey in place of httpMethod
    const _body = parse(event.body); // body
    const { name: _name, id: _id } = event.pathParameters; // pathParameters in place of queryStringParameters

    // derived
    const _isBodyRequired = !noBodyRequiredMethods.includes(_method);
    const _force = _body[forceDeleteFieldInBody];
    const _data = _body[dataFieldInBody];

    console.log({
      _name,
      _data,
      _id,
      _force,
    });

    if (!_name) throw new Error("no name is provided in /db/{name}");

    if (_isBodyRequired && !_data)
      throw new Error("no data is provided in /db/{name} body");

    const _value = await handlerMap[_method]({
      itemType: _name,
      itemId: _id,
      data: _data,
      isForced: _force,
    });

    return {
      statusCode: 200,
      body: stringify({
        ok: true,
        result: {
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
        error: error.message || "A Bad feeling I have about this...",
      }),
    };
  }
};
