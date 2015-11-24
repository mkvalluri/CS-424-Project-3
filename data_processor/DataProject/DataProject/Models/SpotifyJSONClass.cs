using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProject.Models
{
    public class ExternalUrls
    {
        public string spotify { get; set; }
    }

    public class Image
    {
        public int height { get; set; }
        public string url { get; set; }
        public int width { get; set; }
    }

    public class Item
    {
        public string album_type { get; set; }
        public List<string> available_markets { get; set; }
        public ExternalUrls external_urls { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public List<Image> images { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
    }

    public class Followers
    {
        public object href { get; set; }
        public int total { get; set; }
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

    public class SpotifyArtist
    {
        public ExternalUrls external_urls { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
        public List<SpotifyGenre> genres { get; set; }
    }

    public class Copyright
    {
        public string text { get; set; }
        public string type { get; set; }
    }

    public class ExternalIds
    {
        public string upc { get; set; }
    }

    public class AlbumInfo
    {
        public List<SpotifyArtist> artists { get; set; }
        public List<string> available_markets { get; set; }
        public int disc_number { get; set; }
        public int duration_ms { get; set; }
        public bool @explicit { get; set; }
        public ExternalUrls external_urls { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string preview_url { get; set; }
        public int track_number { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
    }

    public class Tracks
    {
        public string href { get; set; }
        public List<AlbumInfo> items { get; set; }
        public int limit { get; set; }
        public object next { get; set; }
        public int offset { get; set; }
        public object previous { get; set; }
        public int total { get; set; }
    }


    public class SpotifyStatus
    {
        public string version { get; set; }
        public int code { get; set; }
        public string message { get; set; }
    }

    public class SpotifyGenre
    {
        public string name { get; set; }
    }

    public class SpotifyTerm
    {
        public double frequency { get; set; }
        public string name { get; set; }
        public double weight { get; set; }
    }


    public class GenreResponse
    {
        public SpotifyStatus status { get; set; }
        public int start { get; set; }
        public List<SpotifyTerm> terms { get; set; }
    }

    public class SpotifyGenreResponse
    {
        public GenreResponse response { get; set; }
    }

    public class SpotifyArtistGenreObject
    {
        public SpotifyStatus status { get; set; }
        public SpotifyArtist artist { get; set; }
    }

    public class SpotifyArtistGenreJSON
    {
        public SpotifyArtistGenreObject response { get; set; }
    }
    
    public class SpotifyAlbumObject
    {
        public string album_type { get; set; }
        public List<SpotifyArtist> artists { get; set; }
        public List<string> available_markets { get; set; }
        public List<Copyright> copyrights { get; set; }
        public ExternalIds external_ids { get; set; }
        public ExternalUrls external_urls { get; set; }
        public List<object> genres { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public List<Image> images { get; set; }
        public string name { get; set; }
        public int popularity { get; set; }
        public string release_date { get; set; }
        public string release_date_precision { get; set; }
        public Tracks tracks { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
    }

    public class SpotifyAlbumJSON
    {
        public string href { get; set; }
        public List<Item> items { get; set; }
        public int limit { get; set; }
        public string next { get; set; }
        public int offset { get; set; }
        public object previous { get; set; }
        public int total { get; set; }
    }

    public class SpotifyArtistJSON
    {
        public Artists artists { get; set; }
    }
}
