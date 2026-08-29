/**
 * Universal error formatter for API responses (FastAPI, Pydantic, Express, Axios).
 * Guarantees a safe, readable string is always returned and prevents React child object crash:
 * "Error: Objects are not valid as a React child (found: object with keys {type, loc, msg, input, ctx})"
 */
export function formatApiError(err: any, defaultMessage: string = 'An unexpected error occurred'): string {
  if (!err) return defaultMessage;

  // 1. If err is already a string
  if (typeof err === 'string') return err;

  const data = err.response?.data;

  // 2. Direct string message in response data
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  // 3. Pydantic / FastAPI detail field
  if (data?.detail) {
    // 3a. detail is string
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }

    // 3b. detail is array of Pydantic validation error objects: [{ loc, msg, type, ctx }]
    if (Array.isArray(data.detail)) {
      const messages = data.detail
        .map((item: any) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            const loc = Array.isArray(item.loc)
              ? item.loc.filter((l: any) => l !== 'body').join(' ')
              : '';
            const msg = item.msg || item.message || JSON.stringify(item);
            if (loc) {
              const fieldName = loc.charAt(0).toUpperCase() + loc.slice(1).replace(/_/g, ' ');
              return `${fieldName}: ${msg}`;
            }
            return msg;
          }
          return String(item);
        })
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join('. ');
      }
    }

    // 3c. detail is a single error object
    if (typeof data.detail === 'object') {
      if (data.detail.msg) return String(data.detail.msg);
      if (data.detail.message) return String(data.detail.message);
    }
  }

  // 4. Other response error fields
  if (typeof data?.error === 'string' && data.error.trim()) {
    return data.error;
  }

  // 5. Standard Error object message
  if (typeof err.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return defaultMessage;
}
