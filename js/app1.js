
var user1 = new UI("user1",
					"red",
					"#user1_streamgraph",
					"user1_artist_list",
					"user1_genre_list",
					"user1_tabbed_menu"
				  );

user1.streamGraph();
user1.artistList();
user1.genreList();
user1.tabbedMenu();


var user2 = new UI("user2",
				    "red",
				    "#user2_streamgraph",
				    "user2_artist_list",
				    "user2_genre_list",
				    "user2_tabbed_menu"
				  );

user2.streamGraph();
user2.artistList();
user2.genreList();
user2.tabbedMenu();

var sharedUI = new UI("sharedUI","yellow");
sharedUI.sharedMap();
sharedUI.sharedGraph();
var test;

$$("user1_top_ten_artists").attachEvent("onItemClick",function(id){

	//alert(this.getItem(id).ArtistName);
   $$('user1_top_ten_genres').unselect();
   $$('user1_related_artist').clearAll();
   $$("user1_related_artist").load('http://cs424.azurewebsites.net/api/TopArtists?startYear=2010&endYear=2014');

 })


$$("user1_top_ten_artists").attachEvent("onItemDblClick",function(id){


	
	user1_my_artists_list_data.forEach(function(d,i){
			console.log(d);
	});


	user1_my_artists_list_data.push({"ArtistName":this.getItem(id).ArtistName});

	$$('user1_my_artist_list').add({ArtistName:this.getItem(id).ArtistName})
	
})


$$("user1_top_ten_genres").attachEvent("onItemClick",function(id){
   $$('user1_top_ten_artists').unselect();
   $$('user1_related_artist').clearAll();
   $$("user1_related_artist").load('http://cs424.azurewebsites.net/api/TopArtists?startYear=2010&endYear=2014');

 })

$('#user1_my_artist_clear').click(function(){
	$$('user1_my_artist_list').clearAll();
})

$('#user1_my_genre_clear').click(function(){
	$$('user1_my_genre_list').clearAll();
})

$('.user1_add_artist_button').click(function(){
	alert("fg");
});


$$("user2_top_ten_artists").attachEvent("onItemClick",function(id){
   $$('user2_top_ten_genres').unselect();
   $$('user2_related_artist').clearAll();
   $$("user2_related_artist").load('http://cs424.azurewebsites.net/api/TopArtists?startYear=2010&endYear=2014');

 })



$$("user2_top_ten_genres").attachEvent("onItemClick",function(id){
   $$('user2_top_ten_artists').unselect();
   $$('user2_related_artist').clearAll();
   $$("user2_related_artist").load('http://cs424.azurewebsites.net/api/TopArtists?startYear=2010&endYear=2014');

 })

$('#user2_my_artist_clear').click(function(){
	$$('user2_my_artist_list').clearAll();
})

$('#user2_my_genre_clear').click(function(){
	$$('user2_my_genre_list').clearAll();
})

