import axios, { AxiosResponse, AxiosError } from "axios";
import { E103_CODE, E103_MSG } from "../Helpers/Constants";

import { AppError as Error } from "../AppError";

export class ApiService {
  async get<T>(url: string): Promise<T | undefined> {
    try {
      const response: AxiosResponse<T> = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleApiError(error);
      }
    }
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
