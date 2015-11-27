using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProject.Models
{
    class ArtistAlbumsDict
    {
        public int Id { get; set; }

        public int Year { get; set; }

        public double Rating { get; set; }
        
        public ArtistAlbumsDict(int x, double y)
        {
            Year = x;
            Rating = y;
        }
    }

    class ArtistActiveYearsDict
    {
        public int StartYear { get; set; }

        public int EndYear { get; set; }

        public ArtistActiveYearsDict(int x, int y)
        {
            StartYear = x;
            EndYear = y;
        }
    }

    class RatingsDict
    {
        public List<ArtistActiveYearsDict> ArtistActiveYears { get; set; }

        public List<ArtistAlbumsDict> ArtistAlbums { get; set; }

        public int ArtistId { get; set; }

        public RatingsDict()
        {
            ArtistActiveYears = new List<ArtistActiveYearsDict>();
            ArtistAlbums = new List<ArtistAlbumsDict>();
        }

    }

}
