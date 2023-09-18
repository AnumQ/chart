const symbol = "MCD.US";
const apiToken = "demo"; // Replace with the actual API token
const period = "d"; // Options: d, w, m, default: d
const format = "json"; // You can customize the format as needed

export const buildURL = (fromDate: string, toDate: string) => {
  const url = `https://eodhd.com/api/eod/${symbol}?api_token=${apiToken}&period=${period}&fmt=${format}&from=${fromDate}&to=${toDate}`;
  return url;
};
