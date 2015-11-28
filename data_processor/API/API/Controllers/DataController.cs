using DataProcessLib;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DataController : ApiController
    {

        static DPLib db = new DPLib();


        [Route("api/TopArtists")]
        [HttpGet]
        public List<Artist> GetTopArtists(int startYear, int endYear)
        {
            return db.GetTopArtists(startYear, endYear, true);
        }


        [Route("api/TopGenres")]
        [HttpGet]
        public List<TopGenres> GetTopGenres(int startYear, int endYear)
        {
            return db.GetTopGenres(startYear, endYear);
        }

        
        [Route("api/TopGenresByDecade")]
        [HttpGet]
        public List<Genre> GetTopGenresByDecade(int startYear, int endYear)
        {
            return db.GetTopGenresByDecade(startYear, endYear);
        }
    }
}
