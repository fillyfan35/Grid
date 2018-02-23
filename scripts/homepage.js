/**
 * Stuff that only needs to happen on the home page
 */
$(function(){
	if ($('body').hasClass('home')){
		var where = $('<div id="message"></div>').insertBefore('header');
		where.wrap('<div id="emergency" />');
		where.bucksAlert({'alertLocation': '/globalparts/codebits/alertcrawl/', 'activeClassLocation': '#emergency'});
	}



});
