using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            DataProcessLib.DPLib db = new DataProcessLib.DPLib();

            var rawD = JsonConvert.SerializeObject(db.GetTopArtistsListBasedOnYearRange(1950, 2014, false));
            File.WriteAllText(@"D:\Projects\RawData.json", rawD);

            var data = JsonConvert.SerializeObject(db.GetTopArtists(1950, 2014));
            File.WriteAllText(@"D:\Projects\Artists#2.json", data);
            

            data = JsonConvert.SerializeObject(db.GetTopGenres(1990, 2010));
            File.WriteAllText(@"D:\Projects\Genres#3.json", data);
        }
    }
}
