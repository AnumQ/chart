import {
  DAILY_PERIOD,
  DEFAULT_STOCK_TITLE,
  E105_MSG,
  E108_MSG,
  END_DATE,
  MONTHLY_PERIOD,
  START_DATE,
  WEEKLY_PERIOD,
} from "../Helpers/Constants";

import { buildURL } from "../Helpers/URLbuilder";
import { StockData } from "../Interfaces/StockData";
import { ApiService } from "./ApiService";

export class StockService {
  apiService = new ApiService();

  async fetchStockDataAllPeriods(apiToken: string, stock?: string) {
    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      this.fetchPeriod(apiToken, DAILY_PERIOD, stock),
      this.fetchPeriod(apiToken, WEEKLY_PERIOD, stock),
      this.fetchPeriod(apiToken, MONTHLY_PERIOD, stock),
    ]);

    if (dailyData && weeklyData && monthlyData) {
      return {
        d: dailyData,
        w: weeklyData,
        m: monthlyData,
      };
    } else {
      this.handleError(dailyData, weeklyData, monthlyData);
    }
  }

  private async fetchPeriod(apiToken: string, period: string, stock?: string) {
    let stockName = stock ?? DEFAULT_STOCK_TITLE;
    const url = buildURL(apiToken, START_DATE, END_DATE, stockName, period);

    try {
      const data = await this.apiService.get<StockData[]>(url);
      if (this.isArrayStockDataType(data)) {
        return data;
      } else {
        console.error(E108_MSG);
      }
    } catch (error) {
      console.error("Failed to fetch for period " + period, error);
    }
  }

  private handleError(
    dailyData: StockData[] | undefined,
    weeklyData: StockData[] | undefined,
    monthlyData: StockData[] | undefined
  ) {
    console.error(
      `${E105_MSG} ->  dailyData: ${dailyData}, weeklyData: ${weeklyData}, monthlyData: ${monthlyData}`
    );
  }

  // Check if data structure is as expected
  private isArrayStockDataType(data: any): data is StockData[] {
    if (!Array.isArray(data)) {
      return false;
    }

    // Check if every item in the array is of type StockData
    return data.every((item) => {
      return (
        (typeof item.date === "number" || typeof item.date === "string") &&
        typeof item.open === "number" &&
        typeof item.high === "number" &&
        typeof item.low === "number" &&
        typeof item.close === "number" &&
        typeof item.adjusted_close === "number" &&
        typeof item.volume === "number"
      );
    });
  }
}
