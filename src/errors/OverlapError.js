class OverlapError extends Error {
  constructor(message) {
    super(message);
    // Set the error name to match the class name.
    this.name = 'OverlapError';
    // Optionally capture the stack trace (works in V8 engines like Chrome and Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OverlapError);
    }
  }
}
