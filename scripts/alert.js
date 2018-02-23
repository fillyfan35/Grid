(function( $ ){

	$.fn.bucksAlert = function( options ) {
		var settings = {
			"alertLocation": "alert.php",
			activeClassLocation: "#alert"
		};
		return this.each(function(){
			if (options){
				$.extend(settings,options);
			}

			var where = $(this);

			$.get(settings.alertLocation, function(data){
				
				if (typeof data == "string"){
					data = $.parseJSON(data);
				}
				
				if (data.title.indexOf("NO ALERT") == -1 && data.description.length > 0){

					var reg = /(bucks\.edu\/[^\s\.]+)/ig;
					var matches = data.description.match(reg);

					for (var i in matches){
						data.description = data.description.replace(matches[i], "<a href='http://www." + matches[i] + "'>" + matches[i] + "</a>");
					}

					where.html('<p class="messageTitle">' + data.title + '</p><p>' + data.description + '</p>');

					$(activeClassLocation).addClass("on");

				}
			});

		});
	};

})( jQuery );