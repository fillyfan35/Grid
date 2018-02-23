
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

(function( $ ) {

	$.fn.bucksSearch = function(options) {

		var currentTerm = "";

		var settings = {
			engine: "",
			authToken: "",
			engineKey: ""
		};

		var requestQueue = [];

		var createCasedWord = function(suggestion, val){
			return val + suggestion.substring(val.length);
		};

		var decideSuggestion = function(data, whatsInTheBox){
			if (data.record_count < 1){
				return "";
			}

			whatsInTheBox = whatsInTheBox.toLowerCase();

			var potentialItem = "";
			var topScore = 0;

			var highlights = [];

			for (var i in data.records){
				for (var j in data.records[i]){
					var item = data.records[i][j];

					highlights.push(item.highlight[Object.keys(item.highlight)[0]]);
				}
			}

			terms = [];

			for (var i in highlights){
				var asdf = $("<p>" + highlights[i] + "</p>");
				var ems = asdf.find("em");
				var termStr = "";

				ems.each(function(){
					termStr = termStr + $(this).text() + " ";
				});

				termStr = termStr.substring(0, termStr.length - 1);

				terms.push(termStr.toLowerCase());
			}

			terms = terms.filter(onlyUnique);

			var potentialTerm = "";

			for (var i in terms){
				if (terms[i].indexOf(whatsInTheBox) === 0){
					if (potentialTerm === "" || terms[i].length < potentialTerm){
						potentialTerm = terms[i];
					}
				}
			}

			return potentialTerm;
		};

		if ( options ) { $.extend( settings, options ); }

		var url = "https://api.swiftype.com/api/v1/public/engines/search.json";

		params = {"spelling": "retry"};

		return this.each(function(){
			var originalInput = $(this);
			var input = originalInput.clone();

			input.insertAfter($(this));
			input.css({
				"position": "absolute",
				"background-color": "transparent",
				"background-image": "none",
				"top": 0,
				"left": 0
			});

			originalInput.attr("placeholder", "").attr("name", "");
			originalInput.css({"color": "#aaa"});

			input.on("keydown", function(event){
				if (event.which == 9){
					if (input.val() !== ""){
						event.preventDefault();
					}

					if (originalInput.val() !== "" && input.val() !== "" && originalInput.val().toLowerCase() !== input.val().toLowerCase()){
						input.val(originalInput.val());
						input.trigger("input");
					}
				}
			});

			input.on("input", function(event){
				var typingInto = $(this);
				var val = typingInto.val();

				if (val === "" || originalInput.val().indexOf(val) !== 0){
					originalInput.val("");
				}

				requestQueue.push(val);

				console.log(requestQueue);

    			params['engine_key'] = settings.engineKey;

    			setTimeout(function(){

    				params['q'] = requestQueue[requestQueue.length - 1];

    				if (requestQueue.length > 0){
    					$.ajax({
						type: 'GET',
						dataType: 'jsonp',
						url: url,
						data: params
						}).done(function(data){
							suggestion = decideSuggestion(data, val);
							val = typingInto.val();

							if (val !== "" && suggestion && suggestion.indexOf(val.toLowerCase()) === 0){
								originalInput.val(createCasedWord(suggestion, val));
							}
							else{
								originalInput.val("");
							}
						});

						requestQueue = [];
    				}
				}, 250);
			});
		});
	};

}( jQuery ));

