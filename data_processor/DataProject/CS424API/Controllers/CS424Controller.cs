using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CS424API.Controllers
{
    public class CS424Controller : ApiController
    {
        public string GetArtists()
        {
            return "Hello! World";
        }
    }
}
