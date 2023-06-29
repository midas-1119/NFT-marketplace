import axios, { CancelTokenStatic, CancelTokenSource } from "axios";
import { useSelector } from "react-redux";
import { baseURL } from "../environment/env";
import { selectToken } from "../store/auth/selector";
import { errorResponseHandler, successResponseHandler } from "./interceptor";

export class HttpService {
  CancelToken: CancelTokenStatic;
  source: CancelTokenSource;

  constructor() {
    this.CancelToken = axios.CancelToken;
    this.source = this.CancelToken.source();
    (axios as any).interceptors.response.use(
      successResponseHandler,
      errorResponseHandler
    );
    // // Add a request interceptor
    // (axios as any).interceptors.request.use(
    // 	(config: any) => {
    // 	let token = useSelector(selectToken)
    // 	if (token) {
    // 		config.headers['Authorization'] = 'Bearer ' + token
    // 	}
    // 	return config
    // 	},
    // 	(error: any) => {
    // 	Promise.reject(error)
    // 	}
    // )
  }

  /**
   * Set Token On Header
   * @param token
   */
  static setToken(token: any): void {
    //@ts-ignore
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Fetch data from server
   * @param url Endpoint link
   * @return Promise
   */
  protected get = (url: string, params?: any): Promise<any> =>
    axios.get(`${baseURL}/${url}`, {
      params,
      cancelToken: this.source.token,
    });

  /**
   * Write data over server
   * @param url Endpoint link
   * @param body Data to send over server
   * @return Promise
   */
  protected post = (url: string, body: any, options = {}): Promise<any> =>
    axios.post(`${baseURL}/${url}`, body, {
      ...options,
      cancelToken: this.source.token,
    });

  /**
   * Delete Data From Server
   * @param url Endpoint link
   * @param params Embed as query params
   * @return Promise
   */
  protected delete = (url: string, params?: any, data?: any): Promise<any> =>
    axios.delete(`${baseURL}/${url}`, { params, data });

  /**
   * Update data on server
   * @param url Endpoint link
   * @param body Data to send over server
   * @param params Embed as query params
   * @return Promise
   */
  protected put = (url: string, body?: any, params?: any): Promise<any> =>
    axios.put(`${baseURL}/${url}`, body, {
      ...params,
      cancelToken: this.source.token,
    });

  private updateCancelToken() {
    this.source = this.CancelToken.source();
  }

  cancel = () => {
    this.source.cancel("Explicitly cancelled HTTP request");
    this.updateCancelToken();
  };
}
