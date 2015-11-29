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

var sharedUI = new UI("sharedUI", "yellow");
sharedUI.sharedMap();
sharedUI.sharedGraph();
sharedUI.sharedTimeline();

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
    $$("user1_related_artist").load('http://cs424proj3.azurewebsites.net/api/SimilarArtistsByName?artistName=' + this.getItem(id).ArtistName);

  })

  $$("user1_top_ten_artists").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
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
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });
      }
      $$('user1_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $$("user1_related_artist").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;;
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
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });
      }

      $$('user1_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $$("user1_top_ten_genres").attachEvent("onItemClick", function(id) {
    $$('user1_top_ten_artists').unselect();
    $$('user1_related_artist').clearAll();
    $$("user1_related_artist").load('http://cs424proj3.azurewebsites.net/api/TopArtistsByGenre?genreName=' + this.getItem(id).Name);

  })

  $$("user1_top_ten_genres").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).Name;
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
        }
      });

  	if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === user1_my_artists_list_data[item].ArtistId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });
    }

  });

    
    $$('user1_my_artist_list').clearAll();
    user1_my_artists_list_data = [];
  })

  $('#user1_my_genre_clear').click(function() {
    $$('user1_my_genre_list').clearAll();
    user1_my_genre_list_data = [];
  })

  $$("user1_my_artist_list").attachEvent("onItemDblClick", function(id) {

  	var item = this.getItem(id).ArtistId;
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
        }
      });

    if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === selectedId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });
    }

  })

  $$("user1_my_genre_list").attachEvent("onItemDblClick", function(id) {

    var selectedId = this.getItem(id).Name;
    $$("user1_my_genre_list").remove($$("user1_my_genre_list").getSelectedId());

    $.each(user1_my_genres_list_data, function(i) {
      if (user1_my_genres_list_data[i].ArtistId === selectedId) {
        user1_my_genres_list_data.splice(i, 1);
        return false;
      }
    });

  })

  //User2

  $$("user2_top_ten_artists").attachEvent("onItemClick", function(id) {

    //alert(this.getItem(id).ArtistName);
    $$('user2_top_ten_genres').unselect();
    $$('user2_related_artist').clearAll();
    $$("user2_related_artist").load('http://cs424proj3.azurewebsites.net/api/SimilarArtistsByName?artistName=' + this.getItem(id).ArtistName);

  })

  $$("user2_top_ten_artists").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
    var user = "user2";
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
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });
      }

      $$('user2_my_artist_list').add({
        ArtistId: this.getItem(id).ArtistId,
        ArtistName: this.getItem(id).ArtistName
      })
    }
  })

  $$("user2_top_ten_genres").attachEvent("onItemClick", function(id) {
    $$('user2_top_ten_artists').unselect();
    $$('user2_related_artist').clearAll();
    $$("user2_related_artist").load('http://cs424proj3.azurewebsites.net/api/TopArtistsByGenre?genreName=' + this.getItem(id).Name);

  })

  $$("user2_top_ten_genres").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).Name;
    var isItemAlreadyOnTheList = false
    user2_my_genres_list_data.forEach(function(d, i) {
      if (d.Name == item)
        isItemAlreadyOnTheList = true;
    });

    if (!isItemAlreadyOnTheList) {
      user2_my_genres_list_data.push({
        "Name": this.getItem(id).Name,
        "Relevance": this.getItem(id).Relevance
      });

      $$('user2_my_genre_list').add({
        Name: this.getItem(id).Name,
        Relevance: this.getItem(id).Relevance
      })
    }
  })

  $$("user2_related_artist").attachEvent("onItemDblClick", function(id) {

    var item = this.getItem(id).ArtistId;
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
        }
      });

      if (user!="common") {
        shared_timeline_data.push({
          "ArtistId": this.getItem(id).ArtistId,
          "ArtistName": this.getItem(id).ArtistName,
          "ArtistMainGenre": this.getItem(id).ArtistMainGenre,
          "start": this.getItem(id).ArtistActiveYears[0].Start,
          "end": this.getItem(id).ArtistActiveYears[0].End,
          "user":user
        });
      }

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
        }
      });

  	if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === user2_my_artists_list_data[item].ArtistId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });
    }

  });
    $$('user2_my_artist_list').clearAll();
    user2_my_artists_list_data = [];
  })

  $('#user2_my_genre_clear').click(function() {
    $$('user2_my_genre_list').clearAll();
    user2_genre_list_data = [];
  })

  $$("user2_my_artist_list").attachEvent("onItemDblClick", function(id) {

    var selectedId = this.getItem(id).ArtistId;
    var item = this.getItem(id).ArtistId;
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
        }
      });

    if(!isCommon){
      $.each(shared_timeline_data, function(i) {
      if (shared_timeline_data[i].ArtistId === selectedId) {
        shared_timeline_data.splice(i, 1);
        return false;
      }
    });
    }

  })

  $$("user2_my_genre_list").attachEvent("onItemDblClick", function(id) {

    var selectedId = this.getItem(id).Name;
    $$("user2_my_genre_list").remove($$("user2_my_genre_list").getSelectedId());

    $.each(user2_my_genres_list_data, function(i) {
      if (user2_my_genres_list_data[i].ArtistId === selectedId) {
        user2_my_genres_list_data.splice(i, 1);
        return false;
      }
    });
  });

});