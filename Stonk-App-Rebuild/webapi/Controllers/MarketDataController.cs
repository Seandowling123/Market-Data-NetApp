using Microsoft.AspNetCore.Mvc;
using Stonk_App_BackEnd.Assets;

namespace Stonk_App_BackEnd.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MarketDataController : ControllerBase
    {

        [HttpGet(Name = "GetMarketData")]
        public IEnumerable<MarketData> Get([FromQuery] string symbol, [FromQuery] string interval)
        {

            Console.WriteLine(interval);

            var receiver = new Receiver();
            var MarketData = receiver.PrintData(symbol, interval).ToArray();
            int i = 0;

            foreach (var dataPoint in MarketData)
            {
                i++;
                Console.WriteLine(dataPoint.ToString());
                Console.WriteLine(i);
            }

            return MarketData;
        }
    }
}
