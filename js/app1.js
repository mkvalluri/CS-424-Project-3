var user1 = new UI("user1",
  "red",
  "#user1_streamgraph",
  "user1_artist_list",
  "user1_genre_list",
  "user1_tabbed_menu"
);


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


user2.artistList();
user2.genreList();
user2.tabbedMenu();

var sharedUI = new UI("sharedUI", "yellow");


sharedUI.sharedTimeline();
sharedUI.sharedPool();



d3.json("../data/top10genresPerYear.json", function(error, data){
user1.streamGraph(data);
user2.streamGraph(data);
d3.json("../data/top10ArtistsPerDecade1960-2014.json",function(error,data){
	top_artist_per_decade =data;
	sharedUI.sharedGraph(data);
	sharedUI.sharedMap(data);


});
	});



$(document).ready(function() {

  $$('user1_my_artist_list').clearAll();
  user1_artist_list_data = [];
  $$('user1_my_genre_list').clearAll();
  user1_genre_list_data = [];

  $$('user2_my_artist_list').clearAll();
  user2_artist_list_data = [];
  $$('user2_my_genre_list').clearAll();
  user2_genre_list_data = [];

  $$("user1_top_ten_artists").attachEvent("onItemClick", function(id) {

    //alert(this.getItem(id).ArtistName);
    $$('user1_top_ten_genres').unselect();
    $$('user1_related_artist').clearAll();
    $$("user1_related_artist").load(baseURL+'SimilarArtistsByName?artistName=' + this.getItem(id).ArtistName);

  })

  $$("user1_top_ten_artists").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
    var itemName = this.getItem(id).ArtistName;
    var user = "user1";
    var isItemAlreadyOnTheList = false;

    user1_my_artists_list_data.forEach(function(d, i) {
      if (d.ArtistId == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user1_my_artists_list_data.push({
        "ArtistId": this.getItem(id).ArtistId,
        "ArtistName": this.getItem(id).ArtistName
      });
      $.each(user2_my_artists_list_data, function(i) {
        if (user2_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
              user="common"
              shared_timeline_data[i].user = user;
            }
          });

          $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user =user;
        }
      });

        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistImageLink": this.getItem(id).ArtistImageLink,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "ArtistLocation": this.getItem(id).ArtistLocation,
          "ArtistGenres":this.getItem(id).ArtistGenres,
          "ArtistPopularity":this.getItem(id).ArtistPopularity,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });

        shared_pool_data.push({
        	"Name":this.getItem(id).ArtistName,
        	"imageLink":this.getItem(id).ArtistImageLink,
        	"user":user
        });


       /*$$('shared_pool').add({
        Name: this.getItem(id).ArtistName,
        imageLink: this.getItem(id).ArtistImageLink
      })*/


      }
      $$('user1_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })


     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
     d3.select('.chart').remove();
     sT.init();



     $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });


    }
  })

  $$("user1_search_artist").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
    var itemName = this.getItem(id).ArtistName;
    var user = "user1";
    var isItemAlreadyOnTheList = false;

    user1_my_artists_list_data.forEach(function(d, i) {
      if (d.ArtistId == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user1_my_artists_list_data.push({
        "ArtistId": this.getItem(id).ArtistId,
        "ArtistName": this.getItem(id).ArtistName
      });
      $.each(user2_my_artists_list_data, function(i) {
        if (user2_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
              user="common"
              shared_timeline_data[i].user = user;
            }
          });

          $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user =user;
        }
      });

        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistImageLink": this.getItem(id).ArtistImageLink,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "ArtistLocation": this.getItem(id).ArtistLocation,
          "ArtistGenres":this.getItem(id).ArtistGenres,
          "ArtistPopularity":this.getItem(id).ArtistPopularity,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });

        shared_pool_data.push({
        	"Name":this.getItem(id).ArtistName,
        	"imageLink":this.getItem(id).ArtistImageLink,
        	"user":user
        });


       /*$$('shared_pool').add({
        Name: this.getItem(id).ArtistName,
        imageLink: this.getItem(id).ArtistImageLink
      })*/


      }
      $$('user1_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })


     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
     d3.select('.chart').remove();
     sT.init();



     $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });


    }
  })

  $$("user1_related_artist").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;;
    var itemName = this.getItem(id).ArtistName;
    var user = "user1";
    var isItemAlreadyOnTheList = false;

    user1_my_artists_list_data.forEach(function(d, i) {
      if (d.ArtistId == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user1_my_artists_list_data.push({
        "ArtistId": this.getItem(id).ArtistId,
        "ArtistName": this.getItem(id).ArtistName
      });

      $.each(user2_my_artists_list_data, function(i) {
        if (user2_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
              user = "common";
              shared_timeline_data[i].user = user;
            }
          });

            $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user =user;
        }
      });


        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistImageLink": this.getItem(id).ArtistImageLink,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "ArtistLocation": this.getItem(id).ArtistLocation,
          "ArtistGenres":this.getItem(id).ArtistGenres,
          "ArtistPopularity":this.getItem(id).ArtistPopularity,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });


        shared_pool_data.push({
        	"Name":this.getItem(id).ArtistName,
        	"imageLink":this.getItem(id).ArtistImageLink,
        	"user":user
        });
      }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
      d3.select('.chart').remove();
     sT.init();

          $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });


      $$('user1_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $$("user1_top_ten_genres").attachEvent("onItemClick", function(id) {
    $$('user1_top_ten_artists').unselect();
    $$('user1_related_artist').clearAll();
    $$("user1_related_artist").load(baseURL+'TopArtistsByGenre?genreName=' + this.getItem(id).Name);

  })

  $$("user1_top_ten_genres").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).Name;
    var user = "user1";
    var isItemAlreadyOnTheList = false
    user1_my_genres_list_data.forEach(function(d, i) {
      if (d.Name == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user1_my_genres_list_data.push({
        "Name": this.getItem(id).Name,
        "Relevance": this.getItem(id).Relevance
      });

      $.each(user2_my_genres_list_data, function(i) {
        if (user2_my_genres_list_data[i].Name == item) {
            $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == item) {
            	user="common";
            	shared_pool_data[i].user =user;
        }
      });


        }
      });

      if (user!="common") {


        shared_pool_data.push({
        	"Name":this.getItem(id).Name,
        	"imageLink":this.getItem(id).imageLink,
        	"user":user
        });
    }

         $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });





      $$('user1_my_genre_list').add({
        Name: this.getItem(id).Name,
        Relevance: this.getItem(id).Relevance
      })

  }
})

  $('#user1_my_artist_clear').click(function() {

  var isCommon;
  $.each(user1_my_artists_list_data, function(item) {
  	isCommon=false;
  	$.each(user2_my_artists_list_data, function(i) {
        if (user2_my_artists_list_data[i].ArtistId == user1_my_artists_list_data[item].ArtistId) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == user1_my_artists_list_data[item].ArtistId) {
            	isCommon=true;
              shared_timeline_data[i].user = "user2";
            }
          });

          $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == user1_my_artists_list_data[item].ArtistName) {
            	shared_pool_data[i].user ="user2";
        }
      });

        }
      });

  	if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === user1_my_artists_list_data[item].ArtistId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });

           $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === user1_my_artists_list_data[item].ArtistName) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }

  });

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
      d3.select('.chart').remove();
     sT.init();

      $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
				});


    $$('user1_my_artist_list').clearAll();
    user1_my_artists_list_data = [];
  })

  $('#user1_my_genre_clear').click(function() {

     var isCommon;
  $.each(user1_my_genres_list_data, function(item) {
  	isCommon=false;
  	$.each(user2_my_genres_list_data, function(i) {
        if (user2_my_genres_list_data[i].Name == user1_my_genres_list_data[item].Name) {

          $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == user1_my_genres_list_data[item].Name) {
            	isCommon=true;
            	shared_pool_data[i].user ="user2";
        }
      });

        }
      });

  	if(!isCommon){

           $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === user1_my_genres_list_data[item].Name) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }

  });

 $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
				});

 $$('user1_my_genre_list').clearAll();
    user1_my_genre_list_data = [];
  })

  $$("user1_my_artist_list").attachEvent("onItemDblClick", function(id) {

  	var item = this.getItem(id).ArtistId;
  	var itemName = this.getItem(id).ArtistName;
  	var isCommon=false;
    var selectedId = this.getItem(id).ArtistId;
    $$("user1_my_artist_list").remove($$("user1_my_artist_list").getSelectedId());

    $.each(user1_my_artists_list_data, function(i) {
      if (user1_my_artists_list_data[i].ArtistId === selectedId) {
        user1_my_artists_list_data.splice(i, 1);
        return false;
      }
    });

   $.each(user2_my_artists_list_data, function(i) {
        if (user2_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
            	isCommon=true;
              shared_timeline_data[i].user = "user2";
            }
          });

               $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user ="user2";
        }
      });

        }
      });

    if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === selectedId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });

      $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === itemName) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });

    }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
      d3.select('.chart').remove();
     sT.init();


      $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
				});

  })

  $$("user1_my_genre_list").attachEvent("onItemDblClick", function(id) {
  	var isCommon=false;
    var selectedId = this.getItem(id).Name;
    $$("user1_my_genre_list").remove($$("user1_my_genre_list").getSelectedId());

    $.each(user1_my_genres_list_data, function(i) {
      if (user1_my_genres_list_data[i].Name === selectedId) {
        user1_my_genres_list_data.splice(i, 1);
        return false;
      }
    });



   $.each(user2_my_genres_list_data, function(i) {
        if (user2_my_genres_list_data[i].Name == selectedId) {
        		isCommon=true;
               $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == selectedId) {
            	shared_pool_data[i].user ="user2";
        }
      });

        }
      });
	if(!isCommon){
        $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === selectedId) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }

        $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
				});

  })

  //User2

  $$("user2_top_ten_artists").attachEvent("onItemClick", function(id) {

    //alert(this.getItem(id).ArtistName);
    $$('user2_top_ten_genres').unselect();
    $$('user2_related_artist').clearAll();
    $$("user2_related_artist").load(baseURL+'SimilarArtistsByName?artistName=' + this.getItem(id).ArtistName);

  })

  $$("user2_top_ten_artists").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
    var itemName = this.getItem(id).ArtistName;
    var user = "user2";
    var mapData;
    var isItemAlreadyOnTheList = false;

    user2_my_artists_list_data.forEach(function(d, i) {
      if (d.ArtistId == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user2_my_artists_list_data.push({
        "ArtistId": this.getItem(id).ArtistId,
        "ArtistName": this.getItem(id).ArtistName
      });

     $.each(user1_my_artists_list_data, function(i) {
        if (user1_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
              user = "common";
              shared_timeline_data[i].user = user;
            }
          });

            $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user =user;
        }
      });
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistImageLink": this.getItem(id).ArtistImageLink,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "ArtistLocation": this.getItem(id).ArtistLocation,
          "ArtistGenres":this.getItem(id).ArtistGenres,
          "ArtistPopularity":this.getItem(id).ArtistPopularity,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });


        shared_pool_data.push({
        	"Name":this.getItem(id).ArtistName,
        	"imageLink":this.getItem(id).ArtistImageLink,
        	"user":user
        });
      }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
     d3.select('.chart').remove();
     sT.init();

          $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });


      $$('user2_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $$("user2_top_ten_genres").attachEvent("onItemClick", function(id) {
    $$('user2_top_ten_artists').unselect();
    $$('user2_related_artist').clearAll();
    $$("user2_related_artist").load(baseURL+'TopArtistsByGenre?genreName=' + this.getItem(id).Name);

  })

  $$("user2_search_artist").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
    var itemName = this.getItem(id).ArtistName;
    var user = "user2";
    var mapData;
    var isItemAlreadyOnTheList = false;

    user2_my_artists_list_data.forEach(function(d, i) {
      if (d.ArtistId == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user2_my_artists_list_data.push({
        "ArtistId": this.getItem(id).ArtistId,
        "ArtistName": this.getItem(id).ArtistName
      });

     $.each(user1_my_artists_list_data, function(i) {
        if (user1_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
              user = "common";
              shared_timeline_data[i].user = user;
            }
          });

            $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
              shared_pool_data[i].user =user;
        }
      });
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistImageLink": this.getItem(id).ArtistImageLink,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "ArtistLocation": this.getItem(id).ArtistLocation,
          "ArtistGenres":this.getItem(id).ArtistGenres,
          "ArtistPopularity":this.getItem(id).ArtistPopularity,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });


        shared_pool_data.push({
          "Name":this.getItem(id).ArtistName,
          "imageLink":this.getItem(id).ArtistImageLink,
          "user":user
        });
      }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
     d3.select('.chart').remove();
     sT.init();

          $$('shared_pool').clearAll();
  $.each(shared_pool_data, function(i) {
      $$('shared_pool').add({
          Name: shared_pool_data[i].Name,
          imageLink: shared_pool_data[i].imageLink,
          user:shared_pool_data[i].user
    })

    });


      $$('user2_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $$("user2_top_ten_genres").attachEvent("onItemClick", function(id) {
    $$('user2_top_ten_artists').unselect();
    $$('user2_related_artist').clearAll();
    $$("user2_related_artist").load(baseURL+'TopArtistsByGenre?genreName=' + this.getItem(id).Name);

  })


  $$("user2_top_ten_genres").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).Name;
    var isItemAlreadyOnTheList = false
    var user="user2";
    user2_my_genres_list_data.forEach(function(d, i) {
      if (d.Name == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user2_my_genres_list_data.push({
        "Name": this.getItem(id).Name,
        "Relevance": this.getItem(id).Relevance
      });

       $.each(user2_my_genres_list_data, function(i) {
        if (user2_my_genres_list_data[i].Name == item) {
            $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == item) {
            	user="common";
            	shared_pool_data[i].user =user;
        }
      });


        }
      });

      if (user!="common") {


        shared_pool_data.push({
        	"Name":this.getItem(id).Name,
        	"imageLink":this.getItem(id).imageLink,
        	"user":user
        });
    }


         $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });




      $$('user2_my_genre_list').add({
        Name: this.getItem(id).Name,
        Relevance: this.getItem(id).Relevance
      })
    }
  })

  $$("user2_related_artist").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
    var itemName = this.getItem(id).ArtistName;
    var user="user2"
    var isItemAlreadyOnTheList = false;
    user2_my_artists_list_data.forEach(function(d, i) {
      if (d.ArtistId == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user2_my_artists_list_data.push({
        "ArtistId": this.getItem(id).ArtistId,
        "ArtistName": this.getItem(id).ArtistName
      });

     $.each(user1_my_artists_list_data, function(i) {
        if (user1_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
              user="common"
              shared_timeline_data[i].user = user;
            }
          });

            $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user =user;
        }
      });
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistImageLink": this.getItem(id).ArtistImageLink,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "ArtistLocation": this.getItem(id).ArtistLocation,
          "ArtistGenres":this.getItem(id).ArtistGenres,
          "ArtistPopularity":this.getItem(id).ArtistPopularity,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });


        shared_pool_data.push({
        	"Name":this.getItem(id).ArtistName,
        	"imageLink":this.getItem(id).ArtistImageLink,
        	"user":user
        });
      }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
      d3.select('.chart').remove();
     sT.init();

          $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})

    });


      $$('user2_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $('#user2_my_artist_clear').click(function() {

  	var isCommon;
  $.each(user2_my_artists_list_data, function(item) {
  	isCommon=false;
  	$.each(user1_my_artists_list_data, function(i) {
        if (user1_my_artists_list_data[i].ArtistId == user2_my_artists_list_data[item].ArtistId) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == user2_my_artists_list_data[item].ArtistId) {
            	isCommon=true;
              shared_timeline_data[i].user = "user1";
            }
          });

               $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == user2_my_artists_list_data[item].ArtistName) {
            	shared_pool_data[i].user ="user1";
        }
      });

        }
      });

  	if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === user2_my_artists_list_data[item].ArtistId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });


      $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === user2_my_artists_list_data[item].ArtistName) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
      d3.select('.chart').remove();
     sT.init();


      $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
	});

  });
    $$('user2_my_artist_list').clearAll();
    user2_my_artists_list_data = [];
  })

  $('#user2_my_genre_clear').click(function() {

     var isCommon;
  $.each(user2_my_genres_list_data, function(item) {
  	isCommon=false;
  	$.each(user1_my_genres_list_data, function(i) {
        if (user1_my_genres_list_data[i].Name == user2_my_genres_list_data[item].Name) {

          $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == user2_my_genres_list_data[item].Name) {
            	isCommon=true;
            	shared_pool_data[i].user ="user1";
        }
      });

        }
      });

  	if(!isCommon){

           $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === user2_my_genres_list_data[item].Name) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }




  });

 $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
				});

 $$('user2_my_genre_list').clearAll();
    user2_my_genre_list_data = [];
  })

  $$("user2_my_artist_list").attachEvent("onItemDblClick", function(id) {

    var selectedId = this.getItem(id).ArtistId;
    var item = this.getItem(id).ArtistId;
  	var itemName = this.getItem(id).ArtistName;
    var isCommon=false;


    $$("user2_my_artist_list").remove($$("user2_my_artist_list").getSelectedId());

    $.each(user2_my_artists_list_data, function(i) {
      if (user2_my_artists_list_data[i].ArtistId === selectedId) {
        user2_my_artists_list_data.splice(i, 1);
        return false;
      }
    });

    $.each(user1_my_artists_list_data, function(i) {
        if (user1_my_artists_list_data[i].ArtistId == item) {
          $.each(shared_timeline_data, function(i) {
            if (shared_timeline_data[i].ArtistId == item) {
            	isCommon=true;
              shared_timeline_data[i].user = "user1";
            }
          });
               $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == itemName) {
            	shared_pool_data[i].user ="user1";
        }
      });

        }
      });

    if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === selectedId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });


      $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === itemName) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }

     fG.updateUserArtists(shared_timeline_data);
     sM.Layer2Reset();
     sM.Layer2Data(shared_timeline_data);
      d3.select('.chart').remove();
     sT.init();

      $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
		});

  })

  $$("user2_my_genre_list").attachEvent("onItemDblClick", function(id) {

    var selectedId = this.getItem(id).Name;
    var isCommon=false;
    $$("user2_my_genre_list").remove($$("user2_my_genre_list").getSelectedId());

    $.each(user2_my_genres_list_data, function(i) {
      if (user2_my_genres_list_data[i].Name === selectedId) {
        user2_my_genres_list_data.splice(i, 1);
        return false;
      }
    });

   $.each(user1_my_genres_list_data, function(i) {
        if (user1_my_genres_list_data[i].Name == selectedId) {
        		isCommon=true;
               $.each(shared_pool_data, function(i) {
            if (shared_pool_data[i].Name == selectedId) {
            	shared_pool_data[i].user ="user1";
        }
      });

        }
      });

	if(!isCommon){
        $.each(shared_pool_data, function(i) {
      if (shared_pool_data[i].Name === selectedId) {
        shared_pool_data.splice(i, 1);
        return false;
      }
    });
    }

        $$('shared_pool').clearAll();
	$.each(shared_pool_data, function(i) {
			$$('shared_pool').add({
        	Name: shared_pool_data[i].Name,
        	imageLink: shared_pool_data[i].imageLink,
        	user:shared_pool_data[i].user
		})
				});
  });


});

function searchQuery(user){
  if(user.user=="user1")
  {
    $$('user1_search_artist').clearAll();
    $$("user1_search_artist").load('http://mkvalluri-001-site1.atempurl.com/api/SearchArtistsByName?artistName=' + $('#user1_search_query').val());

  }

  else if(user.user=="user2")
    {
      $$('user2_search_artist').clearAll();
      $$("user2_search_artist").load('http://mkvalluri-001-site1.atempurl.com/api/SearchArtistsByName?artistName=' + $('#user2_search_query').val());
    }
}
