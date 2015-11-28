
var user1_top_ten_artists_data={};
var user1_top_ten_genres_data={};
var user1_my_artists_list_element={};
var user1_my_artists_list_data=[];
var user1_my_genres_list_data={};
var user1_related_artists_data={};

var user2_top_ten_artists_data={};
var user2_top_ten_genres_data={};
var user2_my_artists_list_data={};
var user2_my_genres_list_data={};
var user2_related_artists_data={};

var shared_pool={};
var shared_pool_artists={};
var shared_pool_genres={};


var data = [{"id":1,"title":"The Shawshank Redemption","year":1994,"votes":678790,"rating":9.2,"rank":1,"2008_1":825,"2008_2":1684,"2008_3":4019,"2008_4":1808,"2008_5":595,"2008_6":5814,"2008_7":7751,"2008_8":7818,"2008_9":1000,"2008_10":4901,"2008_11":1121,"2008_12":1676,"2009_1":6566,"2009_2":9189,"2009_3":5084,"2009_4":6094,"2009_5":5662,"2009_6":3834,"2009_7":7298,"2009_8":9850,"2009_9":9514,"2009_10":1919,"2009_11":5691,"2009_12":5921,"2010_1":3271,"2010_2":5044,"2010_3":4166,"2010_4":9910,"2010_5":2568,"2010_6":500,"2010_7":106,"2010_8":9359,"2010_9":3322,"2010_10":8669,"2010_11":5590,"2010_12":6412,"2011_1":6250,"2011_2":2341,"2011_3":1231,"2011_4":4311,"2011_5":3250,"2011_6":7968,"2011_7":9646,"2011_8":9976,"2011_9":1860,"2011_10":6771,"2011_11":9421,"2011_12":6052},{"id":2,"title":"The Godfather","year":1972,"votes":511495,"rating":9.2,"rank":2,"2008_1":4744,"2008_2":8097,"2008_3":4032,"2008_4":7566,"2008_5":4705,"2008_6":3551,"2008_7":6243,"2008_8":2587,"2008_9":7552,"2008_10":8267,"2008_11":6034,"2008_12":4954,"2009_1":8194,"2009_2":4167,"2009_3":9152,"2009_4":8026,"2009_5":2913,"2009_6":5817,"2009_7":2527,"2009_8":5382,"2009_9":8513,"2009_10":2161,"2009_11":1981,"2009_12":8909,"2010_1":5753,"2010_2":5471,"2010_3":8441,"2010_4":4742,"2010_5":3427,"2010_6":5448,"2010_7":2345,"2010_8":1410,"2010_9":1190,"2010_10":4712,"2010_11":7002,"2010_12":3004,"2011_1":8260,"2011_2":8357,"2011_3":9898,"2011_4":3225,"2011_5":5499,"2011_6":772,"2011_7":7473,"2011_8":9197,"2011_9":7296,"2011_10":5795,"2011_11":2243,"2011_12":4084},{"id":3,"title":"The Godfather: Part II","year":1974,"votes":319352,"rating":9,"rank":3,"2008_1":3239,"2008_2":8546,"2008_3":4520,"2008_4":5658,"2008_5":9962,"2008_6":1898,"2008_7":9645,"2008_8":3645,"2008_9":2843,"2008_10":2703,"2008_11":9150,"2008_12":7886,"2009_1":7036,"2009_2":786,"2009_3":1391,"2009_4":2467,"2009_5":5293,"2009_6":9924,"2009_7":98,"2009_8":4451,"2009_9":5325,"2009_10":8339,"2009_11":4009,"2009_12":9881,"2010_1":1124,"2010_2":6738,"2010_3":683,"2010_4":1579,"2010_5":1033,"2010_6":7754,"2010_7":5279,"2010_8":0,"2010_9":78,"2010_10":9214,"2010_11":9153,"2010_12":8039,"2011_1":2702,"2011_2":1323,"2011_3":1537,"2011_4":7690,"2011_5":2027,"2011_6":4134,"2011_7":7721,"2011_8":5278,"2011_9":8141,"2011_10":9983,"2011_11":7849,"2011_12":5303},{"id":4,"title":"The Good, the Bad and the Ugly","year":1966,"votes":213030,"rating":8.9,"rank":4,"2008_1":6387,"2008_2":7049,"2008_3":853,"2008_4":3796,"2008_5":8201,"2008_6":3256,"2008_7":3371,"2008_8":838,"2008_9":460,"2008_10":2350,"2008_11":7849,"2008_12":1780,"2009_1":6991,"2009_2":7947,"2009_3":3580,"2009_4":1336,"2009_5":9238,"2009_6":9107,"2009_7":2272,"2009_8":8258,"2009_9":6329,"2009_10":1587,"2009_11":9687,"2009_12":3113,"2010_1":6326,"2010_2":1599,"2010_3":4139,"2010_4":4733,"2010_5":1207,"2010_6":8378,"2010_7":8285,"2010_8":6670,"2010_9":8884,"2010_10":1425,"2010_11":7896,"2010_12":4027,"2011_1":6678,"2011_2":9200,"2011_3":990,"2011_4":3836,"2011_5":1305,"2011_6":9356,"2011_7":4406,"2011_8":5617,"2011_9":8501,"2011_10":9167,"2011_11":4815,"2011_12":7588},{"id":5, "title":"My Fair Lady", "year":1964,"votes":533848,"rating":8.9,"rank":5,"2008_1":4124,"2008_2":7580,"2008_3":8943,"2008_4":726,"2008_5":9630,"2008_6":72,"2008_7":9216,"2008_8":3065,"2008_9":3932,"2008_10":8715,"2008_11":9202,"2008_12":8502,"2009_1":2714,"2009_2":6146,"2009_3":9972,"2009_4":9784,"2009_5":5982,"2009_6":8769,"2009_7":2842,"2009_8":5311,"2009_9":5314,"2009_10":1311,"2009_11":6633,"2009_12":7306,"2010_1":7710,"2010_2":7259,"2010_3":2022,"2010_4":1546,"2010_5":4482,"2010_6":9194,"2010_7":8606,"2010_8":322,"2010_9":6280,"2010_10":7835,"2010_11":3570,"2010_12":9131,"2011_1":6809,"2011_2":1296,"2011_3":317,"2011_4":6412,"2011_5":4539,"2011_6":7534,"2011_7":952,"2011_8":8162,"2011_9":6341,"2011_10":6013,"2011_11":96,"2011_12":2932},{"id":6,"title":"12 Angry Men","year":1957,"votes":164558,"rating":8.9,"rank":6,"2008_1":5166,"2008_2":7691,"2008_3":8589,"2008_4":7165,"2008_5":4953,"2008_6":9688,"2008_7":8448,"2008_8":7663,"2008_9":8345,"2008_10":5278,"2008_11":7618,"2008_12":1204,"2009_1":1567,"2009_2":6242,"2009_3":184,"2009_4":9477,"2009_5":984,"2009_6":6084,"2009_7":3739,"2009_8":2435,"2009_9":1812,"2009_10":3344,"2009_11":4585,"2009_12":4544,"2010_1":1128,"2010_2":2864,"2010_3":8628,"2010_4":1458,"2010_5":9146,"2010_6":5983,"2010_7":3230,"2010_8":1540,"2010_9":9348,"2010_10":4604,"2010_11":9869,"2010_12":1019,"2011_1":1215,"2011_2":9784,"2011_3":4237,"2011_4":9156,"2011_5":6358,"2011_6":7420,"2011_7":7660,"2011_8":8808,"2011_9":1764,"2011_10":9855,"2011_11":9983,"2011_12":5995}];


function UI(user,userColor,stream_graph_holder,artists_list_holder,genres_list_holder,tabbed_menu_holder){
	this.user = user;
	this.userColor= userColor;
	this.stream_graph_holder=stream_graph_holder;
	this.artists_list_holder=artists_list_holder;
	this.genres_list_holder=genres_list_holder;
	this.tabbed_menu_holder=tabbed_menu_holder;
}

UI.prototype ={


	streamGraph: function(){
		var jsonData = getTop10GenresPerYear(1960,2010);
		var data = bumpLayer(100);
        this.s = new StreamGraph(this.stream_graph_holder, jsonData, 1960, 2010,this.user);
        this.s.init();

        // Inspired by Lee Byron's test data generator.
        function bumpLayer(n) {

            function getGenres(genres){
                var selectedGenres = [], rand, rank;

                for(var i = 0; i < genres.length; i++)
                    selectedGenres[i] = { genre: genres[i], rate: 0 };

                for(var i = 0; i < 10; i++){
                    rand = Math.floor((Math.random() * genres.length));
                    rank = Math.floor((Math.random() * 1000) + 1);

                    for(var j = 0; i < selectedGenres.length; j++){
                        if (selectedGenres[j].genre == genres[rand]){
                            selectedGenres[j].rate = rank;
                            genres.splice(rand,1);
                            break;
                        }
                    }
                }

                return selectedGenres;
            }

            var elems = [], i, iyear = 1900;
            var genres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
            var countGenres = genres.length;

            for (i = 0; i < n; i++) {
                elems[i] = { year: iyear + i, genres: getGenres(genres.slice()) };
            }

            /*
             totals = [];
             elems.forEach(function(elem){
             var y0 = 0;
             elem.layer = elem.genres.map(function(d, i){
             return { x: i, name: d.genre, y0: y0, y1: y0 += +d.rate }
             });
             elem.total = elem.layer[countGenres - 1].y1;
             totals.push(elem.total);
             });
             */
            elems.forEach(function(elem){
                elem.layer = elem.genres.map(function(d, i){
                    return { x: i, name: d.genre, y: d.rate }
                });
            });

            var results = [];
            for(var i = 0; i < countGenres; i++){
                var gens = [];
                for(var j = 0; j < n; j++){
                    gens[j] = elems[j].layer[i];
                    gens[j].year = elems[j].year;
                }
                results[i] = gens;
            }

            for(var i = 0; i < results.length; i++) {
                for(var j = 0; j < results[i].length; j++){
                    results[i][j].x = j;
                }
            }

            return results;
            //return elems.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
        }
	},

	sharedMap: function(){

		L.mapbox.accessToken = 'pk.eyJ1IjoicmV2cmVkZHkiLCJhIjoiY2lmdHlqdmNvMWZ3enVla3Fnc2xrZG93ciJ9.cy6JtcSeMkTM3AsMDtmYOg';

		var Dark = L.mapbox.tileLayer('revreddy.c054f98b'),
    	Streets = L.mapbox.tileLayer('mapbox.streets');

		var map = L.mapbox.map('map', null, {
    										 center: [10, -20],
    										 zoom: 3,
  						 		 			 maxZoom: 18,
											}
							  );

		var mapLayers = {
    						'Color': Streets,
    						'Dark': Dark
						}

		mapLayers.Dark.addTo(map);
		L.control.layers(mapLayers).addTo(map);

//===========================Styles==================================// 

		// Circle styles
		var circle_options = {
								color: '#fb002c',
    							radius: 3,           // Circle radius
    							opacity: 1,          // Stroke opacity
    							weight: 2,           // Stroke weight
    							fillOpacity: 0.5,    // Fill opacity
							 };

//==========================Data=====================================// 

		var data = {
    				"response": {
        							"artist": {
            						"artist_location": {
                					"city": "Abingdon",
               					    "country": "United Kingdom",
                					"location": "Abingdon, England, GB",
                					"region": "England"
            						},
            					"id": "ARH6W4X1187B99274F",
            					"name": "Radiohead"
        						},
     			   "status": {
            	   "code": 0,
            	   "message": "Success",
            	   "version": "4.2"
       		 		}	
    			}
			}

		// URL-ify the artist location
		var query = data.response.artist.artist_location.location;
		var query_url = query.split(' ').join('+');

		// Construct Google Maps Geocoding API request url
		var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query_url + '&key=AIzaSyDMc9VGuxnKUV_MTVBenP73RMmEs3LYUgY'

		// Perform request to get latlng for artist location
		$.get(url, function(data) {
    		console.log(data);

    	if (data.status.localeCompare("OK")) {
        	alert("Geocoding request failed: " + data.status);
    	}

    	// Plot latlng marker on map
    	var latlng = data.results[0].geometry.location;
    	var dot = L.circleMarker(latlng, circle_options);
    	dot.addTo(map);
		});

	},

	sharedGraph: function(){
		
	},

	artistList: function(){
		webix.ui({
			container:this.artists_list_holder,
			rows:[{
				id:"artist_title",
				view:"template",
				template:"\
				<span class='my_artist_title'>My Artists</span>\
				<button id="+this.user+"_my_artist_clear class='delete_artist_list_button'></button>",
				type:"header",
			},

			{
				view:"list",
				id:this.user+"_my_artist_list",
				template:"#ArtistName#\
				 <button id= #ArtistId# class='delete_artist_list_button'></button>",
				data:this.user1+"_my_artists_list_data",
				select:true

			}

			]
		});
	},


	genreList: function(){
		webix.ui({
			container:this.genres_list_holder,
			rows:[{
				id:"genre_title",
				view:"template",
				template:"\
				<span class='my_artist_title'>My Genres</span>\
				<button id="+this.user+"_my_genre_clear class='delete_artist_list_button'></button>",
				type:"header",

			},

			{
				view:"list",
				id:this.user+"_my_genre_list",
				template:"#title#\
				 <button class='delete_artist_list_button'></button>",
				data:data
			}

			]
		});
	},

	tabbedMenu: function(){
		webix.ui({
			container:this.tabbed_menu_holder,
			view:"tabview",
			cells:[
				{
					header:"Explore",
					body:{

						cols:[
     						   { template:"",
     						   	 rows:[
     						   	 	{
     						   	 		header:"Top Ten Artists",

     						   	 		body:{view:"dataview",
     						   	 		id:this.user+"_top_ten_artists",
     						   	 			  container:this.tabbed_menu_holder,
     						   	 			      template:"<img src=#ArtistImageLink#><div class='webix_strong'>#ArtistName# </div> <p>Primary Genre: #ArtistMainGenre#</p> <p>rank: #rank#</p>",
     						   	 			       url:'http://cs424.azurewebsites.net/api/TopArtists?startYear=1950&endYear=2015',
     						   	 			      	select:1
     						   	 			 }
     						   	 	},
     						   	 	{
     						   	 		header:"Top Ten Genres",
     						   	 		body:{view:"dataview",
     						   	 		id:this.user+"_top_ten_genres",
     						   	 			  container:this.tabbed_menu_holder,
     						   	 			      template:"<div class='webix_strong'>#Name# </div> <p>#Relevance#</p>",
     						   	 			      url:'http://cs424.azurewebsites.net/api/TopGenresByDecade?startYear=1950&endYear=2015',
     						   	 			  	  select:1}
     						   	 	}
     						   	 ]
     						   }, 
        					   {
        					   	 header:"Related Artist",
        						 body:{view:"dataview",
        						 			id:this.user+"_related_artist",
     						   	 			  container:this.tabbed_menu_holder,
     						   	 			      template:"<img src=#ArtistImageLink#><div class='webix_strong'>#ArtistName#</div> <p>Primary Genre: #ArtistMainGenre#</p> <p>rank: #rank#</p>",
     						 	 			        url:''
     						 	 			    }
        					   }
    						]
					}

				},

				{
					header:"Search",
					body:{
						container:this.tabbed_menu_holder,
						rows:[
						{
							cols:[
								{
									view:"form",
									container:this.tabbed_menu_holder,
									id:this.tabbed_menu_holder,
									elements:[
										{
											view:"text",
											label:"<div class='webix_strong'>Artist/Genre</div>",
										},
										
										{
											view:"button",
											type:"icon"
										}

									]
								},

								{
									view:"form",
									container:this.tabbed_menu_holder,
									id:"search_decade",
									elements:[
										{
										},
										{	
											view:"button",
											id:"test",
											type:"icon"
										}
									]
								},

								


							]
						},
						{
							view:"dataview",
							container:this.tabbed_menu_holder,
							columns:[
							{
								id:"artist",
								header:["Artist",{content:"textFilter"}],
								width:400,
								sort:"string"
								
							},
							{
								id:"genre",
								header:["Genre",{content:"textFilter"}],
								width:400,
								sort:"string"
							},
							{
								id:"year",
								header:["Year",{content:"textFilter"}],
								width:400,
								sort:"int"
							},
							{
								id:"country",
								header:["Country",{content:"textFilter"}],
								width:400,
								sort:"string"
							},
							{
								id:"popularity",
								header:["Popularity"],
								width:200,
								sort:"int"
							}
							],
							data:data

						}


						]
					}

					}
				
			]	
		});
	}




}


