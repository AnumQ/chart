import axios, { AxiosResponse } from "axios";

class ApiService {
  private readonly BASE_URL: string;

  constructor(baseUrl: string) {
    this.BASE_URL = baseUrl;
  }

//   async getData(): Promise<AxiosResponse<any>> {
//     try {
//       const response = await axios.get(`${this.BASE_URL}/data`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }

//       async fetchData(apiToken: string, stock?: string) {
//     // setCardClass(CARD_BLUR);

//     try {
//       const [dailyData, weeklyData, monthlyData] = await Promise.all([
//         fetchDataForPeriod(apiToken, DAILY_PERIOD, stock),
//         fetchDataForPeriod(apiToken, WEEKLY_PERIOD, stock),
//         fetchDataForPeriod(apiToken, MONTHLY_PERIOD, stock),
//       ]);
//       if (
//         dailyData instanceof Error ||
//         weeklyData instanceof Error ||
//         monthlyData instanceof Error
//       ) {
//         throw new Error("Error occurred while fetching data");
//       } else {
//         return {
//           d: dailyData,
//           w: weeklyData,
//           m: monthlyData,
//         };

//         // setData({
//         //   d: dailyData,
//         //   w: weeklyData,
//         //   m: monthlyData,
//         // });
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       // setCardClass(CARD);
//     }
//       },

//     async fetchDataForPeriod(apiToken: string, period: string, stock?: string) {
//     try {
//       let stockName = stock ?? DEFAULT_STOCK_TITLE;
//       const url = buildURL(apiToken, START_DATE, END_DATE, stockName, period);
//       const response = await axios.get(url);
//       if (response.status === 200) {
//         return response.data;
//       } else {
//         throw new Error("Network response was not 200");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       return error;
//     }
//   },
}

export default ApiService;
