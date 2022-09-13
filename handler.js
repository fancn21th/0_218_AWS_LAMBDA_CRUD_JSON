import { _post, _put, _delete, _get } from "./dbAgent.js";
import { stringify, parse } from "./utils.js";

// HTTP API has different way to identify the http methods

const handlerMap = {
  "GET /db/{name}": _get,
  "DELETE /db/{name}": _delete,
  "DELETE /db/{name}/{id}": _delete,
  "POST /db/{name}/{id}": _post,
  "PUT /db/{name}": _put,
};

const noBodyRequiredMethods = [
  "GET /db/{name}",
  "DELETE /db/{name}",
  "DELETE /db/{name}/{id} ",
];

const forceDeleteField = process.env.FORCE_DELETE_FIELD;

export const jsonCrud = async (event) => {
  // console.log({
  //   event,
  // });

  try {
    const _method = event.routeKey; // routeKey in place of httpMethod
    const _body = parse(event.body); // body
    const { name: _name, id: _id } = event.pathParameters; // pathParameters in place of queryStringParameters
    const qsParams = event.queryStringParameters || {
      [forceDeleteField]: false,
    };

    // derived
    const _isBodyRequired = !noBodyRequiredMethods.includes(_method);
    const _force = qsParams[forceDeleteField] === "true";

    console.log({
      _method,
      _name,
      _body,
      _id,
      _force,
      forceDeleteFieldInBody: forceDeleteField,
      qsParams,
    });

    if (!forceDeleteField)
      throw new Error("service env has no FORCE_DELETE_FIELD provided");

    if (!_name) throw new Error("no name is provided in /db/{name}");

    if (_isBodyRequired && !_body)
      throw new Error("no body is provided in /db/{name} body");

    const handler = handlerMap[_method];

    if (!handler) throw new Error(`the ${_method} is not supported yet.`);

    // biz logic invocation
    const _value = await handler({
      itemType: _name,
      itemId: _id,
      data: _body,
      isForced: _force,
    });

    return {
      statusCode: 200,
      body: stringify({
        ok: true,
        result: _value,
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
