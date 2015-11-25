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

        public List<YearActive> ArtistYearsActive { get; set; }

        public string ArtistImageLink { get; set; }

        public string ArtistMainGenre { get; set; }

        public List<Genre> ArtistGenres { get; set; }

        public int ArtistSelected { get; set; }

        public Artist()
        {
            ArtistGenres = new List<Genre>();
            ArtistYearsActive = new List<YearActive>();
        }
    }

    public class YearActive
    {
        public int Start { get; set; }

        public int End { get; set; }
    }

    public class Genre
    {
        public string Name { get; set; }

        public double Relevance { get; set; }
    }

    public class TopArtistsRaw
    {
        public int Year { get; set; }

        public List<Artist> Artists { get; set; }

        public TopArtistsRaw()
        {
            Artists = new List<Artist>();
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

        public string ArtistName { get; set; }

        public string ArtistLocation { get; set; }

        public string ArtistImageURL { get; set; }

        public int Year { get; set; }

        public double Popularity { get; set; }
    }

    public class DBArtistGenre
    {
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
}
