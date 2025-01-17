class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = null) {
      super(message);  // Set the message using the Error constructor
  
      this.statusCode = statusCode;
      this.success = false;
      this.errors = errors;
      this.data = null;
  
      // Capture stack trace only if stack is not provided
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, ApiError);
      }
    }
  }
  
  export { ApiError };
  