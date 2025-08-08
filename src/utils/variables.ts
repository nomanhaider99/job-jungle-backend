export enum Environment {
    DEVELOPEMENT = "developement",
    PRODUCTION = "production",
}

export enum StatusCode {
    // Success responses
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // Client error responses
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,

    // Server error responses
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

export enum Roles {
    CANDIDATE = "candidate",
    COMPANY = "company"
}