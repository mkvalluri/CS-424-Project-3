function ArtistArt(name, containerId) {
	this.artistName = name;
	this.user1_Selected = false;
	this.user2_Selected = false;
	this.containerId = containerId;
};

ArtistArt.prototype = {
	constructor: ArtistArt(),
	
	setArt : function()
	{
		var returnArt = "<div class='artistArt'><p>" + this.artistName.substr(0, 2) + "</p></div>";	
		$(this.containerId).append(returnArt);
	}
}