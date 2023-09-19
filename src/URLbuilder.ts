const format = "json";

export const buildURL = (
  apiToken: string,
  fromDate: string,
  toDate: string,
  stock: string,
  period: string
) => {
  const url = `https://eodhd.com/api/eod/${stock}?api_token=${apiToken}&period=${period}&fmt=${format}&from=${fromDate}&to=${toDate}`;
  return url;
};
