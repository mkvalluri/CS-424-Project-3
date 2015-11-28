
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

$(document).ready(function(){

$$("user1_top_ten_artists").attachEvent("onItemClick",function(id){

	//alert(this.getItem(id).ArtistName);
   $$('user1_top_ten_genres').unselect();
   $$('user1_related_artist').clearAll();
   $$("user1_related_artist").load('http://cs424.azurewebsites.net/api/TopArtists?startYear=2010&endYear=2014');

 })


$$("user1_top_ten_artists").attachEvent("onItemDblClick",function(id){


	var item=this.getItem(id).ArtistId;
	var isItemAlreadyOnTheList=false
	user1_my_artists_list_data.forEach(function(d,i){
			if(d.ArtistId==item)
				isItemAlreadyOnTheList=true;
	});

	if(!isItemAlreadyOnTheList){
	user1_my_artists_list_data.push({"ArtistId":this.getItem(id).ArtistId,"ArtistName":this.getItem(id).ArtistName});

	$$('user1_my_artist_list').add({ArtistId:this.getItem(id).ArtistId,ArtistName:this.getItem(id).ArtistName})
	}
})


$$("user1_top_ten_genres").attachEvent("onItemClick",function(id){
   $$('user1_top_ten_artists').unselect();
   $$('user1_related_artist').clearAll();
   $$("user1_related_artist").load('http://cs424.azurewebsites.net/api/TopArtists?startYear=2010&endYear=2014');

 })

$('#user1_my_artist_clear').click(function(){
	$$('user1_my_artist_list').clearAll();
	user1_my_artists_list_data=[];
})

$('#user1_my_genre_clear').click(function(){
	$$('user1_my_genre_list').clearAll();
})


$$("user1_my_artist_list").attachEvent("onItemDblClick",function(id){

	var selectedId =  this.getItem(id).ArtistId;	
	$$("user1_my_artist_list").remove($$("user1_my_artist_list").getSelectedId());

	$.each(user1_my_artists_list_data, function(i){
    if(user1_my_artists_list_data[i].ArtistId === selectedId) {
        user1_my_artists_list_data.splice(i,1);
        return false;
    }
});
	
})


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

});