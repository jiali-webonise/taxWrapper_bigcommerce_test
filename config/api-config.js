const API_STATUS_CODES = {
  // 1xx Status Codes - Informational
  'CONTINUE': {
    'code': 100,
    'title': 'Continue',
    'description': 'An interim response. Indicates to the client that the initial part of the request has been received and has not yet been rejected by the server. The client SHOULD continue by sending the remainder of the request or, if the request has already been completed, ignore this response. The server MUST send a final response after the request has been completed.'
  },
  'SWITCHING_PROTOCOL': {
    'code': 101,
    'title': 'Switching Protocol',
    'description': 'Sent in response to an Upgrade request header from the client, and indicates the protocol the server is switching to.'
  },
  'PROCESSING': {
    'code': 102,
    'title': 'Processing (WebDAV)',
    'description': 'Indicates that the server has received and is processing the request, but no response is available yet.'
  },
  'EARLY_HINTS': {
    'code': 103,
    'title': 'Early Hints',
    'description': 'Primarily intended to be used with the Link header. It suggests the user agent start preloading the resources while the server prepares a final response.'
  },

  // 2xx Status Codes - Success
  'OK': {
    'code': 200,
    'title': 'OK',
    'description': 'The request was successfully processed.'
  },
  'CREATED': {
    'code': 201,
    'title': 'Created',
    'description': 'The request has been fulfilled and a new resource has been created.'
  },
  'ACCEPTED': {
    'code': 202,
    'title': 'Accepted',
    'description': 'The request has been accepted, but not yet processed.'
  },
  'NON_AUTHORITATIVE_INFO': {
    'code': 203,
    'title': 'Non-Authoritative Information',
    'description': 'Indicates that the returned metainformation in the entity-header is not the definitive set as available from the origin server, but is gathered from a local or a third-party copy. The set presented MAY be a subset or superset of the original version.'
  },
  'NO_CONTENT': {
    'code': 204,
    'title': 'No Content',
    'description': 'The server has fulfilled the request but does not need to return a response body. The server may return the updated meta information.'
  },
  'RESET_CONTENT': {
    'code': 205,
    'title': 'Reset Content',
    'description': 'The request has been accepted, but no content will be returned. The client must reset the document from which the original request was sent. For example, if a user fills out a form and submits it, then the 205 code means that the server is making a request to the browser to clear the form.'
  },
  'PARTIAL_CONTENT': {
    'code': 206,
    'title': 'Partial Content',
    'description': 'It is used when the Range header is sent from the client to request only part of a resource.'
  },
  'MULTI_STATUS': {
    'code': 207,
    'title': 'Multi-Status (WebDAV)',
    'description': 'An indicator to a client that multiple operations happened, and that the status for each operation can be found in the body of the response.'
  },
  'ALREADY_REPORTED': {
    'code': 208,
    'title': 'Already Reported (WebDAV)',
    'description': 'Allows a client to tell the server that the same resource (with the same binding) was mentioned earlier. It never appears as a true HTTP response code in the status line, and only appears in bodies.'
  },

  // 3xx Status Codes - Redirection
  'MULTIPLE_CHOICES': {
    'code': 300,
    'title': 'Multiple Choices',
    'description': 'The request has more than one possible response. The user-agent or user should choose one of them.'
  },
  'MOVED_PERMANENTLY': {
    'code': 301,
    'title': 'Moved Permanently',
    'description': 'The URL of the requested resource has been changed permanently. The new URL is given by the Location header field in the response. This response is cacheable unless indicated otherwise.'
  },
  'FOUND': {
    'code': 302,
    'title': 'Found',
    'description': 'The URL of the requested resource has been changed temporarily. The new URL is given by the Location field in the response. This response is only cacheable if indicated by a Cache-Control or Expires header field.'
  },
  'OTHER': {
    'code': 303,
    'title': 'See Other',
    'description': 'The response to the request can be found under a different URL in the Location header and can be retrieved using a GET method on that resource.'
  },
  'NOT_MODIFIED': {
    'code': 304,
    'title': 'Not Modified',
    'description': 'Indicates the client that the response has not been modified, so the client can continue to use the same cached version of the response.'
  },
  'TEMPORARY_REDIRECT': {
    'code': 307,
    'title': 'Temporary Redirect',
    'description': 'Indicates the client to get the requested resource at another URI with same method that was used in the prior request. It is similar to 302 Found with one exception that the same HTTP method will be used that was used in the prior request.'
  },
  // 4xx Status Codes - Client Error
  'BAD_REQUEST': {
    'code': 400,
    'title': 'Bad Request',
    'description': 'The request could not be understood by the server due to incorrect syntax. The client SHOULD NOT repeat the request without modifications.'
  },
  'INVALID_ID': {
    'code': 400,
    'title': 'Bad Request',
    'description': 'Invalid ID provided.'
  },
  'INVALID_DATA': {
    'code': 400,
    'title': 'Bad Request',
    'description': 'The request could not be understood by the server due to incorrect data received. The client SHOULD NOT repeat the request without modifications.'
  },
  'UNAUTHORIZED': {
    'code': 401,
    'title': 'Unauthorized',
    'description': 'The necessary authentication credentials are not present in the request or are incorrect.'
  },
  'UNAUTHORIZED_ACCESS_KEY': {
    'code': 401,
    'title': 'Forbidden',
    'description': 'Unauthorized request. Access Token expired!'
  },
  'PAYMENT_REQUIRED': {
    'code': 402,
    'title': 'Payment Required',
    'description': 'There is an outstanding payment that must be settled before request can be processed.'
  },
  'FORBIDDEN': {
    'code': 403,
    'title': 'Forbidden',
    'description': 'Unauthorized request. The client does not have access rights to the content. Unlike 401, the client’s identity is known to the server.'
  },
  'ACCOUNT_DEACTIVATED': {
    'code': 403,
    'title': 'Forbidden',
    'description': 'Your account is deactivated, please contact administrator.'
  },
  'NO_ROLES_ASSIGNED': {
    'code': 403,
    'title': 'No roles assigned',
    'description': 'Unauthorized request. You do not have any role assigned in the system, please contact the administrator.'
  },
  'NO_AUTHORIZED_USER': {
    'code': 403,
    'title': 'User not exist',
    'description': 'Unauthorized request. The client does not exist and does not have access rights to the content.'
  },
  'NOT_FOUND': {
    'code': 404,
    'title': 'Not Found',
    'description': 'The server can not find the requested resource.'
  },
  'NO_RESULTS': {
    'code': 404,
    'title': 'No Results Found',
    'description': 'No results found'
  },
  'METHOD_NOT_ALLOWED': {
    'code': 405,
    'title': 'Method Not Allowed',
    'description': 'The request HTTP method is known by the server but has been disabled and cannot be used for that resource.'
  },
  'NOT_ACCEPTABLE': {
    'code': 406,
    'title': 'Not Acceptable',
    'description': 'The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.'
  },
  'PROXY_AUTH_REQUIRED': {
    'code': 407,
    'title': 'Proxy Authentication Required',
    'description': 'Indicates that the client must first authenticate itself with the proxy.'
  },
  'REQUEST_TIMEOUT': {
    'code': 408,
    'title': 'Request Timeout',
    'description': 'Indicates that the server did not receive a complete request from the client within the server’s allotted timeout period.'
  },
  'RESOURCE_CONFLICT': {
    'code': 409,
    'title': 'Resource Conflict',
    'description': 'he request could not be completed due to a conflict with the current state of the resource.'
  },
  'GONE': {
    'code': 410,
    'title': 'Gone',
    'description': 'The requested resource is no longer available at the server.'
  },
  'LENGTH_REQUIRED': {
    'code': 411,
    'title': 'Length Required',
    'description': 'The server refuses to accept the request without a defined Content- Length. The client MAY repeat the request if it adds a valid Content-Length header field.'
  },
  'PRECONDITION_FAILED': {
    'code': 412,
    'title': 'Precondition Failed',
    'description': 'The client has indicated preconditions in its headers which the server does not meet.'
  },
  'REQUEST_ENTITY_TOO_LARGE': {
    'code': 413,
    'title': 'Request Entity Too Large',
    'description': 'Request entity is larger than limits defined by server.'
  },
  'REQUEST_URI_TOO_LONG': {
    'code': 414,
    'title': 'Request-URI Too Long',
    'description': 'The URI requested by the client is longer than the server can interpret.'
  },
  'UNSUPPORTED_MEDIA_TYPE': {
    'code': 415,
    'title': 'Unsupported Media Type',
    'description': 'The server is refusing to accept the request because the payload format is in an unsupported format.'
  },
  'REQUEST_RANGE_NOT_SATISFIABLE': {
    'code': 416,
    'title': 'Requested Range Not Satisfiable',
    'description': 'The range specified by the Range header field in the request can’t be fulfilled.'
  },
  'EXPECTATION_FAILED': {
    'code': 417,
    'title': 'Expectation Failed',
    'description': 'The expectation indicated by the Expect request header field can’t be met by the server.'
  },
  'TEAPOT': {
    'code': 418,
    'title': 'I’m a teapot (RFC 2324)',
    'description': 'I\'m a teapot, short and stout.'
  },
  'INVALID_DATE_OF_READING': {
    'code': 419,
    'title': 'Invalid Date of Reading',
    'description': 'The request could not be understood by the server due to incorrect Date of Reading received. The client SHOULD NOT repeat the request without modifications.'
  },
  'UNPROCESSABLE_ENTITY': {
    'code': 422,
    'title': 'Unprocessable Entity',
    'description': 'The server understands the content type and syntax of the request entity, but still server is unable to process the request for some reason.'
  },
  'LOCKED': {
    'code': 423,
    'title': 'Locked (WebDAV)',
    'description': 'The resource that is being accessed is locked.'
  },
  'FAILED_DEPENDENCY': {
    'code': 424,
    'title': 'Failed Dependency (WebDAV)',
    'description': 'The request failed due to failure of a previous request.'
  },
  'TOO_EARLY': {
    'code': 425,
    'title': 'Too Early (WebDAV)',
    'description': 'Indicates that the server is unwilling to risk processing a request that might be replayed.'
  },
  'UPGRADE_REQUIRED': {
    'code': 426,
    'title': 'Upgrade Required',
    'description': 'The server refuses to perform the request. The server will process the request after the client upgrades to a different protocol.'
  },
  'PRECONDITION_REQUIRED': {
    'code': 428,
    'title': 'Precondition Required',
    'description': 'The origin server requires the request to be conditional.'
  },
  'TOO_MANY_REQUESTS': {
    'code': 429,
    'title': 'Too Many Requests',
    'description': 'The request was not accepted because the application has exceeded the rate limit.'
  },
  'REQUEST_HEADER_FIELDS_TOO_LARGE': {
    'code': 431,
    'title': 'Request Header Fields Too Large',
    'description': 'The server is unwilling to process the request because its header fields are too large.'
  },
  'UNAVAILABLE_LEGAL_REASONS': {
    'code': 451,
    'title': 'Unavailable For Legal Reasons',
    'description': 'The user-agent requested a resource that cannot legally be provided.'
  },

  // 5xx Status Codes - Server Error
  'INTERNAL_SERVER_ERROR': {
    'code': 500,
    'title': 'Internal Server Error',
    'description': 'The server encountered an unexpected condition that prevented it from fulfilling the request.'
  },
  'NOT_IMPLEMENTED': {
    'code': 501,
    'title': 'Not Implemented',
    'description': 'The HTTP method is not supported by the server and cannot be handled.'
  },
  'BAD_GATEWAY': {
    'code': 502,
    'title': 'Bad Gateway',
    'description': 'The server got an invalid response while working as a gateway to get the response needed to handle the request.'
  },
  'SERVICE_UNAVAILABLE': {
    'code': 503,
    'title': 'Service Unavailable',
    'description': 'The server is currently unavailable.'
  },
  'GATEWAY_TIMED_OUT': {
    'code': 504,
    'title': 'Gateway Timed Out',
    'description': 'The server is acting as a gateway and cannot get a response in time for a request.'
  },
  'NETWORK_AUTH_REQUIRED': {
    'code': 511,
    'title': 'Network Authentication Required',
    'description': 'The client needs to authenticate to gain network access.'
  }
};

module.exports = API_STATUS_CODES;
