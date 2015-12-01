using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessLib
{
    public class Artist
    {
        public int ArtistId { get; set; }

        public string ArtistName { get; set; }

        public string ArtistLocation { get; set; }
        
        public string ArtistImageLink { get; set; }

        public string ArtistMainGenre { get; set; }

        public List<Genre> ArtistGenres { get; set; }

        public List<YearActive> ArtistActiveYears { get; set; }

        public int ArtistSelected { get; set; }

        public double ArtistPopularity { get; set; }

        public Artist()
        {
            ArtistGenres = new List<Genre>();
            ArtistActiveYears = new List<YearActive>();

        }
    }

    public class YearActive
    {
        public int Start { get; set; }

        public int End { get; set; }
    }

    public class Genre
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string imageLink { get; set; }

        public double Relevance { get; set; }
    }

    public class TempArtist
    {
        public int ArtistId { get; set; }

        public string MainGenre { get; set; }

        public double Popularity { get; set; }

        public string EchonestId { get; set; }
    }

    public class TopArtistsRaw
    {
        public int Year { get; set; }

        public List<TempArtist> ArtistIds { get; set; }

        public TopArtistsRaw()
        {
            ArtistIds = new List<TempArtist>();
        }
    }
    
    public class TopGenres
    {
        public int Year { get; set; }

        public List<Genre> Genres { get; set; }

        public TopGenres()
        {
            Genres = new List<Genre>();
        }
    }

    public class DBArtistModel
    {
        public int ArtistId { get; set; }

        public string EchonestId { get; set; }

        public string MainGenre { get; set; }

        public int Year { get; set; }

        public double Popularity { get; set; }
    }

    public class DBArtistGenre
    {
        public int GenreId { get; set; }

        public string GenreImageURL {get;set;}

        public int ArtistId { get; set; }

        public string GenreName { get; set; }

        public double Relevance { get; set; }
    }

    public class DBArtistActiveYear
    {
        public int ArtistId { get; set; }

        public int Start { get; set; }

        public int End { get; set; }
    }



    public class Status
    {
        public string version { get; set; }
        public int code { get; set; }
        public string message { get; set; }
    }

    public class EArtist
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class EAResponse
    {
        public Status status { get; set; }
        public List<EArtist> artists { get; set; }
    }

    public class EGRootObject
    {
        public EAResponse response { get; set; }
    }    
}
