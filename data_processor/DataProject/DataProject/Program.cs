using DataProject.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DataProject
{
    class Program
    {
        static DataModelContainer dataCon = new DataModelContainer();
        static List<Artist> totalArtists = new List<Artist>();
        static List<Album> totalAlbums = new List<Album>();
        static string[] URLs = new string[10];
        static void Main(string[] args)
        {
            //GetEchonestData();
            //GetSpotifyData();
            //ConstructArtistAlbums();
            //dataCon.Artists.AddRange(totalArtists);
            //dataCon.Albums.AddRange(totalAlbums);
            //ConstructJSONObject();
            //GetGenres();
            GetArtistGenres();
            dataCon.SaveChanges();
        }

        static void GetEchonestData()
        {
            URLs[0] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=hotttnesss-desc";
            URLs[1] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=hotttnesss-asc";
            URLs[2] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=familiarity-desc";
            URLs[3] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=familiarity-asc";
            WebClient wc = new WebClient();

            for (int j = 0; j < 4; j++)
            {
                for (int i = 0; i < 1000; i = i + 100)
                {
                    string url = URLs[j] + "&start=" + i + "&results=100";
                    EchonestArtistJSON json = JsonConvert.DeserializeObject<EchonestArtistJSON>(wc.DownloadString(new Uri(url)));
                    ParseArtistInformation(json);
                    Console.WriteLine("Counter: " + i);
                }
                Thread.Sleep(30000);
            }
        }

        static void GetSpotifyData()
        {
            WebClient wc = new WebClient();
            totalArtists.ForEach(artist =>
            {
                try
                {
                    var url = "https://api.spotify.com/v1/search?q='" + artist.ArtistName + "'&type=artist";
                    var resp = wc.DownloadString(url);
                    var data = JsonConvert.DeserializeObject<SpotifyArtistJSON>(resp);
                    if (data.artists.items.Count > 0)
                    {
                        var images = data.artists.items.FirstOrDefault().images;
                        totalArtists.Where(a => a.EchonestID == artist.EchonestID).FirstOrDefault().SpotifyID = data.artists.items.FirstOrDefault().id;
                        if (data.artists.items.FirstOrDefault().images != null && images.Count != 0)
                            totalArtists.Where(a => a.EchonestID == artist.EchonestID).FirstOrDefault().ArtistImageURL = data.artists.items.FirstOrDefault().images.FirstOrDefault().url;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(artist.ArtistName);
                }
            });
            wc.Dispose();
        }

        static void ConstructArtistAlbums()
        {
            WebClient wc = new WebClient();
            totalArtists.ForEach(a =>
            {
                try
                {
                    var url = "https://api.spotify.com/v1/artists/" + a.SpotifyID + "/albums?album_type=album&limit=50";
                    while (!string.IsNullOrEmpty(url))
                    {
                        var resp = wc.DownloadString(url);
                        var data = JsonConvert.DeserializeObject<SpotifyAlbumJSON>(resp);
                        if (data.items.Count > 0)
                        {
                            data.items.ForEach(al =>
                            {
                                Album tempAlbum = new Album();
                                tempAlbum.AlbumName = al.name;
                                tempAlbum.AlbumReleaseDate = -1;
                                tempAlbum.AlbumID = al.id;
                                tempAlbum.AlbumRating = -1;
                                tempAlbum.Artist = a;
                                if (totalAlbums.Where(ta => ta.AlbumID == tempAlbum.AlbumID).Count() <= 0)
                                {
                                    totalAlbums.Add(tempAlbum);
                                }
                            });
                        }
                        url = data.next;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(a.ArtistName);
                }
            });

            totalAlbums.ForEach(a =>
            {
                try
                {
                    var url = "https://api.spotify.com/v1/albums/" + a.AlbumID;
                    var resp = wc.DownloadString(url);
                    var data = JsonConvert.DeserializeObject<SpotifyAlbumObject>(resp);
                    a.AlbumReleaseDate = Convert.ToInt32(data.release_date.Substring(0, 4));
                    a.AlbumRating = data.popularity;
                }
                catch (Exception e)
                {
                    Console.WriteLine(a.AlbumName);
                }
            });
            dataCon.Albums.AddRange(totalAlbums);
        }

        static void ParseArtistInformation(EchonestArtistJSON responseObj)
        {
            var tempArtists = responseObj.response.artists;
            tempArtists.ForEach(artist =>
            {
                if (artist != null && artist.artist_location != null)
                {
                    Artist tempArtist = new Artist();
                    tempArtist.ArtistName = artist.name;
                    tempArtist.EchonestID = artist.id;
                    tempArtist.ArtistLocation = artist.artist_location.location;
                    tempArtist.ArtistImageURL = "";
                    artist.years_active.ForEach(y =>
                    {
                        ActiveYear tempy = new ActiveYear();
                        tempy.Start = y.start;
                        tempy.End = y.end;
                        tempArtist.ActiveYears.Add(tempy);
                    });
                    if (totalArtists.Count(a => a.EchonestID.Trim() == tempArtist.EchonestID.Trim()) == 0)
                    {
                        totalArtists.Add(tempArtist);
                    }
                }
            });
        }

        static void GetGenres()
        {
            string[] gURLs = new string[2];
            gURLs[0] = "http://developer.echonest.com/api/v4/artist/list_genres?api_key=L6L1RWYT1A0EWKHJF&format=json";
            gURLs[1] = "http://developer.echonest.com/api/v4/artist/list_genres?api_key=L6L1RWYT1A0EWKHJF&format=json&start=1000";
            WebClient wc = new WebClient();
            try
            {
                for (int i = 0; i < 2; i++)
                {
                    var url = gURLs[i];
                    var resp = wc.DownloadString(url);
                    var data = JsonConvert.DeserializeObject<SpotifyGenreResponse>(resp);
                    if (data.response.terms.Count > 0)
                    {
                        data.response.terms.ForEach(g =>
                        {
                            Genre ge = new Genre();
                            ge.GenreName = g.name;
                            dataCon.Genres.Add(ge);
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        static void GetArtistGenres()
        {
            var tempArtists = dataCon.Artists.SqlQuery("SELECT * FROM Artists").ToList();
            WebClient wc = new WebClient();
            int i = 0;
            tempArtists.ForEach(a =>
            {
                var url = "http://developer.echonest.com/api/v4/artist/terms?api_key=L6L1RWYT1A0EWKHJF&id=" + a.EchonestID+"&format=json";
                var resp = wc.DownloadString(url);
                var data = JsonConvert.DeserializeObject<SpotifyGenreResponse>(resp);
                data.response.terms.ForEach(g =>
                {
                    if(dataCon.Genres.Where(gr => gr.GenreName == g.name).Count() > 0)
                    {
                        var tempGenre = new ArtistGenre();
                        tempGenre.Genre = dataCon.Genres.Where(gr => gr.GenreName == g.name).FirstOrDefault();
                        tempGenre.Artist = a;
                        tempGenre.Frequency = g.frequency;
                        tempGenre.Weight = g.weight;
                        dataCon.ArtistGenres.Add(tempGenre);
                    }
                    else
                    {
                        Console.WriteLine("Artist: " + a.ArtistName);
                    }
                });
                if (i == 115)
                {
                    Thread.Sleep(60000);
                    i = 0;
                }
                else
                    i++;
            });
        }

        /*static void ConstructJSONObject()
        {
            var tempArtists = dataCon.Artists.SqlQuery("SELECT * FROM Artists").ToList();
            var artObj = new List<Artist>();
            tempArtists.ForEach(a =>
            {
                var Art = new Artist();
                Art.ArtistName = a.ArtistName;
                Art.ArtistExternalId = a.ArtistExternalId;
                Art.ArtistImageURL = a.ArtistImageURL;
                Art.ArtistLocation = a.ArtistLocation;
                foreach(var year in a.ActiveYears)
                {
                    ActiveYear y = new ActiveYear();
                    y.Start = year.Start;
                    y.End = year.End;
                    Art.ActiveYears.Add(y);
                }
                artObj.Add(Art);
            });

            var str = JsonConvert.SerializeObject(artObj.GetRange(0, 1));
            File.WriteAllText(@"D:\Projects\Artists_Final_Test.json", str);
        }*/
    }
}
