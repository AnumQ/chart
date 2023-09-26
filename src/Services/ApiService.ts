import axios, { AxiosResponse, AxiosError } from "axios";
import {
  E101_CODE,
  E101_MSG,
  E102_CODE,
  E102_MSG,
  E103_CODE,
  E103_MSG,
} from "../Helpers/Constants";

export class ApiService {
  async get<T>(url: string) {
    try {
      const response: AxiosResponse<T> = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new AxiosError(`${E102_MSG} ${response.status}`, E102_CODE);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleApiError(error);
      } else {
        throw new AxiosError(E101_MSG, E101_CODE);
      }
    }
  }

  private handleApiError(error: AxiosError): void {
    const axiosError: AxiosError = error;

    const errorMessage = this.generateErrorMessage(axiosError);

    throw new AxiosError(errorMessage ?? E103_MSG, E103_CODE);
  }

  private generateErrorMessage(axiosError: AxiosError<unknown, any>) {
    return `Axios Error: Status: ${axiosError.response?.status} StatusText: ${
      axiosError.response?.statusText
    } Data: ${axiosError.response?.data?.toString()}`;
  }
}
