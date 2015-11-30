
var user1_top_ten_artists_data={};
var user1_top_ten_genres_data={};
var user1_my_artists_list_element={};
var user1_my_artists_list_data=[];
var user1_my_genres_list_data=[];
var user1_related_artists_data={};

var user2_top_ten_artists_data={};
var user2_top_ten_genres_data={};
var user2_my_artists_list_data=[];
var user2_my_genres_list_data=[];
var user2_related_artists_data={};



var shared_timeline_data=[];
var shared_pool_data=[];
var shared_pool_artists={};
var shared_pool_genres={};

var shared_color=[];

var top_artist_per_decade=[];

var baseURL='http://mkvalluri-001-site1.atempurl.com/api/';

var dummyData = [{"id":1,"title":"The Shawshank Redemption","year":1994,"votes":678790,"rating":9.2,"rank":1,"2008_1":825,"2008_2":1684,"2008_3":4019,"2008_4":1808,"2008_5":595,"2008_6":5814,"2008_7":7751,"2008_8":7818,"2008_9":1000,"2008_10":4901,"2008_11":1121,"2008_12":1676,"2009_1":6566,"2009_2":9189,"2009_3":5084,"2009_4":6094,"2009_5":5662,"2009_6":3834,"2009_7":7298,"2009_8":9850,"2009_9":9514,"2009_10":1919,"2009_11":5691,"2009_12":5921,"2010_1":3271,"2010_2":5044,"2010_3":4166,"2010_4":9910,"2010_5":2568,"2010_6":500,"2010_7":106,"2010_8":9359,"2010_9":3322,"2010_10":8669,"2010_11":5590,"2010_12":6412,"2011_1":6250,"2011_2":2341,"2011_3":1231,"2011_4":4311,"2011_5":3250,"2011_6":7968,"2011_7":9646,"2011_8":9976,"2011_9":1860,"2011_10":6771,"2011_11":9421,"2011_12":6052},{"id":2,"title":"The Godfather","year":1972,"votes":511495,"rating":9.2,"rank":2,"2008_1":4744,"2008_2":8097,"2008_3":4032,"2008_4":7566,"2008_5":4705,"2008_6":3551,"2008_7":6243,"2008_8":2587,"2008_9":7552,"2008_10":8267,"2008_11":6034,"2008_12":4954,"2009_1":8194,"2009_2":4167,"2009_3":9152,"2009_4":8026,"2009_5":2913,"2009_6":5817,"2009_7":2527,"2009_8":5382,"2009_9":8513,"2009_10":2161,"2009_11":1981,"2009_12":8909,"2010_1":5753,"2010_2":5471,"2010_3":8441,"2010_4":4742,"2010_5":3427,"2010_6":5448,"2010_7":2345,"2010_8":1410,"2010_9":1190,"2010_10":4712,"2010_11":7002,"2010_12":3004,"2011_1":8260,"2011_2":8357,"2011_3":9898,"2011_4":3225,"2011_5":5499,"2011_6":772,"2011_7":7473,"2011_8":9197,"2011_9":7296,"2011_10":5795,"2011_11":2243,"2011_12":4084},{"id":3,"title":"The Godfather: Part II","year":1974,"votes":319352,"rating":9,"rank":3,"2008_1":3239,"2008_2":8546,"2008_3":4520,"2008_4":5658,"2008_5":9962,"2008_6":1898,"2008_7":9645,"2008_8":3645,"2008_9":2843,"2008_10":2703,"2008_11":9150,"2008_12":7886,"2009_1":7036,"2009_2":786,"2009_3":1391,"2009_4":2467,"2009_5":5293,"2009_6":9924,"2009_7":98,"2009_8":4451,"2009_9":5325,"2009_10":8339,"2009_11":4009,"2009_12":9881,"2010_1":1124,"2010_2":6738,"2010_3":683,"2010_4":1579,"2010_5":1033,"2010_6":7754,"2010_7":5279,"2010_8":0,"2010_9":78,"2010_10":9214,"2010_11":9153,"2010_12":8039,"2011_1":2702,"2011_2":1323,"2011_3":1537,"2011_4":7690,"2011_5":2027,"2011_6":4134,"2011_7":7721,"2011_8":5278,"2011_9":8141,"2011_10":9983,"2011_11":7849,"2011_12":5303},{"id":4,"title":"The Good, the Bad and the Ugly","year":1966,"votes":213030,"rating":8.9,"rank":4,"2008_1":6387,"2008_2":7049,"2008_3":853,"2008_4":3796,"2008_5":8201,"2008_6":3256,"2008_7":3371,"2008_8":838,"2008_9":460,"2008_10":2350,"2008_11":7849,"2008_12":1780,"2009_1":6991,"2009_2":7947,"2009_3":3580,"2009_4":1336,"2009_5":9238,"2009_6":9107,"2009_7":2272,"2009_8":8258,"2009_9":6329,"2009_10":1587,"2009_11":9687,"2009_12":3113,"2010_1":6326,"2010_2":1599,"2010_3":4139,"2010_4":4733,"2010_5":1207,"2010_6":8378,"2010_7":8285,"2010_8":6670,"2010_9":8884,"2010_10":1425,"2010_11":7896,"2010_12":4027,"2011_1":6678,"2011_2":9200,"2011_3":990,"2011_4":3836,"2011_5":1305,"2011_6":9356,"2011_7":4406,"2011_8":5617,"2011_9":8501,"2011_10":9167,"2011_11":4815,"2011_12":7588},{"id":5, "title":"My Fair Lady", "year":1964,"votes":533848,"rating":8.9,"rank":5,"2008_1":4124,"2008_2":7580,"2008_3":8943,"2008_4":726,"2008_5":9630,"2008_6":72,"2008_7":9216,"2008_8":3065,"2008_9":3932,"2008_10":8715,"2008_11":9202,"2008_12":8502,"2009_1":2714,"2009_2":6146,"2009_3":9972,"2009_4":9784,"2009_5":5982,"2009_6":8769,"2009_7":2842,"2009_8":5311,"2009_9":5314,"2009_10":1311,"2009_11":6633,"2009_12":7306,"2010_1":7710,"2010_2":7259,"2010_3":2022,"2010_4":1546,"2010_5":4482,"2010_6":9194,"2010_7":8606,"2010_8":322,"2010_9":6280,"2010_10":7835,"2010_11":3570,"2010_12":9131,"2011_1":6809,"2011_2":1296,"2011_3":317,"2011_4":6412,"2011_5":4539,"2011_6":7534,"2011_7":952,"2011_8":8162,"2011_9":6341,"2011_10":6013,"2011_11":96,"2011_12":2932},{"id":6,"title":"12 Angry Men","year":1957,"votes":164558,"rating":8.9,"rank":6,"2008_1":5166,"2008_2":7691,"2008_3":8589,"2008_4":7165,"2008_5":4953,"2008_6":9688,"2008_7":8448,"2008_8":7663,"2008_9":8345,"2008_10":5278,"2008_11":7618,"2008_12":1204,"2009_1":1567,"2009_2":6242,"2009_3":184,"2009_4":9477,"2009_5":984,"2009_6":6084,"2009_7":3739,"2009_8":2435,"2009_9":1812,"2009_10":3344,"2009_11":4585,"2009_12":4544,"2010_1":1128,"2010_2":2864,"2010_3":8628,"2010_4":1458,"2010_5":9146,"2010_6":5983,"2010_7":3230,"2010_8":1540,"2010_9":9348,"2010_10":4604,"2010_11":9869,"2010_12":1019,"2011_1":1215,"2011_2":9784,"2011_3":4237,"2011_4":9156,"2011_5":6358,"2011_6":7420,"2011_7":7660,"2011_8":8808,"2011_9":1764,"2011_10":9855,"2011_11":9983,"2011_12":5995}];


function UI(user,userColor,stream_graph_holder,artists_list_holder,genres_list_holder,tabbed_menu_holder){
	this.user = user;
	this.userColor= userColor;
	this.stream_graph_holder=stream_graph_holder;
	this.artists_list_holder=artists_list_holder;
	this.genres_list_holder=genres_list_holder;
	this.tabbed_menu_holder=tabbed_menu_holder;
}

UI.prototype ={


	sharedTimeline: function(){
		 sT = new sharedTimeline(1950,2015);
		 sT.init();
	},


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
		sM = new sharedMap();
		var testdata = [{"ArtistId":17,"ArtistName":"Coldplay","ArtistLocation":"London, England","ArtistImageLink":"https://i.scdn.co/image/276b1ff385d67230f3a6ccbb9555556409a63618","ArtistMainGenre":"rock","ArtistGenres":[{"Name":"rock","Relevance":0.86},{"Name":"pop","Relevance":0.64},{"Name":"alternative rock","Relevance":0.08},{"Name":"indie rock","Relevance":0.05},{"Name":"electronic","Relevance":0.02},{"Name":"ambient","Relevance":0.01},{"Name":"easy listening","Relevance":0.01},{"Name":"electronica","Relevance":0.01},{"Name":"folk","Relevance":0.01},{"Name":"house","Relevance":0.01},{"Name":"pop rock","Relevance":0.01},{"Name":"indie pop","Relevance":0.0},{"Name":"piano rock","Relevance":0.0},{"Name":"soft rock","Relevance":0.0}],"ArtistActiveYears":[{"Start":1996,"End":0}],"ArtistSelected":0,"ArtistPopularity":72.443333333333328},{"ArtistId":227,"ArtistName":"The XX","ArtistLocation":"London, England, GB","ArtistImageLink":"https://i.scdn.co/image/c051e25cb86c24c17715fae8abef3806402444c3","ArtistMainGenre":"pop","ArtistGenres":[{"Name":"pop","Relevance":0.5},{"Name":"electronic","Relevance":0.22},{"Name":"minimal","Relevance":0.11},{"Name":"soul","Relevance":0.11},{"Name":"indie pop","Relevance":0.07},{"Name":"indie rock","Relevance":0.07},{"Name":"rock","Relevance":0.05},{"Name":"dream pop","Relevance":0.03},{"Name":"electronica","Relevance":0.03},{"Name":"alternative rock","Relevance":0.02},{"Name":"new wave","Relevance":0.02},{"Name":"ambient","Relevance":0.01},{"Name":"post-punk","Relevance":0.01}],"ArtistActiveYears":[{"Start":2005,"End":0}],"ArtistSelected":0,"ArtistPopularity":74.0},{"ArtistId":3,"ArtistName":"Adele","ArtistLocation":"London, UK","ArtistImageLink":"https://i.scdn.co/image/ccbe7b4fef679f821988c78dbd4734471834e3d9","ArtistMainGenre":"pop","ArtistGenres":[{"Name":"pop","Relevance":1.0},{"Name":"soul","Relevance":0.3},{"Name":"r&b","Relevance":0.06},{"Name":"blues","Relevance":0.02},{"Name":"jazz","Relevance":0.02},{"Name":"country","Relevance":0.01},{"Name":"folk","Relevance":0.01},{"Name":"singer-songwriter","Relevance":0.01},{"Name":"easy listening","Relevance":0.0}],"ArtistActiveYears":[{"Start":2006,"End":0}],"ArtistSelected":0,"ArtistPopularity":71.42},{"ArtistId":460,"ArtistName":"John Mayer","ArtistLocation":"Bridgeport, CT","ArtistImageLink":"https://i.scdn.co/image/ebf1756844ffe2ac55c7846981b5b9f65757ae30","ArtistMainGenre":"pop","ArtistGenres":[{"Name":"pop","Relevance":0.97},{"Name":"rock","Relevance":0.79},{"Name":"blues","Relevance":0.35},{"Name":"jazz","Relevance":0.12},{"Name":"country","Relevance":0.09},{"Name":"blues-rock","Relevance":0.06},{"Name":"pop rock","Relevance":0.06},{"Name":"singer-songwriter","Relevance":0.06},{"Name":"folk","Relevance":0.03},{"Name":"alternative rock","Relevance":0.02},{"Name":"soul","Relevance":0.02},{"Name":"folk rock","Relevance":0.01},{"Name":"soft rock","Relevance":0.01}],"ArtistActiveYears":[{"Start":1998,"End":0}],"ArtistSelected":0,"ArtistPopularity":67.666666666666671},{"ArtistId":171,"ArtistName":"Muse","ArtistLocation":"Teignmouth, Devon, England","ArtistImageLink":"https://i.scdn.co/image/0b3c04473aa6a2db8235e5092ec3413f35752b8d","ArtistMainGenre":"rock","ArtistGenres":[{"Name":"rock","Relevance":1.0},{"Name":"alternative rock","Relevance":0.09},{"Name":"progressive rock","Relevance":0.07},{"Name":"pop","Relevance":0.05},{"Name":"electronica","Relevance":0.03},{"Name":"electronic","Relevance":0.02},{"Name":"metal","Relevance":0.02},{"Name":"classic rock","Relevance":0.01},{"Name":"hard rock","Relevance":0.01},{"Name":"punk","Relevance":0.01},{"Name":"soundtrack","Relevance":0.01},{"Name":"space rock","Relevance":0.01},{"Name":"experimental rock","Relevance":0.0},{"Name":"new wave","Relevance":0.0}],"ArtistActiveYears":[{"Start":1994,"End":0}],"ArtistSelected":0,"ArtistPopularity":74.0},{"ArtistId":674,"ArtistName":"Red Hot Chili Peppers","ArtistLocation":"Los Angeles, CA","ArtistImageLink":"https://i.scdn.co/image/63815f898b95f2b24b3fcb9b6af4d2ed1b92270c","ArtistMainGenre":"rock","ArtistGenres":[{"Name":"rock","Relevance":1.0},{"Name":"funk","Relevance":0.27},{"Name":"funk rock","Relevance":0.14},{"Name":"punk","Relevance":0.08},{"Name":"alternative rock","Relevance":0.07},{"Name":"pop","Relevance":0.07},{"Name":"funk metal","Relevance":0.03},{"Name":"metal","Relevance":0.03},{"Name":"hard rock","Relevance":0.02},{"Name":"psychedelic rock","Relevance":0.02},{"Name":"rap","Relevance":0.02},{"Name":"rap rock","Relevance":0.02},{"Name":"soul","Relevance":0.02},{"Name":"blues","Relevance":0.0},{"Name":"classic rock","Relevance":0.0},{"Name":"grunge","Relevance":0.0},{"Name":"hardcore","Relevance":0.0}],"ArtistActiveYears":[{"Start":1983,"End":0}],"ArtistSelected":0,"ArtistPopularity":72.4},{"ArtistId":479,"ArtistName":"The Script","ArtistLocation":"Dublin, Ireland","ArtistImageLink":"https://i.scdn.co/image/474c5cf617a29c3b021e0a4e26754585ace7ca7e","ArtistMainGenre":"pop","ArtistGenres":[{"Name":"pop","Relevance":1.0},{"Name":"rock","Relevance":0.53},{"Name":"pop rock","Relevance":0.08},{"Name":"soul","Relevance":0.04},{"Name":"r&b","Relevance":0.02},{"Name":"indie pop","Relevance":0.01},{"Name":"rap","Relevance":0.01},{"Name":"alternative rock","Relevance":0.0},{"Name":"indie rock","Relevance":0.0},{"Name":"piano rock","Relevance":0.0},{"Name":"soft rock","Relevance":0.0}],"ArtistActiveYears":[{"Start":2001,"End":0}],"ArtistSelected":0,"ArtistPopularity":67.0},{"ArtistId":92,"ArtistName":"Bruno Mars","ArtistLocation":"Los Angeles, CA ","ArtistImageLink":"https://i.scdn.co/image/f22774ca7d636e724164a65b2601ab39538a3aed","ArtistMainGenre":"pop","ArtistGenres":[{"Name":"pop","Relevance":1.0},{"Name":"rock","Relevance":0.47},{"Name":"soul","Relevance":0.2},{"Name":"r&b","Relevance":0.18},{"Name":"reggae","Relevance":0.1},{"Name":"blues","Relevance":0.07},{"Name":"funk","Relevance":0.05},{"Name":"dancehall","Relevance":0.01},{"Name":"folk","Relevance":0.01},{"Name":"hip hop","Relevance":0.01},{"Name":"pop rock","Relevance":0.01},{"Name":"romantic","Relevance":0.01},{"Name":"singer-songwriter","Relevance":0.01},{"Name":"soft rock","Relevance":0.01},{"Name":"soundtrack","Relevance":0.01},{"Name":"alternative hip hop","Relevance":0.0}],"ArtistActiveYears":[{"Start":2004,"End":0}],"ArtistSelected":0,"ArtistPopularity":78.0},{"ArtistId":253,"ArtistName":"Marc Anthony","ArtistLocation":"New York, NY","ArtistImageLink":"https://i.scdn.co/image/20dcbf6d753975b784cc9af19ad897da3df09675","ArtistMainGenre":"pop","ArtistGenres":[{"Name":"pop","Relevance":0.87},{"Name":"latin","Relevance":0.55},{"Name":"salsa","Relevance":0.28},{"Name":"latin pop","Relevance":0.16}],"ArtistActiveYears":[{"Start":1988,"End":0}],"ArtistSelected":0,"ArtistPopularity":66.0},{"ArtistId":34,"ArtistName":"Skrillex","ArtistLocation":"Los Angeles, CA, US","ArtistImageLink":"https://i.scdn.co/image/39e1d16745912f0ae73e7967f062a4414479775b","ArtistMainGenre":"dubstep","ArtistGenres":[{"Name":"dubstep","Relevance":0.68},{"Name":"electronic","Relevance":0.68},{"Name":"electro","Relevance":0.36},{"Name":"house","Relevance":0.28},{"Name":"techno","Relevance":0.09},{"Name":"trance","Relevance":0.08},{"Name":"dub","Relevance":0.07},{"Name":"electro house","Relevance":0.06},{"Name":"pop","Relevance":0.06},{"Name":"reggae","Relevance":0.06},{"Name":"electronica","Relevance":0.05},{"Name":"remix","Relevance":0.03},{"Name":"experimental","Relevance":0.02},{"Name":"fidget house","Relevance":0.02},{"Name":"hardcore","Relevance":0.02},{"Name":"rap","Relevance":0.02},{"Name":"soundtrack","Relevance":0.02},{"Name":"big beat","Relevance":0.01},{"Name":"breakcore","Relevance":0.01},{"Name":"downtempo","Relevance":0.01}],"ArtistActiveYears":[{"Start":2002,"End":0}],"ArtistSelected":0,"ArtistPopularity":65.0}]
		sM.Layer1Data(testdata);


		// Zoom on map double-click
map.on('dblclick', function(e) {
    // Zoom exactly to each double-clicked point
    map.setView(e.latlng, map.getZoom() + 1);
});

var currZoom = map.getZoom();
map.on('zoomstart', function(e) {
    console.log('start');
    currZoom = map.getZoom();
})
map.on('zoomend', function(e) {
    console.log('end');

    var zoomfactor;
    if (map.getZoom() > currZoom)
        zoomfactor = 1.5;
    else
        zoomfactor =  2/3;
    Layer1.eachLayer(function (layer) {
                layer.setRadius(layer.getRadius()*zoomfactor);
               });
       Layer2.eachLayer(function (layer) {
                layer.setRadius(layer.getRadius()*zoomfactor);
               });
})


},

	sharedGraph: function(){
		top_artist_per_decade = getTop10GenresPerYear();
		fG = new ForceGraph("#shared_graph", 1940, 2010, "#f03b20", "#2b8cbe", "#feb24c",baseURL);
        fG.init();

		
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
				template:"#Name#\
				 <button id= #ArtistId# class='delete_genre_list_button'></button>",
				 data:dummyData,
				select:true
			}

			]
		});
	},

	sharedPool: function(){
		webix.ui({
			container:"shared_pool",
			id:"shared_pool",
			view:"list",
			scroll:"x",
			layout:"x",
			template:"<img class =#user# src=#imageLink#><div class='webix_strong'>#Name# </div>",
			data:shared_pool_data
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
     						   	 			      template:"<img src=#ArtistImageLink#><div class='webix_strong'>#ArtistName# </div> <p>Primary Genre: #ArtistMainGenre#</p> <p>Location: #ArtistLocation#</p>",
     						   	 			       url:baseURL+'TopArtists?startYear=1950&endYear=2015',
     						   	 			      	select:1
     						   	 			 }
     						   	 	},
     						   	 	{
     						   	 		header:"Top Ten Genres",
     						   	 		body:{view:"dataview",
     						   	 		id:this.user+"_top_ten_genres",
     						   	 			  container:this.tabbed_menu_holder,
     						   	 			      template:"<div class='webix_strong'>#Name# </div>",
     						   	 			      url:baseURL+'TopGenresByDecade?startYear=1950&endYear=2015',
     						   	 			  	  select:1}
     						   	 	}
     						   	 ]
     						   }, 
        					   {
        					   	 header:"Related Artist",
        						 body:{view:"dataview",
        						 			id:this.user+"_related_artist",
     						   	 			  container:this.tabbed_menu_holder,
     						   	 			      template:"<img src=#ArtistImageLink#><div class='webix_strong'>#ArtistName#</div> <p>Primary Genre: #ArtistMainGenre#</p> <p>Location: #ArtistLocation#</p>",
     						 	 			        url:'',
     						 	 			        select:true
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
											label:"<div class='webix_strong'>Search Artist</div>",
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
									id:"search_genre",
									elements:[
										{
											view:"text",
											label:"<div class='webix_strong'>Search Genre</div>",
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


