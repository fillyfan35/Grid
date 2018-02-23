(function( $ ){

	$.fn.bucksSearch = function(options) {

		var requestQueue = [];
		var currentTerm = "";
		var historyAPI = history.pushState ? true : false;

		var settings = {
			"engineKey": "",
			"placement": "body",
			"resultsTemplate": "#searchResultsTemplate",

			"pageResults": 9,
			"programResults": 4,
			"courseResults": 4,
			"directoryResults": 2,
			"fileResults": 2,
			"disableURLUpdates": false,
			"baseSearchUrl": window.location.protocol + "//" + window.location.host + window.location.pathname
		};

		// If options exist, lets merge them with our default settings
		if ( options ) {
			$.extend( settings, options );
		}

		var pushTermToURL = function(term){
			var newurl = settings.baseSearchUrl + "?search=" + encodeURIComponent(term);
			window.history.pushState({path:newurl}, '', newurl);
		};

		var shouldReverseLayout = function(context){
			// return false;

			var numberToBeat = 0;
			var reverse = false;

			for (var i in context.pageResults){
				if (context.pageResults[i]._score > numberToBeat){
					numberToBeat = context.pageResults[i]._score * 1.3;
				}
			}

			for (var i in context.directoryResults){
				if(context.directoryResults[i]._score > numberToBeat){
					return true;
				}
			}

			for (var i in context.courseResults){
				if(context.courseResults[i]._score > numberToBeat){
					return true;
				}
			}

			return reverse;
		};

		var combineCourses = function(credit, coned){

			var combined = credit.concat(coned);
			combined.sort(function(a, b){ return b._score - a._score; });
			return combined;
		};

		var separateData = function(data){

			var pages = [];
			var files = [];
			var courses = [];

			for (var i in data.records.page){
				var fileUrl = data.records.page[i].url.toLowerCase();
				if (fileUrl.match("(pdf|doc|docx)$")){
					var item = data.records.page[i];
					item.short_description = item.body.split(' ').slice(0, 10).join(' ') + "...";
					item.file_name = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
					files.push(item);
				}
				else{
					var item = data.records.page[i];
					item.short_description = item.body.split(' ').slice(0, 20).join(' ') + "...";
					item.url = item.url.replace("r2017.bucks.edu", "www.bucks.edu");
					item.title = item.title.replace(" | Bucks County Community College", "");
					pages.push(item);
				}
			}

			courses = combineCourses(data.records.courses, data.records.coned);

			return {
				"pageResults": pages.slice(0, settings.pageResults),
				"programResults": data.records.pos.slice(0, settings.programResults),
				"courseResults": courses.slice(0, settings.courseResults),
				"directoryResults": data.records.directory.slice(0, settings.directoryResults),
				"fileResults": files.slice(0,settings.fileResults)
			};
		};


		var engineURL = "https://api.swiftype.com/api/v1/public/engines/search.json";
		var requestParams = {
			"engine_key": settings.engineKey,
			"spelling": "retry"
		};

		var templateSource = $(settings.resultsTemplate).html();
		if (!templateSource){
			templateSource = $(templateStr).html();
		}
		var compiledTemplate = Handlebars.compile(templateSource);

		return this.each(function() {
			var originalInput = $(this);
			var placement = $(settings.placement);
			var form = originalInput.parents("form");

			if (historyAPI && !(settings.disableURLUpdates)){
				placement.on("click", ".search-result-link-wrap", function(event){
					pushTermToURL(originalInput.val());
				});
			}


			setInterval(function(){
				var termToMatch = originalInput.val();
				if (termToMatch !== currentTerm){
					originalInput.trigger("bucksSearch.runSearch", [termToMatch]);
				}

			}, 1000);

			form.on("submit", function(event){
				if (historyAPI && !(settings.disableURLUpdates)){
					event.preventDefault();
					var submittedTerm = originalInput.val()
					pushTermToURL(submittedTerm);
				}
			});

			originalInput.on("bucksSearch.displayResults", function(event, data){
				var context = separateData(data);
				var resultsHTML = $(compiledTemplate(context));

				if (shouldReverseLayout(context)){
					context.reverse_layout = true;
					resultsHTML.find(".search-results-top").insertAfter(resultsHTML.find(".search-results-bottom"));
				}

				var bottomContainer = resultsHTML.find(".search-results-bottom");
				bottomContainer.find(".search-results-zone-empty").each(function(){
					$(this).appendTo(bottomContainer);
				});



				placement.html(resultsHTML);
			});

			originalInput.on("bucksSearch.setTerm", function(event, term){
				originalInput.val(term);
				originalInput.trigger("bucksSearch.runSearch", [term]);
			});

			originalInput.on("bucksSearch.runSearch", function(event, term){
				requestParams.q = term;

				$.ajax({
					type: 'GET',
					dataType: 'jsonp',
					url: engineURL,
					data: requestParams
				}).done(function(data){
					originalInput.trigger("bucksSearch.displayResults", [data]);
					currentTerm = term;
				});

			});

			originalInput.on("input", function(){

				var whatsInTheBox = originalInput.val();
				requestQueue.unshift(whatsInTheBox);

				setTimeout(function(){
					if (requestQueue.length > 0){
						originalInput.trigger("bucksSearch.runSearch", [requestQueue[0]]);
						requestQueue = [];
					}
				}, 200);

			});

		});

	};
})( jQuery );

var templateStr = '<script id="searchResultsTemplate" type="text/x-handlebars-template"> <div class="search-results-wrap search-results-wrap-{{#if reverse_layout}}reverse{{else}}normal{{/if}}"> <section class="search-results-top search-results-section"> <div class="search-results-zone search-results-zone-pages"> <h2>Pages</h2>{{#if pageResults}}<ul class="search-results-list">{{#each pageResults}}<li class="search-result-list-item"> <a href="{{url}}" class="search-result-link-wrap"> <h3 class="search-result-heading">{{title}}</h3> <p class="search-result-url">{{url}}</p><p class="search-result-snippet">{{short_description}}</p></a> </li>{{/each}}</ul>{{else}}<p class="search-results-none">No page results</p>{{/if}}</div></section> <section class="search-results-bottom search-results-section"> <div class="search-results-zone search-results-zone-directory{{#unless directoryResults}}search-results-zone-empty{{/unless}}"> <h2>Directory</h2>{{#if directoryResults}}<ul class="search-results-list">{{#each directoryResults}}<li class="search-result-list-item"> <a href="http://ac.bucks.edu/apps/directory/profile/{{external_id}}/" class="search-result-link-wrap"> <h3 class="search-result-heading">{{first_name}} {{last_name}}</h3> <p class="search-result-directory-position">{{position}}</p><p class="search-result-directory-office">{{building}}{{room}}</p><p class="search-result-directory-phone">{{number}}</p><p class="search-result-directory-email">{{email}}</p></a> </li>{{/each}}</ul>{{else}}<p class="search-results-none">No directory results</p>{{/if}}</div><div class="search-results-zone search-results-zone-courses{{#unless courseResults}}search-results-zone-empty{{/unless}}"> <h2>Courses</h2>{{#if courseResults}}<ul class="search-results-list">{{#each courseResults}}<li class="search-result-list-item"> <a href="{{url}}" class="search-result-link-wrap"> <h3 class="search-result-heading">{{#if name}}{{name}}{{else}}{{title}}{{/if}}</h3> <p class="search-result-course-number">{{#if courseNumber }}{{courseNumber}}{{else}}{{topic}}{{number}}{{/if}}</p></a> </li>{{/each}}</ul>{{else}}<p class="search-results-none">No course results</p>{{/if}}</div><div class="search-results-zone search-results-zone-programs{{#unless programResults}}search-results-zone-empty{{/unless}}"> <h2>Programs</h2>{{#if programResults}}<ul class="search-results-list">{{#each programResults}}<li class="search-result-list-item"> <a href="{{url}}" class="search-result-link-wrap"> <h3 class="search-result-heading">{{name}}</h3> <p class="search-result-program-diploma">{{diploma}}{{number}}</p></a> </li>{{/each}}</ul>{{else}}<p class="search-results-none">No program results</p>{{/if}}</div><div class="search-results-zone search-results-zone-files{{#unless fileResults}}search-results-zone-empty{{/unless}}"> <h2>Files</h2>{{#if fileResults}}<ul class="search-results-list">{{#each fileResults}}<li class="search-result-list-item"> <a href="{{url}}" class="search-result-link-wrap"> <h3 class="search-result-heading">{{title}}</h3> <p class="search-result-url">{{file_name}}</p><p class="search-result-snippet">{{short_description}}</p></a> </li>{{/each}}</ul>{{else}}<p class="search-results-none">No file results</p>{{/if}}</div></section> </div></script>';
