using DataProject.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
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
        static List<ActiveYear> totalActiveYears = new List<ActiveYear>();
        static string[] URLs = new string[10];

        static void Main(string[] args)
        {
            //GetEchonestData();
            totalArtists = dataCon.Artists.SqlQuery("SELECT * FROM Artists").ToList();
            //var tData = GetArtistActiveYears();
            //GetArtistCurrentPopularity();
            //GetSpotifyData();
            //ConstructArtistAlbums();
            //dataCon.Artists.AddRange(totalArtists);
            //dataCon.Albums.AddRange(totalAlbums);
            //GetGenres();
            //GetArtistGenres();
            //CalculateArtistPopularity();
            var tempArtists = dataCon.Artists.SqlQuery("SELECT * FROM Artists").ToList();
            /*tData.ForEach(a =>
            {
                try
                {
                    var Id = tempArtists.Where(arti => arti.EchonestID == a.Artist.EchonestID).FirstOrDefault().Id;
                    dataCon.Database.ExecuteSqlCommand("INSERT INTO ActiveYears VALUES ({0}, {1},{2})", a.Start, a.End, Id);
                }
                catch (Exception e)
                {

                }
            });
            */
            //dataCon.SaveChanges();
        }

        static void GetEchonestData()
        {
            URLs[0] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=hotttnesss-desc";
            URLs[1] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=hotttnesss-asc";
            URLs[2] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=familiarity-desc";
            URLs[3] = "http://developer.echonest.com/api/v4/artist/search?api_key=L6L1RWYT1A0EWKHJF&bucket=years_active&bucket=artist_location&sort=familiarity-asc";
            URLs[4] = "max_hotttnesss";
            URLs[5] = "min_hotttnesss";
            URLs[6] = "max_familiarity";
            URLs[7] = "min_familiarity";

            WebClient wc = new WebClient();
            double flagValue;
            bool continueFlag;
            double incrValue;
            int counter;

            for (int j = 0; j < 4; j++)
            {
                counter = 0;
                if (j == 0 || j == 2)
                {
                    flagValue = 1;
                    incrValue = -0.1;
                }
                else
                {
                    flagValue = 0;
                    incrValue = 0.1;
                }
                continueFlag = true;
                while (continueFlag)
                {
                    for (int i = 0; i < 1000; i = i + 100)
                    {
                        string url = URLs[j] + "&start=" + i + "&results=100" + "&" + URLs[j + 4] + "=" + (flagValue + incrValue);
                        EchonestArtistJSON json = JsonConvert.DeserializeObject<EchonestArtistJSON>(wc.DownloadString(new Uri(url)));
                        ParseArtistInformation(json);
                        Console.WriteLine("JValue: " + j + " Counter: " + i + " FlagVal: " + flagValue + " LimitVal: " + (flagValue + incrValue));
                    }
                    if (counter == 9)
                    {
                        continueFlag = false;
                    }
                    else
                    {
                        counter++;
                        if (incrValue < 0)
                        {
                            if (j == 0)
                                incrValue -= 0.1;
                        }
                        else
                        {
                            incrValue += 0.1;
                        }
                    }
                }
                if (j != 3)
                    Thread.Sleep(60000);
            }
        }

        static void GetSpotifyData()
        {
            WebClient wc = new WebClient();
            wc.Headers.Add(HttpRequestHeader.Accept, "application/json");
            wc.Headers.Add(HttpRequestHeader.Authorization, "Bearer BQAuiiukHKPhe7bUptJn8qY1pjRxN8wSxS28DXtDydwyLkLt5HcjZ5jhNP1KupbLmqOm1HwInk1GNEfFwctGFRIEnFWtoxKxN2AzWsGXp7gF4PMC_WoH0K4VxjbuzYQXI1uVVwOmzg");
            int counter = 0;
            totalArtists.ToList().ForEach(artist =>
            {
                Console.WriteLine(artist.Id);
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
                if (counter == 1000)
                {
                    Thread.Sleep(10000);
                    counter = 0;
                }
                else
                {
                    counter++;
                }
            });
            wc.Dispose();
        }

        static void GetArtistCurrentPopularity()
        {
            int i = 0;
            ConcurrentBag<Artist> tempArtists = new ConcurrentBag<Artist>();
            totalArtists.ToList().Where(a => a.ArtistCurrentPopularity == null).ToList().ForEach(artist =>
            {
                WebClient wc = new WebClient();
                wc.Headers.Add(HttpRequestHeader.Accept, "application/json");
                wc.Headers.Add(HttpRequestHeader.Authorization, "Bearer BQB8FnxMlNuCkV3eOe9YPT9KCHvelxVQC35YYEzHZAR0DpHLl-2z9dHdgSrOI_uuCVEBBm5T0N2amll0ueztSaT9YywcY1OfKuKXSi6k953PnCbbJlllQBGPf3IGvxK3D-3vQsR0jw");

                try
                {
                    var tempArtist = artist;
                    var url = "https://api.spotify.com/v1/artists/" + artist.SpotifyID;
                    var resp = wc.DownloadString(url);
                    var data = JsonConvert.DeserializeObject<SpotifyRootObject>(resp);
                    Console.WriteLine(artist.Id);
                    i++;
                    tempArtist.ArtistCurrentPopularity = data.popularity;
                    tempArtists.Add(tempArtist);
                }
                catch (Exception e)
                {
                    Console.WriteLine(artist.ArtistName + " " + e.Message);
                }
                if (i == 1000)
                {
                    i = 0;
                    Thread.Sleep(30000);
                }
                wc.Dispose();
            });
            tempArtists.ToList().ForEach(a =>
            {
                var artist = dataCon.Artists.Where(ar => ar.Id == a.Id).FirstOrDefault();
                artist.ArtistCurrentPopularity = a.ArtistCurrentPopularity;
            });
        }

        static List<ActiveYear> GetArtistActiveYears()
        {
            ConcurrentBag<ActiveYear> cYA = new ConcurrentBag<ActiveYear>();
            var artistIds = dataCon.Database.SqlQuery<string>("select EchonestId from Artists A " +
                                                           "left join ActiveYears AY ON A.Id = AY.ArtistId " +
                                                            "where AY.ID IS NULL");
            ConcurrentBag<string> track = new ConcurrentBag<string>();
            artistIds.AsParallel().ToList().ForEach(a =>
            {
                try
                {
                    WebClient wc = new WebClient();
                    var url = "http://developer.echonest.com/api/v4/artist/profile?api_key=L6L1RWYT1A0EWKHJF&id=" + a + "&format=json&bucket=years_active";
                    SEchonestArtistJSON json = JsonConvert.DeserializeObject<SEchonestArtistJSON>(wc.DownloadString(new Uri(url)));
                    track.Add(a);
                    Console.WriteLine(a + " : " + track.Count);
                    foreach (var y in json.response.artist.years_active)
                    {
                        ActiveYear tempy = new ActiveYear();
                        tempy.Start = y.start;
                        tempy.End = y.end;
                        tempy.Artist = new Artist();
                        tempy.Artist.EchonestID = a;
                        cYA.Add(tempy);
                    }
                }
                catch (Exception ex)
                {
                    Thread.Sleep(60000);
                }
            });
            return cYA.ToList();
        }

        static void ConstructArtistAlbums()
        {
            WebClient wc = new WebClient();
            //wc.Headers.Add(HttpRequestHeader.Accept, "application/json");
            //wc.Headers.Add(HttpRequestHeader.Authorization, "Bearer BQB6IlPs6e9xy84CNejvmNFZl1_rMlDYG8XosF9ud7sgd21Jxmu8Ncu16qTNBbxie0go342YAli0gRYE4Y6UlYOMzPp-ZaJWtllCQrIHLQFWECo3kUS2uD-ZPo8IFeFoU9KfKPdmCw");
            int counter = 0;
            /*totalArtists.ForEach(a =>
            {
                Console.WriteLine(a.Id);
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
                if (counter == 1000)
                {
                    Thread.Sleep(10000);
                    counter = 0;
                }
                else
                {
                    counter++;
                }
            });*/

            totalAlbums = dataCon.Albums.SqlQuery("SELECT * FROM ALbums where AlbumRating = -1").ToList();

            /* for(int i = 0; i < totalAlbums.Count; i = i + 5)
             {
                 string albumIdL = "";
                 totalAlbums.GetRange(i, i + 5).ForEach(a =>
                 {
                     if (albumIdL != "")
                     {
                         albumIdL += "," + a.AlbumID;
                     }
                     else
                     {
                         albumIdL = a.AlbumID;
                     }
                 });

                 try
                 {
                     Console.WriteLine(i);
                     var url = "https://api.spotify.com/v1/albums/?ids=" + albumIdL;
                     var resp = wc.DownloadString(url);
                     var data = JsonConvert.DeserializeObject<SpotifyAlbumObject>(resp);
                     //foreach(var d in data.albums)
                     //{
                         var al = dataCon.Albums.Where(alb => alb.AlbumID == data.id).FirstOrDefault();
                         al.AlbumReleaseDate = Convert.ToInt32(data.release_date.Substring(0, 4));
                         al.AlbumRating = data.popularity;
                     //}
                 }
                 catch (Exception e)
                 {
                     Console.WriteLine(albumIdL);
                 }
                 if (counter == 3000)
                 {
                     Thread.Sleep(30000);
                     counter = 0;
                 }
                 else
                 {
                     counter++;
                 }
             }*/

            totalAlbums.ForEach(a =>
            {
                try
                {
                    var url = "https://api.spotify.com/v1/albums/" + a.AlbumID;
                    var resp = wc.DownloadString(url);
                    var data = JsonConvert.DeserializeObject<SpotifyAlbumObject>(resp);
                    Console.WriteLine(a.Id);
                    //foreach(var d in data.albums)
                    //{
                    var al = dataCon.Albums.Where(alb => alb.AlbumID == data.id).FirstOrDefault();
                    al.AlbumReleaseDate = Convert.ToInt32(data.release_date.Substring(0, 4));
                    al.AlbumRating = data.popularity;
                    //}
                }
                catch (Exception e)
                {
                    Console.WriteLine(a.AlbumName + e.Message);
                }
                if (counter == 3000)
                {
                    Thread.Sleep(30000);
                    counter = 0;
                }
                else
                {
                    counter++;
                }
            });

            //dataCon.Albums.AddRange(totalAlbums);
        }

        static void ParseArtistInformation(EchonestArtistJSON responseObj)
        {
            var tempArtists = responseObj.response.artists;
            tempArtists.AsParallel().ForAll(artist =>
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
                    var data = JsonConvert.DeserializeObject<EchoRootObject>(resp);
                    if (data.response.genres.Count > 0)
                    {
                        data.response.genres.ForEach(g =>
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
            var genreList = dataCon.Genres.SqlQuery("SELECT * FROM Genres").ToList();
            ConcurrentBag<ArtistGenre> aG = new ConcurrentBag<ArtistGenre>();
            ConcurrentBag<int> aR = new ConcurrentBag<int>();
            totalArtists.AsParallel().ForAll(a =>
            {
                WebClient wc = new WebClient();
                bool flag = true;
                while (flag)
                {
                    try
                    {
                        var url = "http://developer.echonest.com/api/v4/artist/terms?api_key=L6L1RWYT1A0EWKHJF&id=" + a.EchonestID + "&format=json";
                        var resp = wc.DownloadString(url);
                        var data = JsonConvert.DeserializeObject<SpotifyGenreResponse>(resp);
                        aR.Add(a.Id);
                        Console.WriteLine("Count: " + aR.Count);
                        data.response.terms.ForEach(g =>
                        {
                            var tempGenre = new ArtistGenre();
                            if (genreList.Where(gr => gr.GenreName == g.name).Count() != 0)
                            {
                                tempGenre.Genre = genreList.Where(gr => gr.GenreName == g.name).FirstOrDefault();
                                tempGenre.Artist = a;
                                tempGenre.Frequency = g.frequency;
                                tempGenre.Weight = g.weight;
                                aG.Add(tempGenre);
                            }

                        });
                        flag = false;
                    }
                    catch (Exception e)
                    {
                        Thread.Sleep(10000);
                    }
                }
            });
            dataCon.ArtistGenres.AddRange(aG.ToList());
        }

        static void CalculateArtistPopularity()
        {
            /*var activeYears = dataCon.Database.SqlQuery<DBArtistActiveYear>(" select * from ActiveYears AY " +
                            " INNER JOIN Artists A ON AY.ArtistId = A.ID").ToList();

            var dataList = dataCon.Database.SqlQuery<DBArtistModel>(" SELECT AL.ArtistId, A.ArtistName, A.ArtistLocation, A.ArtistImageURL, AlbumReleaseDate, A.ArtistCurrentPopularity, ROUND(SUM(AlbumRating) / COUNT(AlbumRating), 2) as 'Rating', COUNT(AlbumRating) as '# Samples' " +
                            " FROM Albums Al " +
                            " INNER JOIN Artists A ON AL.ArtistId = A.Id " +
                            " WHERE AlbumReleaseDate <> -1 and AlbumReleaseDate <> 0" +
                            " GROUP BY ArtistId, AlbumReleaseDate, A.ArtistName, A.ArtistLocation, A.ArtistImageURL, A.ArtistCurrentPopularity " +
                            " ORDER BY ArtistId, AlbumReleaseDate, Rating desc").ToList();

            List<RatingsDict> ratings = new List<RatingsDict>();
            dataList.ForEach(d =>
            {
                if (!ratings.Exists(a => a.ArtistId == d.ArtistId))
                {
                    RatingsDict r = new RatingsDict();
                    activeYears.Where(y => y.ArtistId == d.ArtistId).ToList().ForEach(ay =>
                    {
                        r.ArtistActiveYears.Add(new ArtistActiveYearsDict(ay.Start, ay.End));
                    });
                    r.ArtistId = d.ArtistId;
                    ratings.Add(r);
                }
                ratings.FirstOrDefault(a => a.ArtistId == d.ArtistId).ArtistAlbums.Add(new ArtistAlbumsDict(d.AlbumReleaseDate, d.Rating));
            });

            ConcurrentBag<ArtistPopularity> data = new ConcurrentBag<ArtistPopularity>();
            ratings.AsParallel().ForAll(r =>
            {
                Console.WriteLine(r.ArtistId);
                var rankings = Compute(r.ArtistAlbums, r.ArtistActiveYears);
                rankings.ForEach(rank =>
                {
                    ArtistPopularity a = new ArtistPopularity();
                    a.Popularity = rank.Value;
                    a.Year = rank.Key;
                    a.Artist = totalArtists.Where(ar => ar.Id == r.ArtistId).FirstOrDefault();
                    data.Add(a);
                });
            });
            dataCon.ArtistPopularities.AddRange(data.ToList());            
            */

            totalActiveYears = dataCon.Database.SqlQuery<ActiveYear>("SELECT * from ActiveYears").ToList();
            var artistIds = dataCon.Database.SqlQuery<int>("SELECT Id from Artists Where ArtistName = 'Westlife'").ToList();
            var albumsL = dataCon.Albums.SqlQuery("SELECT * FROM Albums").ToList();
            ConcurrentBag<ArtistPopularity> artistP = new ConcurrentBag<ArtistPopularity>();

            artistIds.AsParallel().ForAll(a =>
                {
                    var albums = albumsL.Where(al => al.ArtistId == a).ToList();
                    var activeYears = GetActiveYears(a);
                    double popularity = 0;
                    Dictionary<int, double> popularites = new Dictionary<int, double>();
                    if (albums.Count > 0)
                    {
                        popularites.Add(activeYears.FirstOrDefault(), 50);
                        albums.ForEach(alb =>
                        {
                            popularity += Convert.ToDouble(alb.AlbumRating);
                            popularites.Add(Convert.ToInt32(alb.AlbumReleaseDate), Convert.ToInt32(alb.AlbumRating));
                        });
                        popularity /= albums.Count;
                        
                        ArtistPopularity artPop = new ArtistPopularity();
                        artPop.Popularity = popularity;
                        //artPop.Year = i;
                        artPop.Artist = totalArtists.Where(artist => artist.Id == a).FirstOrDefault();
                        artistP.Add(artPop);
                    }
                });
            dataCon.ArtistPopularities.AddRange(artistP.ToList());
        }

        public static List<int> GetActiveYears(int artistId)
        {
            var artistYears = totalActiveYears.Where(a => a.ArtistId == artistId).ToList();
            var activeYears = new List<int>();
            if (artistYears.Count > 0)
            {
                artistYears = artistYears.OrderBy(y => y.Start).ToList();
                int startYear = artistYears.FirstOrDefault().Start;
                int endYear = artistYears.LastOrDefault().End;

                if (endYear == 0)
                {
                    endYear = 2014;
                }

                for (int i = startYear; i <= endYear; i++)
                {
                    activeYears.Add(i);
                }

                if (artistYears.Count > 1)
                {
                    int tempStart = -1;
                    int tempEnd = -1;
                    foreach (var ac in artistYears)
                    {
                        if (tempStart == -1)
                            tempStart = ac.End + 1;
                        else if (tempEnd == -1)
                            tempEnd = ac.Start - 1;

                        while (tempStart != -1 && tempEnd != -1)
                        {
                            activeYears.RemoveAll(y => y >= tempStart && y <= tempEnd);
                            tempStart = ac.End + 1;
                            if (artistYears.LastOrDefault() == ac)
                            {
                                tempEnd = endYear;
                            }
                        }
                    }
                }
            }
            return activeYears;
        }

        public static Dictionary<int, double> GeneratePopularities(Dictionary<int, double> p, double pop)
        {
            return null;
        }

        public static List<int> GetActiveArtists(int year)
        {
            var ids = totalActiveYears.Where(a => a.Start <= year).ToList();
            ConcurrentBag<int> returnIds = new ConcurrentBag<int>();
            ids.AsParallel().ForAll(a =>
            {
                if (a.End != 0 && a.End <= year)
                    returnIds.Add(a.ArtistId);
            });
            return returnIds.ToList();
        }

        public static List<KeyValuePair<int, double>> Compute(List<ArtistAlbumsDict> ArtistAlbums, List<ArtistActiveYearsDict> ArtistActiveYears)
        {
            List<KeyValuePair<int, double>> finalList = new List<KeyValuePair<int, double>>();

            if (ArtistActiveYears.Count > 0 && ArtistAlbums.Count > 0)
            {
                if (ArtistActiveYears.LastOrDefault().EndYear == 0)
                {
                    ArtistActiveYears.LastOrDefault().EndYear = 2014;
                }

                if (ArtistActiveYears.Count == 1)
                {
                    List<double> pValues = new List<double>();

                    for (int i = 1; i < ArtistAlbums.Count; i++)
                    {
                        double p = ArtistAlbums[i].Rating - ArtistAlbums[i - 1].Rating;
                        int q = ArtistAlbums[i].Year - ArtistAlbums[i - 1].Year;
                        pValues.Add(p / q);
                    }
                    pValues.Add(0);

                    for (int i = ArtistAlbums.FirstOrDefault().Year, j = -1, index = 0; i <= ArtistActiveYears.FirstOrDefault().EndYear; i++, index++)
                    {
                        if (ArtistAlbums.Exists(a => a.Year == i))
                        {
                            j++;
                            index = 0;
                        }
                        if (j == pValues.Count)
                            finalList.Add(new KeyValuePair<int, double>(i, ArtistAlbums[j].Rating - ((4 * ArtistAlbums[j - 1].Rating) / 100)));
                        else
                            finalList.Add(new KeyValuePair<int, double>(i, ArtistAlbums[j].Rating + pValues[j] * index));
                    }
                }
                else
                {
                    foreach (var artistActiveYears in ArtistActiveYears)
                    {
                        List<ArtistActiveYearsDict> tempList = new List<ArtistActiveYearsDict>();
                        tempList.Add(artistActiveYears);
                        var resultSet = Compute(ArtistAlbums.FindAll(a => a.Year >= artistActiveYears.StartYear && a.Year <= artistActiveYears.EndYear), tempList);
                        if (resultSet.Count == 0)
                        {
                            for (int i = artistActiveYears.StartYear; i <= artistActiveYears.EndYear; i++)
                            {
                                var previousValue = resultSet.Count > 0 ? resultSet.LastOrDefault().Value - (4 * resultSet.LastOrDefault().Value) / 100 : 0;
                                resultSet.Add(new KeyValuePair<int, double>(i, previousValue));
                            }
                        }
                        finalList.AddRange(resultSet);
                    }
                }
            }
            return finalList;
        }

    }
}
