
import ApiError from "./ApiError.js";

function apiErrorHandler(err, req, res, next) {
  // in prod, don't use console.log or console.err because
  // it is not async
  console.error(err.message);

  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return next();
  }

  res.status(500).json(err.message);
}


export default apiErrorHandler;
