import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { ApiError as ApiErrorResponse, ApiResult } from '@checkout/contracts';

import { ApiError, NetworkError, ResponseParseError } from './errors';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
}

const API_URL = import.meta.env.VITE_API_URL;

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'data'> {
  data?: unknown;
  token?: string;
}

function createApiError(error: AxiosError<ApiErrorResponse>): ApiError | NetworkError {
  const response = error.response;

  if (!response) {
    return new NetworkError();
  }

  const payload = response.data;

  const requestId = payload?.meta?.requestId ?? response.headers['x-request-id'];

  return new ApiError(payload?.error?.message ?? 'Произошла ошибка API.', {
    status: response.status,
    code: payload?.error?.code ?? 'UNKNOWN_ERROR',
    fields: payload?.error?.fields,
    requestId,
  });
}

function handleResponse<T>(response: AxiosResponse<ApiResult<T>>): T {
  if (response.status === 204) {
    return undefined as T;
  }

  if (response.data === undefined || response.data === null) {
    throw new ResponseParseError();
  }

  if (typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data;
  }

  throw new ResponseParseError();
}

async function request<T>(path: string, config: ApiRequestConfig = {}): Promise<T> {
  const { token, data, ...axiosConfig } = config;

  try {
    const response = await axios.request<ApiResult<T>>({
      ...axiosConfig,
      url: path,
      baseURL: API_URL,
      data,
      headers: {
        ...axiosConfig.headers,

        ...(data !== undefined && {
          'Content-Type': 'application/json',
        }),

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isCancel(error)) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw createApiError(error);
    }

    if (error instanceof ResponseParseError) {
      throw error;
    }

    throw new NetworkError();
  }
}
export const api = {
  get<T>(path: string, token?: string) {
    return request<T>(path, {
      method: 'GET',
      token,
    });
  },

  post<T>(path: string, data?: unknown, token?: string, options?: ApiRequestOptions) {
    return request<T>(path, {
      method: 'POST',
      data,
      token,
      headers: options?.headers,
    });
  },

  put<T>(path: string, data?: unknown, token?: string, options?: ApiRequestOptions) {
    return request<T>(path, {
      method: 'PUT',
      data,
      token,
      headers: options?.headers,
    });
  },

  delete<T>(path: string, token?: string) {
    return request<T>(path, {
      method: 'DELETE',
      token,
    });
  },
};
