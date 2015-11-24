using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProject.Models
{/*

    public class ExternalUrls
    {
        public string spotify { get; set; }
    }

    public class Followers
    {
        public object href { get; set; }
        public int total { get; set; }
    }

    public class Image
    {
        public int height { get; set; }
        public string url { get; set; }
        public int width { get; set; }
    }

    public class Item
    {
        public ExternalUrls external_urls { get; set; }
        public Followers followers { get; set; }
        public List<object> genres { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public List<Image> images { get; set; }
        public string name { get; set; }
        public int popularity { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
    }

    public class Artists
    {
        public string href { get; set; }
        public List<Item> items { get; set; }
        public int limit { get; set; }
        public string next { get; set; }
        public int offset { get; set; }
        public object previous { get; set; }
        public int total { get; set; }
    }

    public class RootObject
    {
        public Artists artists { get; set; }
    }*/


    public class Status
    {
        public string version { get; set; }
        public int code { get; set; }
        public string message { get; set; }
    }

    public class YearsActive
    {
        public int start { get; set; }
        public int end { get; set; }
    }

    public class ArtistLocation
    {
        public string city { get; set; }
        public string region { get; set; }
        public string location { get; set; }
        public string country { get; set; }
    }

    public class JSONArtist
    {
        public string name { get; set; }
        public List<YearsActive> years_active { get; set; }
        public string id { get; set; }
        public ArtistLocation artist_location { get; set; }
    }

    public class Response
    {
        public Status status { get; set; }
        public List<JSONArtist> artists { get; set; }
    }

    public class EchonestArtistJSON
    {
        public Response response { get; set; }
    }


}
