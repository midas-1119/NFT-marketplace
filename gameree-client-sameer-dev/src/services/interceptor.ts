import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

export const successResponseHandler = (response: AxiosResponse) => {
    return response;
}
export const errorResponseHandler = (error: AxiosError) => {
    return Promise.reject(error)
}
