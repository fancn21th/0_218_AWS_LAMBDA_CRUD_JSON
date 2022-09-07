export const jsonCrud = (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: event.data,
      },
      null,
      2
    ),
  };
};
