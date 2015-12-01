using DataProcessLib;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApi.OutputCache.V2;

namespace API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DataController : ApiController
    {

        static DPLib db = new DPLib();
        static string path = "";

        public DataController()
        {
            //db = new DPLib();
            //path = System.Web.Hosting.HostingEnvironment.MapPath("/Data");
            //if (!File.Exists(path + "ArtistRawData.json"))
            //{
            //var data = db.GetTopArtistsListBasedOnYearRange(1950, 2015);
            //db.SaveData(data, path);
            //}
            //else
            //{
            //db.LoadData(path);
            //}
            db.GetTopArtistsListBasedOnYearRange(1950, 2015);
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/TopArtists")]
        [HttpGet]
        public List<Artist> GetTopArtists(int startYear, int endYear)
        {
            var list =  db.GetTopArtists(startYear, endYear, true);
            List<Artist> artistList = db.GetArtistsInfo(list.Select(a => a.EchonestId).ToList());
            return artistList;
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/TopGenres")]
        [HttpGet]
        public List<TopGenres> GetTopGenres(int startYear, int endYear)
        {
            return db.GetTopGenres(startYear, endYear);
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/TopGenresByDecade")]
        [HttpGet]
        public List<Genre> GetTopGenresByDecade(int startYear, int endYear)
        {
            return db.GetTopGenresByDecade(startYear, endYear);
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/SearchArtistsByName")]
        [HttpGet]
        public List<Artist> GetArtists(string artistName)
        {
            List<Artist> artistList = new List<Artist>();
            artistList = db.SearchArtists(artistName, 1900, 2015);
            return artistList;
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/SearchArtistsByYearRange")]
        [HttpGet]
        public List<Artist> GetArtistsByYearRange(int startYear, int endYear)
        {
            List<Artist> artistList = new List<Artist>();
            artistList = db.SearchArtists("*", startYear, endYear);
            return artistList;
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/SimilarArtistsByName")]
        [HttpGet]
        public List<Artist> GetSimilarArtistsByArtistName(string artistName)
        {
            List<Artist> artistList = new List<Artist>();
            WebClient wc = new WebClient();
            var result = wc.DownloadString("http://developer.echonest.com/api/v4/artist/similar?api_key=L6L1RWYT1A0EWKHJF&format=json&results=15&start=0&name=" + artistName);
            var data = JsonConvert.DeserializeObject<EGRootObject>(result);
            if (data.response.artists.Count > 0)
            {
                artistList = db.GetArtistsInfo(data.response.artists.Select(a => a.id).ToList());
            }
            return artistList;
        }

        [CacheOutput(ClientTimeSpan = 100, ServerTimeSpan = 100)]
        [Route("api/TopArtistsByGenre")]
        [HttpGet]
        public List<Artist> GetTopArtistsByGenre(string genreName)
        {
            List<Artist> artistList = new List<Artist>();
            WebClient wc = new WebClient();
            var result = wc.DownloadString("http://developer.echonest.com/api/v4/genre/artists?api_key=L6L1RWYT1A0EWKHJF&format=json&results=15&name=" + genreName);
            var data = JsonConvert.DeserializeObject<EGRootObject>(result);
            if(data.response.artists.Count > 0)
            {
                artistList = db.GetArtistsInfo(data.response.artists.Select(a => a.id).ToList());
            }
            return artistList;
        }

        [Route("api/ArtistsByGenre")]
        [HttpGet]
        public List<Artist> GetArtistsByGenre(string genreName)
        {
            List<Artist> artistList = new List<Artist>();
            artistList = db.GetArtistsByGenre(genreName);
            return artistList;
        }
    }
}
