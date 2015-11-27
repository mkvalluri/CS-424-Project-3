using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace DataProcessLib
{
    public class DPLib
    {
        string connectionString = "Server=tcp:cs424db.database.windows.net,1433;Database=CS424;User ID=cs424u@cs424db;Password=cs424Password;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        static List<TopArtistsRaw> data = new List<TopArtistsRaw>();

        public List<TopArtistsRaw> GetTopArtistsListBasedOnYearRange(int startYear, int endYear, bool top10)
        {
            SqlConnection myConnection = new SqlConnection(connectionString);
            myConnection.Open();
            SqlCommand c = new SqlCommand();
            c.Connection = myConnection;
            c.CommandText = " SELECT A.Id, A.ArtistName, A.ArtistLocation, A.ArtistImageURL, AP.Year, AP.Popularity " +
                            " FROM Artists A " +
                            " INNER JOIN ArtistPopularities AP on AP.Artist_Id = A.Id " +
                            " WHERE AP.Year >= " + startYear + " AND AP.YEAR <= " + endYear +
                            " ORDER BY AP.Year, AP.Popularity DESC";

            List<DBArtistModel> results = new List<DBArtistModel>();

            using (SqlDataReader dr = c.ExecuteReader())
            {
                while (dr.Read())
                {
                    DBArtistModel newItem = new DBArtistModel();

                    newItem.ArtistId = dr.GetInt32(0);
                    newItem.ArtistName = dr.GetString(1);
                    newItem.ArtistLocation = dr.GetString(2);
                    newItem.ArtistImageURL = dr.GetString(3);
                    newItem.Year = dr.GetInt32(4);
                    newItem.Popularity = dr.GetDouble(5);
                    results.Add(newItem);
                }
            }

            myConnection.Close();

            var artistList = new List<TopArtistsRaw>();
            var genreList = GetArtistGenres();
            var activeYearList = GetArtistActiveYears();

            for (int i = startYear; i <= endYear; i++)
            {
                TopArtistsRaw t = new TopArtistsRaw();
                t.Year = i;
                var tempResults = new List<DBArtistModel>();
                if (top10)
                {
                    tempResults = results.Where(r => r.Year == i).ToList().GetRange(0, 10);
                }
                else
                    tempResults = results.Where(r => r.Year == i).ToList();

                tempResults.Where(r => r.Year == i).ToList().ForEach(d =>
                {
                    Artist a = new Artist();
                    a.ArtistName = d.ArtistName;
                    a.ArtistLocation = d.ArtistLocation;
                    a.ArtistImageLink = d.ArtistImageURL;
                    a.ArtistId = d.ArtistId;
                    genreList.Where(g => g.ArtistId == a.ArtistId).ToList().ForEach(gr =>
                    {
                        Genre genre = new Genre();
                        genre.Name = gr.GenreName;
                        genre.Relevance = gr.Relevance;
                        a.ArtistGenres.Add(genre);
                    });
                    if (a.ArtistGenres.Count > 0)
                    {
                        a.ArtistGenres = a.ArtistGenres.OrderByDescending(g => g.Relevance).ToList();
                        a.ArtistMainGenre = a.ArtistGenres.FirstOrDefault().Name;
                    }
                    else
                    {
                        a.ArtistMainGenre = "";
                    }
                    a.ArtistPopularity = d.Popularity;
                    activeYearList.Where(ay => ay.ArtistId == a.ArtistId).ToList().ForEach(ayl =>
                    {
                        YearActive activeY = new YearActive();
                        activeY.Start = ayl.Start;
                        activeY.End = ayl.End;
                        a.ArtistActiveYears.Add(activeY);
                    });
                    t.Artists.Add(a);
                });
                artistList.Add(t);
            }

            return artistList;
        }
        
        public List<Artist> GetTopArtists(int startYear, int endYear, bool top10)
        {
            List<Artist> topA = new List<Artist>();
            Dictionary<Artist, double> artistKeys = new Dictionary<Artist, double>();
            Dictionary<int, int> artistCounter = new Dictionary<int, int>();

            if (data.Count == 0)
            {
                data = GetTopArtistsListBasedOnYearRange(1950, 2014, false);
            }

            var topData = GetData(startYear, endYear);

            for (int i = startYear; i <= endYear; i++)
            {
                var topList = topData.Where(t => t.Year == i).ToList();
                topList.ForEach(t =>
                {
                    var artists = t.Artists;
                    artists.ForEach(a =>
                    {
                        if (artistKeys.Count(ar => ar.Key.ArtistId == a.ArtistId) > 0)
                        {
                            var artist = artistKeys.Where(ar => ar.Key.ArtistId == a.ArtistId).FirstOrDefault();
                            artistKeys[artist.Key] = artist.Value + a.ArtistPopularity;
                            artistCounter[a.ArtistId]++;
                        }
                        else
                        {
                            artistKeys.Add(a, a.ArtistPopularity);
                            artistCounter.Add(a.ArtistId, 1);
                        }
                    });
                });
            }

            /*  var newAKeys = new Dictionary<Artist, double>();
              artistKeys.ToList().ForEach(a =>
              {
                  newAKeys.Add(a.Key, a.Value / artistCounter[a.Key.ArtistId]);
              });
              */

            Dictionary<Artist, double> tA = new Dictionary<Artist, double>();
            artistKeys.ToList().ForEach(a =>
            {
                tA.Add(a.Key, a.Value / (endYear - startYear));
            });

            var fData = tA.OrderByDescending(a => a.Value).ToList();

            fData.ForEach(a =>
            {
                topA.Add(a.Key);
            });

            if (top10)
                return topA.GetRange(0, 10);
            else
                return topA;
        }

        public List<TopGenres> GetTopGenres(int startYear, int endYear)
        {
            List<TopGenres> topG = new List<TopGenres>();

            if(data.Count == 0)
            {
                data = GetTopArtistsListBasedOnYearRange(1950, 2014, false);
            }
            var topData = GetData(startYear, endYear);

            topData = data;

            for (int i = startYear; i <= endYear; i++)
            {
                TopGenres topGen = new TopGenres();
                topGen.Year = i;
                Dictionary<string, int> genreKeys = new Dictionary<string, int>();
                var topList = topData.Where(t => t.Year == i).ToList();
                topList.ForEach(t =>
                {
                    var artists = t.Artists;
                    artists.ForEach(a =>
                    {
                        if(genreKeys.Count(g => g.Key == a.ArtistMainGenre) > 0)
                        {
                            var genre = genreKeys.Where(g => g.Key == a.ArtistMainGenre).FirstOrDefault();
                            genreKeys[genre.Key] = genre.Value + 1;
                        }
                        else
                        {
                            genreKeys.Add(a.ArtistMainGenre, 1);
                        }
                    });
                });
                genreKeys.OrderByDescending(g => g.Value).ToList().ForEach(gr => {
                    Genre genre = new Genre();
                    genre.Name = gr.Key;
                    genre.Relevance = gr.Value;
                    topGen.Genres.Add(genre);
                });
                topGen.Genres = topGen.Genres.GetRange(0, 10);
                topG.Add(topGen);
            }           
            return topG;
        }
        
        public List<Genre> GetTopGenresByDecade(int startYear, int endYear)
        {
            List<Genre> tG = new List<Genre>();

            var data = GetTopArtists(startYear, endYear, false);

            Dictionary<string, int> genreD = new Dictionary<string, int>();

            data.ForEach(a =>
            {
                if(genreD.Count(g => g.Key == a.ArtistMainGenre) == 0)
                {                    
                    genreD.Add(a.ArtistMainGenre, 1);
                }
                else
                {
                    genreD[a.ArtistMainGenre]++;
                }
            });

            Dictionary<string, int> tempG = new Dictionary<string, int>();
            genreD.ToList().ForEach(e =>
            {
                tempG.Add(e.Key, e.Value / (endYear - startYear));
            });

            var sortedList = genreD.OrderByDescending(g => g.Value).ToList();
            sortedList.ForEach(v =>
            {
                Genre g = new Genre();
                g.Name = v.Key;
                g.Relevance = v.Value;
                tG.Add(g);
            });

            return tG.GetRange(0, 10);
        }

        private List<TopArtistsRaw> GetData(int startYear, int endYear)
        {
            return data.Where(d => d.Year >= startYear && d.Year <= endYear).ToList();
        }

        private List<DBArtistActiveYear> GetArtistActiveYears()
        {
            SqlConnection myConnection = new SqlConnection(connectionString);
            myConnection.Open();
            SqlCommand c = new SqlCommand();
            c.Connection = myConnection;
            c.CommandText = " select * from ActiveYears AY " +
                            " INNER JOIN Artists A ON AY.ArtistId = A.ID";

            List<DBArtistActiveYear> results = new List<DBArtistActiveYear>();

            using (SqlDataReader dr = c.ExecuteReader())
            {

                while (dr.Read())
                {
                    DBArtistActiveYear newItem = new DBArtistActiveYear();
                    newItem.ArtistId = dr.GetInt32(4);
                    newItem.Start = dr.GetInt32(1);
                    newItem.End = dr.GetInt32(2);
                    results.Add(newItem);
                }
            }
            myConnection.Close();
            return results;
        }

        private List<DBArtistGenre> GetArtistGenres()
        {
            SqlConnection myConnection = new SqlConnection(connectionString);
            myConnection.Open();
            SqlCommand c = new SqlCommand();
            c.Connection = myConnection;
            c.CommandText = " SELECT A.Id, G.GenreName, ROUND((AG.Frequency * AG.Weight), 2) as 'Relevance' from Genres G " +
                            " INNER JOIN ArtistGenres AG on G.Id = AG.Genre_Id " +
                            " INNER JOIN Artists A on A.Id = AG.Artist_Id";

            List<DBArtistGenre> results = new List<DBArtistGenre>();

            using (SqlDataReader dr = c.ExecuteReader())
            {

                while (dr.Read())
                {
                    DBArtistGenre newItem = new DBArtistGenre();

                    newItem.ArtistId = dr.GetInt32(0);
                    newItem.GenreName = dr.GetString(1);
                    newItem.Relevance = dr.GetDouble(2);
                    results.Add(newItem);
                }
            }
            myConnection.Close();
            return results;
        }
    }
}
