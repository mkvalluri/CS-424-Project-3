using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataProject.Models;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;

namespace DataProcessLib
{
    public class DPLib
    {
        string connectionString = "data source=HELL-Lappy;initial catalog=CS424;integrated security=True;";

        public List<TopArtists> GetTopArtistsListBasedOnYearRange(int startYear, int endYear, bool top10)
        {
            SqlConnection myConnection = new SqlConnection(connectionString);
            myConnection.Open();
            SqlCommand c = new SqlCommand();
            c.Connection = myConnection;
            c.CommandText = " SELECT AL.ArtistId, A.ArtistName, A.ArtistLocation, A.ArtistImageURL, AlbumReleaseDate, ROUND(SUM(AlbumRating) / COUNT(AlbumRating), 2) as 'Rating', COUNT(AlbumRating) as '# Samples' " +
                            " FROM Albums Al " +
                            " INNER JOIN Artists A ON AL.ArtistId = A.Id " +
                            " WHERE AlbumReleaseDate <> -1 and AlbumReleaseDate <> 0 and AlbumReleaseDate >= " + startYear + " and AlbumReleaseDate <= " + endYear +
                            " GROUP BY ArtistId, AlbumReleaseDate, A.ArtistName, A.ArtistLocation, A.ArtistImageURL " +
                            " ORDER BY AlbumReleaseDate, Rating desc";

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
                    newItem.AlbumReleaseDate = dr.GetInt32(4);
                    newItem.ArtistRating = dr.GetDouble(5);
                    newItem.NumSamples = dr.GetInt32(6);
                    results.Add(newItem);
                }
            }

            myConnection.Close();

            var artistList = new List<TopArtists>();
            var genreList = GetArtistGenres();
            var activeYearList = GetArtistActiveYears();

            for (int i = startYear; i <= endYear; i++)
            {
                TopArtists t = new TopArtists();
                t.Year = i;
                var tempResults = new List<DBArtistModel>();
                if (top10)
                {
                    tempResults = results.Where(r => r.AlbumReleaseDate == i).ToList().GetRange(0, 10);
                }
                else
                    tempResults = results.Where(r => r.AlbumReleaseDate == i).ToList();

                tempResults.Where(r => r.AlbumReleaseDate == i).ToList().ForEach(d =>
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
                    activeYearList.Where(ay => ay.ArtistId == a.ArtistId).ToList().ForEach(ayl =>
                    {
                        YearActive activeY = new YearActive();
                        activeY.Start = ayl.Start;
                        activeY.End = ayl.End;
                        a.ArtistYearsActive.Add(activeY);
                    });
                    t.Artists.Add(a);
                });
                artistList.Add(t);
            }

            return artistList;
        }

        public List<TopGenres> GetTopGenres(int startYear, int endYear)
        {
            List<TopGenres> topG = new List<TopGenres>();
            var topData = GetTopArtistsListBasedOnYearRange(startYear, endYear, false);

            for(int i = startYear; i <= endYear; i++)
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
                topG.Add(topGen);
            }           
            return topG;
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
