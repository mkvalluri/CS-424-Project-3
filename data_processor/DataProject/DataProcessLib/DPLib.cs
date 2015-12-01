using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DataProcessLib
{
    

    public class DPLib
    {
        string connectionString = "Server=tcp:mkvalluri.database.windows.net,1433;Database=cs424db;User ID=mkvalluri@mkvalluri;Password=Password123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        //string connectionString = "data source=HELL-Lappy;initial catalog=CS424;integrated security=True;MultipleActiveResultSets=True;App=EntityFramework";
        //string connectionString = "Data Source=SQL5017.Smarterasp.net;Initial Catalog=DB_9E4598_mkvalluri;User Id=DB_9E4598_mkvalluri_admin;Password=Password123;";

        static List<TopArtistsRaw> artistListRaw = new List<TopArtistsRaw>();
        static List<DBArtistGenre> genreList = new List<DBArtistGenre>();
        static List<DBArtistActiveYear> activeYearList = new List<DBArtistActiveYear>();
        static List<Artist> artistInfoRaw = new List<Artist>();
        static Dictionary<int, string> artistMainGenres = new Dictionary<int, string>();

        public DPLib()
        {
            genreList = GetArtistGenres();
            activeYearList = GetArtistActiveYears();
        }
        /*
                public void SaveAllData()
                {
                    SqlConnection myConnection = new SqlConnection(connectionString);
                    myConnection.Open();
                    SqlCommand c = new SqlCommand();
                    c.Connection = myConnection;
                    c.CommandText = " SELECT A.Id, A.ArtistName, A.ArtistLocation, A.ArtistImageURL" +
                                    " FROM Artists A ";

                    List<Artist> results = new List<Artist>();

                    using (SqlDataReader dr = c.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            try
                            {
                                Artist a = new Artist();
                                a.ArtistName = dr.GetString(1);
                                a.ArtistLocation = dr.GetString(2);
                                a.ArtistImageLink = dr.GetString(3);
                                a.ArtistId = dr.GetInt32(0);
                                ConcurrentBag<Genre> tempGenres = new ConcurrentBag<Genre>();

                                genreList.AsParallel().Where(g => g.ArtistId == a.ArtistId).ToList().ForEach(gr =>
                                {
                                    Genre genre = new Genre();
                                    genre.Name = gr.GenreName;
                                    genre.Relevance = gr.Relevance;
                                    genre.Id = gr.GenreId;
                                    genre.imageLink = gr.GenreImageURL;
                                    tempGenres.Add(genre);
                                });
                                a.ArtistGenres.AddRange(tempGenres.ToList());

                                if (a.ArtistGenres.Count > 0)
                                {
                                    a.ArtistGenres = a.ArtistGenres.OrderByDescending(g => g.Relevance).ToList();
                                    a.ArtistMainGenre = a.ArtistGenres.FirstOrDefault().Name;
                                }
                                else
                                {
                                    a.ArtistMainGenre = "";
                                }

                                ConcurrentBag<YearActive> tempActiveYear = new ConcurrentBag<YearActive>();
                                activeYearList.AsParallel().Where(ay => ay.ArtistId == a.ArtistId).ToList().ForEach(ayl =>
                                {
                                    YearActive activeY = new YearActive();
                                    activeY.Start = ayl.Start;
                                    activeY.End = ayl.End;
                                    tempActiveYear.Add(activeY);
                                });
                                a.ArtistActiveYears.AddRange(tempActiveYear);
                                results.Add(a);
                            }
                            catch (Exception e)
                            {

                            }
                        }
                    }

                    myConnection.Close();

                    File.WriteAllText(@"D:\Projects\CS-424-Project-3\Data\artistInfo.json", JsonConvert.SerializeObject(results));

                }

                public void LoadData(string path)
                {
                    artistListRaw = JsonConvert.DeserializeObject<List<TopArtistsRaw>>(File.ReadAllText(path + "ArtistRawData.json"));
                }

                public void SaveData(List<TopArtistsRaw> inputData, string path)
                {
                    File.WriteAllText(path + "ArtistRawData.json", JsonConvert.SerializeObject(inputData));
                    artistListRaw = new List<TopArtistsRaw>(inputData);
                }
                */
        public void GetTopArtistsListBasedOnYearRange(int startYear, int endYear)
        {
            SqlConnection myConnection = new SqlConnection(connectionString);
            myConnection.Open();
            SqlCommand c = new SqlCommand();
            c.Connection = myConnection;
            c.CommandText = " SELECT A.Id, AP.Year, AP.Popularity, A.EchonestID " +
                            " FROM Artists A " +
                            " INNER JOIN ArtistPopularities AP on AP.Artist_Id = A.Id " +
                            " WHERE A.ArtistLocation IS NOT NULL AND AP.Year >= " + startYear + " AND AP.YEAR <= " + endYear +
                            " ORDER BY AP.Year, AP.Popularity DESC";

            List<DBArtistModel> results = new List<DBArtistModel>();

            using (SqlDataReader dr = c.ExecuteReader())
            {
                while (dr.Read())
                {

                    DBArtistModel newItem = new DBArtistModel();

                    newItem.ArtistId = dr.GetInt32(0);
                    newItem.Year = dr.GetInt32(1);
                    newItem.Popularity = dr.GetDouble(2);
                    newItem.EchonestId = dr.GetString(3);

                    results.Add(newItem);
                }
            }

            myConnection.Close();

            var artistList = new ConcurrentBag<TopArtistsRaw>();

            Parallel.For(startYear, endYear, i =>
            {
                try
                {
                    TopArtistsRaw t = new TopArtistsRaw();
                    t.Year = i;
                    var tempResults = new List<DBArtistModel>();
                    tempResults = results.Where(r => r.Year == i).ToList();

                    tempResults.Where(r => r.Year == i).ToList().ForEach(d =>
                    {
                        TempArtist art = new TempArtist();
                        art.ArtistId = d.ArtistId;
                        art.Popularity = d.Popularity;
                        art.EchonestId = d.EchonestId;
                        art.MainGenre = artistMainGenres.Where(a => a.Key == art.ArtistId).FirstOrDefault().Value;
                        t.ArtistIds.Add(art);
                    });
                    artistList.Add(t);
                }
                catch (Exception e)
                {

                }
            });
            artistListRaw = artistList.ToList();
        }

        public List<TempArtist> GetTopArtists(int startYear, int endYear, bool top10)
        {
            List<TempArtist> topA = new List<TempArtist>();
            Dictionary<TempArtist, double> artistKeys = new Dictionary<TempArtist, double>();

            var topData = GetData(startYear, endYear);

            topData.ForEach(t =>
            {
                t.ArtistIds.ToList().ForEach(a =>
                {
                    if (artistKeys.Count(ar => ar.Key.ArtistId == a.ArtistId) > 0)
                    {
                        var artist = artistKeys.Where(ar => ar.Key.ArtistId == a.ArtistId).FirstOrDefault();
                        artistKeys[artist.Key] = artist.Value + a.Popularity;
                    }
                    else
                    {
                        artistKeys.Add(a, a.Popularity);
                    }
                });
            });

            Dictionary<TempArtist, double> tA = new Dictionary<TempArtist, double>();
            artistKeys.ToList().ForEach(a =>
            {
                tA.Add(a.Key, a.Value / (endYear - startYear));
            });

            var fData = tA.OrderByDescending(a => a.Value).ToList();

            if (top10)
            {
                if (fData.Count > 0)
                {
                    return fData.GetRange(0, Math.Min(fData.Count, 10)).Select(t => t.Key).ToList();
                }
                else
                    return new List<TempArtist>();
            }
            else
            {
                return fData.Select(f => f.Key).ToList();
            }
        }

        public List<TopGenres> GetTopGenres(int startYear, int endYear)
        {
            List<TopGenres> topG = new List<TopGenres>();

            var topData = GetData(startYear, endYear);

            topData = artistListRaw;

            for (int i = startYear; i <= endYear; i++)
            {
                TopGenres topGen = new TopGenres();
                topGen.Year = i;
                Dictionary<string, int> genreKeys = new Dictionary<string, int>();
                var topList = topData.Where(t => t.Year == i).ToList();
                topList.ForEach(t =>
                {
                    var artists = t.ArtistIds;
                    artists.ToList().ForEach(a =>
                    {
                        if (a.MainGenre != null)
                        {
                            if (genreKeys.Count(g => g.Key == a.MainGenre) > 0)
                            {
                                var genre = genreKeys.Where(g => g.Key == a.MainGenre).FirstOrDefault();
                                genreKeys[genre.Key] = genre.Value + 1;
                            }
                            else
                            {
                                genreKeys.Add(a.MainGenre, 1);
                            }
                        }
                    });
                });
                genreKeys.OrderByDescending(g => g.Value).ToList().GetRange(0, Math.Min(genreKeys.Count, 10)).ForEach(gr =>
                {
                    Genre genre = new Genre();
                    var tempGen = genreList.Where(gre => gre.GenreName == gr.Key).FirstOrDefault();
                    genre.Name = tempGen.GenreName;
                    genre.Relevance = gr.Value;
                    genre.Id = tempGen.GenreId;
                    genre.imageLink = tempGen.GenreImageURL;
                    topGen.Genres.Add(genre);
                });
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
                if (a.MainGenre != null)
                {
                    if (genreD.Count(g => g.Key == a.MainGenre) == 0)
                    {
                        genreD.Add(a.MainGenre, 1);
                    }
                    else
                    {
                        genreD[a.MainGenre]++;
                    }
                }
            });

            Dictionary<string, int> tempG = new Dictionary<string, int>();
            genreD.ToList().ForEach(e =>
            {
                tempG.Add(e.Key, e.Value / (endYear - startYear));
            });

            genreD.OrderByDescending(g => g.Value).ToList().GetRange(0, Math.Min(genreD.Count, 10)).ForEach(v =>
            {
                Genre g = new Genre();
                var tempGen = genreList.Where(gr => gr.GenreName == v.Key).FirstOrDefault();
                g.Name = tempGen.GenreName;
                g.Relevance = v.Value;
                g.Id = tempGen.GenreId;
                g.imageLink = tempGen.GenreImageURL;
                tG.Add(g);
            });

            if (tG.Count > 0)
                return tG;
            else
                return new List<Genre>();
        }

        public List<Artist> GetArtistsInfo(List<string> artistIds)
        {
            List<Artist> artistList = new List<Artist>();


            artistIds.ForEach(a =>
            {
                SqlConnection myConnection = new SqlConnection(connectionString);
                myConnection.Open();
                SqlCommand c = new SqlCommand();
                c.Connection = myConnection;
                c.CommandText = " SELECT A.Id, A.ArtistName, A.ArtistLocation, A.ArtistImageURL, AP.Year, AP.Popularity " +
                                 " FROM Artists A " +
                                 " INNER JOIN ArtistPopularities AP on AP.Artist_Id = A.Id " +
                                 " WHERE A.EchonestID = '" + a + "' " +
                                 " ORDER BY AP.Popularity DESC";

                using (SqlDataReader dr = c.ExecuteReader())
                {
                    dr.Read();
                    try
                    {
                        Artist newItem = new Artist();
                        newItem.ArtistId = dr.GetInt32(0);
                        newItem.ArtistName = dr.GetString(1);
                        newItem.ArtistLocation = dr.GetString(2);
                        newItem.ArtistImageLink = dr.GetString(3);
                        newItem.ArtistPopularity = dr.GetDouble(5);

                        genreList.Where(g => g.ArtistId == newItem.ArtistId).ToList().ForEach(gr =>
                        {
                            Genre genre = new Genre();
                            genre.Id = gr.GenreId;
                            genre.imageLink = gr.GenreImageURL;
                            genre.Name = gr.GenreName;
                            genre.Relevance = gr.Relevance;
                            newItem.ArtistGenres.Add(genre);
                        });
                        if (newItem.ArtistGenres.Count > 0)
                        {
                            newItem.ArtistGenres = newItem.ArtistGenres.OrderByDescending(g => g.Relevance).ToList();
                            newItem.ArtistMainGenre = newItem.ArtistGenres.FirstOrDefault().Name;
                        }
                        else
                        {
                            newItem.ArtistMainGenre = "";
                        }
                        activeYearList.Where(ay => ay.ArtistId == newItem.ArtistId).ToList().ForEach(ayl =>
                        {
                            YearActive activeY = new YearActive();
                            activeY.Start = ayl.Start;
                            activeY.End = ayl.End;
                            newItem.ArtistActiveYears.Add(activeY);
                        });

                        artistList.Add(newItem);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                }
                myConnection.Close();
            });
            return artistList;
        }

        private List<TopArtistsRaw> GetData(int startYear, int endYear)
        {
            return artistListRaw.Where(d => d.Year >= startYear && d.Year <= endYear).ToList();
        }

        public List<Artist> GetArtistsByGenre(string genreName)
        {
            var artistLIst = new List<Artist>();
            var artistIds = genreList.Where(g => g.GenreName == genreName).Select(a => a.ArtistId).ToList();
            var Ids = new List<string>();
            artistIds.ForEach(a =>
            {
                Ids.Add(Convert.ToString(a));
            });
            return GetArtistsInfo(Ids);
        }

        public List<Artist> SearchArtists(string artistName, int startYear, int endYear)
        {
            List<Artist> artistList = new List<Artist>();

            SqlConnection myConnection = new SqlConnection(connectionString);
            myConnection.Open();
            SqlCommand c = new SqlCommand();
            c.Connection = myConnection;
            string where = "";

            if (artistName != "*")
                where = "WHERE A.ArtistName Like '%" + artistName + "' ";

            c.CommandText = " SELECT A.Id, A.ArtistName, A.ArtistLocation, A.ArtistImageURL, AP.Year, AP.Popularity " +
                             " FROM Artists A " +
                             " INNER JOIN ArtistPopularities AP on AP.Artist_Id = A.Id " +
                                where +
                             " ORDER BY AP.Popularity DESC";

            using (SqlDataReader dr = c.ExecuteReader())
            {
                while (dr.Read())
                {
                    try
                    {
                        Artist newItem = new Artist();
                        newItem.ArtistId = dr.GetInt32(0);
                        newItem.ArtistName = dr.GetString(1);
                        newItem.ArtistLocation = dr.GetString(2);
                        newItem.ArtistImageLink = dr.GetString(3);
                        newItem.ArtistPopularity = dr.GetDouble(5);

                        genreList.Where(g => g.ArtistId == newItem.ArtistId).ToList().ForEach(gr =>
                        {
                            Genre genre = new Genre();
                            genre.Name = gr.GenreName;
                            genre.Relevance = gr.Relevance;
                            newItem.ArtistGenres.Add(genre);
                        });

                        if (newItem.ArtistGenres.Count > 0)
                        {
                            newItem.ArtistGenres = newItem.ArtistGenres.OrderByDescending(g => g.Relevance).ToList();
                            newItem.ArtistMainGenre = newItem.ArtistGenres.FirstOrDefault().Name;
                        }
                        else
                        {
                            newItem.ArtistMainGenre = "";
                        }

                        activeYearList.Where(ay => ay.ArtistId == newItem.ArtistId).ToList().ForEach(ayl =>
                        {
                            YearActive activeY = new YearActive();
                            activeY.Start = ayl.Start;
                            activeY.End = ayl.End;
                            newItem.ArtistActiveYears.Add(activeY);
                        });

                        artistList.Add(newItem);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                }
            }
            myConnection.Close();
            var finalArtistList = new List<Artist>();
            artistList.ForEach(a =>
            {
                if (IsArtistValidInYearRange(a, startYear, endYear))
                    finalArtistList.Add(a);
            });
            return artistList;
        }

        private bool IsArtistValidInYearRange(Artist a, int startYear, int endYear)
        {
            bool returnValue = false;
            a.ArtistActiveYears.ForEach(y =>
            {
                if (returnValue != true)
                {
                    if (y.End == 0)
                    {
                        returnValue = true;
                    }
                    else if (y.End >= startYear && y.End <= endYear)
                    {
                        returnValue = true;
                    }
                }
            });
            return returnValue;
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
            c.CommandText = " SELECT A.Id AS ArtistId, G.GenreName, ROUND((AG.Frequency * AG.Weight), 2) as 'Relevance', G.Id from Genres G " +
                            " INNER JOIN ArtistGenres AG on G.Id = AG.Genre_Id " +
                            " INNER JOIN Artists A on A.Id = AG.Artist_Id" +
                            " ORDER BY ArtistId, Relevance DESC";

            List<DBArtistGenre> results = new List<DBArtistGenre>();
            int previousId = 0;
            using (SqlDataReader dr = c.ExecuteReader())
            {
                while (dr.Read())
                {
                    DBArtistGenre newItem = new DBArtistGenre();
                    newItem.GenreId = dr.GetInt32(3);
                    newItem.ArtistId = dr.GetInt32(0);
                    newItem.GenreName = dr.GetString(1);
                    newItem.Relevance = dr.GetDouble(2);
                    newItem.GenreImageURL = "http://dummyimage.com/300x300&text=" + newItem.GenreName;
                    if (previousId != newItem.ArtistId)
                    {
                        artistMainGenres.Add(newItem.ArtistId, newItem.GenreName);
                        previousId = newItem.ArtistId;
                    }
                    results.Add(newItem);
                }
            }
            myConnection.Close();
            return results;
        }
    }

    /*public class DPLibN
    {
        
        public void Connect()
        {
            // or, to connect to a replica set, with auto-discovery of the primary, supply a seed list of members
            var client = new MongoClient("mongodb://cs424u:cs424pas@ds041144.mongolab.com:41144/cs424");
            var database = client.GetDatabase("cs424");
        }

    }*/
}
