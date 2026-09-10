export interface ApiErrorField {
  path?: string;
  message?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: ApiErrorField[];
  readonly requestId?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code: string;
      fields?: ApiErrorField[];
      requestId?: string;
    },
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.fields = options.fields;
    this.requestId = options.requestId;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Не удалось подключиться к серверу.') {
    super(message);

    this.name = 'NetworkError';
  }
}

export class ResponseParseError extends Error {
  constructor(message = 'Сервер вернул некорректный ответ.') {
    super(message);

    this.name = 'ResponseParseError';
  }
}
