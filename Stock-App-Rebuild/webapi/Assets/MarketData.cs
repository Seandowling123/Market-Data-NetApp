namespace Stonk_App_BackEnd.Assets
{
    public class MarketData
    {
        public DateTime Date { get; set; }
        public string? DateString { get; set; }
        public double OpenPrice { get; set; }
        public double HighPrice { get; set; }
        public double LowPrice { get; set; }
        public double ClosePrice { get; set; }
        public double Volume { get; set; }

        public override string ToString()
        {
            return
            $"Date : {DateString}{Environment.NewLine}" +
            $"Open : {OpenPrice}{Environment.NewLine}" +
            $"High : {HighPrice}{Environment.NewLine}" +
            $"Low : {LowPrice}{Environment.NewLine}" +
            $"Close : {ClosePrice}{Environment.NewLine}" +
            $"Volume : {Volume}{Environment.NewLine}";
        }
    }
}