import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { Fetcher } from 'traipse/client';
import { FetcherError } from 'traipse/src/client/types';
import { makeRealPath, makeUrl } from './make-url';

export const axiosFetcher: Fetcher<AxiosRequestConfig> = async (baseUrl, req, options) => {
  const path = makeRealPath(req.path, req.params);
  const url = makeUrl(baseUrl, path, req.query);
  try {
    const res = await axios.request({
      url,
      method: req.method.toUpperCase(),
      data: req.body,
      ...options,
    });
    return {
      status: res.status,
      body: res.data,
      cookies: {},
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new FetcherError(err.message, err.status ?? 500, err.response?.data);
    }
    throw err;
  }
};
