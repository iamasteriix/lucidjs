export const ErrorCodes = {
  // Generic
  internal: {
    code: 'internal_server_error',
    message: 'Something went wrong',
  },
  unexpected: {
    code: 'unexprected_error',
    message: 'Unexpected error',
  },
  badRequest: {
    code: 'bad_request',
    message: 'Bad request',
  },

  // Auth
  unauthorized: {
    code: 'unauthorized',
    message: 'Unauthorized',
  },
  forbidden: {
    code: 'forbidden',
    message: 'Not allowed',
  },

  // Resources
  notFound: {
    code: 'not_found',
    message: 'Not found',
  },

  // Validation
  validationError: {
    code: 'validation_error',
    message: 'Validation error',
  },
} as const;