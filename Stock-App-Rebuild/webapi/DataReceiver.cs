using Stonk_App_BackEnd.Assets;

namespace Stonk_App_BackEnd
{
    class Receiver
    {
        public List<MarketData> PrintData(string symbol, string interval)
        {
            string API_key = @"ZXOVMBOFQ9MKYRYA";
            string QUERY_URL;

            if (interval == "Past Year")
            {
                QUERY_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + symbol + "&apikey=" + API_key + "&datatype=csv";
            }
            else if (interval == "Past Month")
            {
                QUERY_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=" + API_key + "&datatype=csv";
            }
            else
            {
                QUERY_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=15min" + "&apikey=" + API_key + "&datatype=csv";
            }

            Uri queryUri = new Uri(QUERY_URL);

            List<MarketData> data = new List<MarketData>();

            using (HttpClient client = new HttpClient())
            {
                var response = client.GetStreamAsync(queryUri).Result;

                using (StreamReader sr = new StreamReader(response))
                {
                    String[] fields = new string[5];
                    string line;
                    int i = 0;

                    while ((line = sr.ReadLine()) != null)
                    {
                        i = 0;
                        fields = line.Split(',');

                        if (fields[0] == "timestamp") { continue; }

                        data.Add(new MarketData()
                        {
                            DateString = fields[i],
                            Date = DateTime.Parse(fields[i++]),
                            OpenPrice = double.Parse(fields[i++]),
                            HighPrice = double.Parse(fields[i++]),
                            LowPrice = double.Parse(fields[i++]),
                            ClosePrice = double.Parse(fields[i++]),
                            Volume = double.Parse(fields[i++])
                        });
                    }
                    /*foreach (interday aPart in data)
                    {
                        Console.WriteLine(aPart);
                    }*/
                }
            }
            return data;
        }
    }
}