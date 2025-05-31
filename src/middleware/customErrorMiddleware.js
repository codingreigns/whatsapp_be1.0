import createHttpError from "http-errors";

export async function HttpErrorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
}

export async function notFoundHandler(err, req, res, next) {
  if (err.status === 404) {
    next(createHttpError.NotFound("This route does not exist"));
  }
}
