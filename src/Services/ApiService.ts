import axios, { AxiosResponse, AxiosError } from "axios";
import {
  E101_CODE,
  E101_MSG,
  E102_CODE,
  E102_MSG,
  E103_CODE,
  E103_MSG,
  E107_CODE,
  E107_MSG,
} from "../Helpers/Constants";

import { AppError as Error } from "../AppError";

export class ApiService {
  async get<T>(url: string): Promise<T | Error> {
    try {
      const response: AxiosResponse<T> = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`${E102_MSG} ${response.status}`, E102_CODE);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleApiError(error);
      } else if (error instanceof Error) {
        return new Error(error.message, error.code);
      } else {
        return new Error(E101_MSG, E101_CODE);
      }
    }

    return new Error(E107_MSG, E107_CODE);
  }

  private handleApiError(error: AxiosError): Error {
    const axiosError: AxiosError = error;

    const errorMessage = this.generateErrorMessage(axiosError);
    return new Error(errorMessage ?? E103_MSG, E103_CODE);
  }

  private generateErrorMessage(axiosError: AxiosError<unknown, any>) {
    return `Axios Error: Status: ${axiosError.response?.status} StatusText: ${
      axiosError.response?.statusText
    } Data: ${axiosError.response?.data?.toString()}`;
  }
}
