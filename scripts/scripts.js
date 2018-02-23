$(document).on('click','.moreButton',function(){
	var type = $(this).parent().find("h2").text().toLowerCase();
	$(".main-results").css("display", "none");

	if( $("body").attr("class").split(" ")[0].substring(0,2) == "IE" )
	{
		$("."+type+"-results-continued").css("display", "block");
	}
	else
	{
		$("."+type+"-results-continued").css("display", "flex");	
	}
	

	$('html, body').animate({
	scrollTop: $("#bigBlue").offset().top
	}, 0);
});

$(document).on('click','.less-clicked',function(){
	var type = $(this).parent().next().find("h2").text().toLowerCase();

	if( $("body").attr("class").split(" ")[0].substring(0,2) == "IE" )
	{
		$(".main-results").css("display", "block");	
		$(".search-results-bottom").css("display", "flex");	
	}
	else
	{
		$(".main-results").css("display", "flex");
	}

	$("."+type+"-results-continued").css("display", "none");

});

$(document).ready(function () {
	var currentUrl = $("#subNav #bread").find("a").last().attr("href");
	var sibNav = $(".leftNav").find('li a[href="' + currentUrl + '"]');
	if (sibNav.length > 0) {
		sibNav.attr("class", "cur");
		$("#subNav #bread").addClass("bread-sibsNav");
	}

	var standaloneSearch = $("#st-search-input");

	if (standaloneSearch.length > 0) {
		standaloneSearch.bucksSearch({
			engineKey: "ADX92ndL8eoyzB7bsHiY",
			placement: "#st-results-container",
			pageResults: 9,
			programResults: 4,
			courseResults: 4,
			directoryResults: 2,
			fileResults: 2
		});

		var urlParam = getUrlParameter("search");

		if (urlParam && urlParam !== "") {
			standaloneSearch.trigger("bucksSearch.setTerm", [urlParam]);
		}
	}

	$('<div class="search-results-container" id="onPageSearchResults"></div>').appendTo("#rightNavigation");
	$("#top-search-input").bucksSearch({
		engineKey: "ADX92ndL8eoyzB7bsHiY",
		placement: "#onPageSearchResults",
		pageResults: 9,
		programResults: 4,
		courseResults: 4,
		directoryResults: 2,
		fileResults: 2,
		disableURLUpdates: true
	});

	$('<div class="search-results-container" id="homepageSearchResults"></div>').appendTo("#homeSearch");
	$("#homePageSearch input[name=search]").bucksSearch({
		engineKey: "ADX92ndL8eoyzB7bsHiY",
		placement: "#homepageSearchResults",
		pageResults: 9,
		programResults: 4,
		courseResults: 4,
		directoryResults: 2,
		fileResults: 2,
		disableURLUpdates: true
	});



	$(document).on("keydown", function (event) {

		if ($(".active-searching").length > 0) {

			var form = $(".active-searching").find("form");
			var searchbar = form.find("input").first();

			var items = $(".active-searching .search-results-container").find(":tabbable");
			var currentFocus = items.filter(":focus");

			if (event.keyCode === 40) { // DOWN

				event.preventDefault();

				if (currentFocus.length > 0) {

					var currentIndex = items.index(currentFocus);

					if (currentIndex === items.length - 1) {
						searchbar.focus().select();
					} else {
						items[currentIndex + 1].focus();
					}
				} else {
					$(".search-result-link-wrap").first().focus();
				}
			} else if (event.keyCode === 38) { // UP
				event.preventDefault();

				if (currentFocus.length > 0) {

					var currentIndex = items.index(currentFocus);

					if (currentIndex === 0) {
						searchbar.focus().select();
					} else {
						items[currentIndex - 1].focus();
					}
				} else {
					$(".search-result-link-wrap").last().focus();
				}
			} else if (event.keyCode === 27) { // ESC
				event.preventDefault(); // prevents [type=search] from clearing box

				$("footer").trigger("click");
				$("#top-search input[type=search]").focus();
			}
		}
	});




	$(function () { // have search button at top have submit button that works

		var searchForm = $("#top-search");
		var textBox = searchForm.find("input[type=search]");

		searchForm.on("submit", function (event) {
			if (!(textBox.hasClass("show")) || textBox.val().trim() === "") {

				event.preventDefault();

				if (textBox.hasClass("show")) {
					textBox.focus().select();
				} else {
					textBox.trigger("click");
				}
			}
		});

		textBox.on("click", function () {
			var input = $(this);

			$('#topSearch input[type=search]').addClass('show');
			$('#topSearch input[type=submit]').addClass('show').removeClass('hidden');
			$("#homeSearch").removeClass("homesearch-about-to").removeClass("active-searching");
			if (input.val().trim() !== "") {
				input.select();
				$("#rightNavigation").addClass("active-searching");
			}
		}).on("input", function () {
			var input = $(this);

			if (input.val().trim() !== "") {
				$("#rightNavigation").addClass("active-searching");
			} else {
				$("#rightNavigation").removeClass("active-searching");
			}
		});


		$('#rightNav, #rightNavigation ul li:first-of-type, #rightNavigation ul li:nth-of-type(2), #rightNavigation ul li:nth-of-type(3), .logo, main, footer').click(function (event) {

			var targ = $(event.target);
			var parentalUnit = targ.parents(".active-searching, .homesearch-about-to");

			if (targ.is(":focusable") && parentalUnit.length > 0) {
				$(".active-searching, .homesearch-about-to").each(function () {
					var it = $(this);
					if (!(it.is(parentalUnit))) {
						it.removeClass("active-searching").removeClass("homesearch-about-to");
					}
				});
			} else {
				$(".active-searching").removeClass("active-searching");
				$(".homesearch-about-to").removeClass("homesearch-about-to");
			}

			$('#topSearch input[type=search]').removeClass('show');
			$('#topSearch input[type=submit]').removeClass('show').addClass('hidden');
		});

	});

	/*  remove widget button if empty */
	$('p.callToAction a[href=""]').remove(); // checks and removes empty a tag on widget buttons
	$('p.callToAction:empty').remove(); // removes that entire empty button

	// remove empty image from widget
	$('img[src=""]').remove(); // checks and removes empty img tag on widget buttons
	$('#widgetPhoto:empty').remove(); // removes that entire empty div

	// remove empty headerGroups
	$('.navIcon:empty').remove();
	$('.navTitle:empty').remove();
	$('.navHeader:empty').remove();
	$('.navList:empty').remove();


	$('.instructorProfile .photo img[src=""]').remove();
	$('.instructorProfile .photo:empty').remove();

	// blue boxes if title p is empty, remove it so cardiac line disappears
	$('.blueBox > p:empty').remove();


	// remove built in height/width attributes
	$("#homeBoxes img, img").each(function () {
		var ele = $(this);
		ele.removeAttr("height").css("height", "");
		ele.removeAttr("width").css("width", "");
	});


	// academic calendars
	$(function () {
		var i = 0;

		$('#calendarCheckList').append('<p>Filter by Term</p>');
		$('.calendarList').each(function () {
			i++;
			var calendarID = 'calendar' + i;
			$(this).attr('id', calendarID);
			var displayID = $(this).attr('id', calendarID);
			$(this).val(i);

			// create the checkbox
			var dataTitle = $(displayID).attr('data-calendarterm');
			var cbNum = 'calendar' + i + '-check';
			var addCB = '<div><label><input type="checkbox" id=' + cbNum + ' checked> ' + dataTitle + '</label></div>';
			$('#calendarCheckList').append(addCB);

			// show/hide calendars
			$('#' + cbNum).change(function () {
				var self = this;
				$('#' + calendarID).toggle(self.checked);
			}).change();
		});
	});


	// mobile navigation
	$('.rightSideNav:first-of-type').prepend('<a class="hamburger"><i class="arrow fa fa-angle-down"></i> <span>Sub Menu</span></a>');


	$('header').addClass('desk'); // needed to get mobile open/close to work
	$('header .hamburger').click(function () {
		$('body').addClass('open');

		$('header').addClass('mobile').addClass('close');
		$('header').removeClass('desk');
	});

	// close menu on click/touch
	$('#pageBody').on({
		'touchstart': function () {
			$('header.close').addClass('desk').addClass('second');
			$('header.close').removeClass('mobile').removeClass('open');
		}
	});
	$('#pageBody').click(function () {
		$('header.close').addClass('desk').addClass('second');
		$('header.close').removeClass('mobile').removeClass('open');
	});

	if (navigator.userAgent.match(/(iPad)/)) {
		$('#rightNavigation, #rightNav, .rightSideNav, body').addClass('ipad');
	}
	if (navigator.userAgent.match(/(iPhone)/)) {
		$('#rightNavigation, #rightNav, .rightSideNav, body').addClass('ipad');
	}
	$('.rightSideNav .hamburger').click(function () {
		$('.rightSideNav nav').slideToggle('500').toggleClass('show');
		$('.hamburger i').toggleClass('rotate');
	});

	//replace Home 2017 with Bucks County Community College
	$('#bread a:first-child').text('Bucks County Community College');
	if ($('body').hasClass('basic-nav')) {
		$('.breadcrumbs.bucks a:first-child').text('Bucks County Community College');
		$('.breadcrumbs.placement').remove();
	} else {
		$('.breadcrumbs.bucks a:first-child').text('Bucks County Community College');
		$('.breadcrumbs.bucks').remove();
	}
	// delete if breadcrumbs only says Bucks County Community College
	if ( $('.breadcrumbs.bucks').text() === 'Bucks County Community College' ) {
		$('.breadcrumbs.bucks').remove();
	}

	// add class for IE11 fixes
	if ( $('h2').hasClass('placementPage') || $('div').hasClass('admissions') || $('div').hasClass('online') ||  $('div').hasClass('registerCourses') ||  $('div').hasClass('arts') ||  $('div').hasClass('fancy') ||  $('p').hasClass('guest') ) {
		$('body.blueHeader #bodyCopy').addClass('resize');
	}
	if ( $('div').hasClass('contactcampus') ) {
		$('#bodyCopy').addClass('resize');
	}
	if ( $('div').hasClass('transferringBar') ) {
		$('#bodyCopy').addClass('resize').addClass('admissionChart');
	}
	// animation for height breaks in IE11
	$('.IE11 .admissionChart svg rect:nth-of-type(1)').attr('height', '250');
	$('.IE11 .admissionChart svg rect:nth-of-type(2)').attr('height', '125');
	$('.IE11 .admissionChart svg rect:nth-of-type(3)').attr('height', '100');
	$('.IE11 .admissionChart svg rect:nth-of-type(4)').attr('height', '75');
	$('.IE11 .admissionChart svg rect:nth-of-type(5)').attr('height', '35');

	$(function () {
		// hide course information if it is blank
		// hide course code if it's N/A
		$('.coursenum:contains("N/A")').remove();

		// hide instructor if it is blank
		$('.tuition').filter(function () {
			return $(this).text() === 'Tuition: ';
		}).remove();
		$('.instructor').filter(function () {
			return $(this).text() === 'Instructor: ';
		}).remove();

		// remove empty 'Where & When' parts
		$('.wherewhen').each(function () {
			if ($(this).text().trim() === 'Where & When:') {
				$(this).closest('.wherewhen').remove();
			}
		});
	});


	var nav = $("nav:first");
	nav.accessibleMegaMenu({
		/* prefix for generated unique id attributes, which are required
		   to indicate aria-owns, aria-controls and aria-labelledby */
		// uuidPrefix: "accessible-megamenu",

		/* css class used to define the megamenu styling */
		// menuClass: "nav-menu",

		/* css class for a top-level navigation item in the megamenu */
		// topNavItemClass: "nav-item",

		/* css class for a megamenu panel */
		// panelClass: "sub-nav",

		/* css class for a group of items within a megamenu panel */
		// panelGroupClass: "sub-nav-group",

		/* css class for the focus state */
		// focusClass: "focus",

		/* css class for the open state */
		// openClass: "open"
		//
	}).on("accessibilemegamenu:open", function (event, listItem) {
		listItem.find('section').addClass('sideOpen');
		listItem.find('a').addClass('openArrow'); // add arrow to the <a>

		var sectionHeight = listItem.find('section').height();
		$('body.mobileSize #pageBody').css('position', 'relative').css('top', sectionHeight);

		listItem.removeClass('blueInactive');
		listItem.addClass('blueActive');

		$('header').addClass('iPadOpen');
		$('header.close').addClass('open');
		$('header.close').removeClass('close');
	}).on("accessibilemegamenu:close", function (event, listItem) {

		listItem.find('section').removeClass('sideOpen');
		listItem.find('a').removeClass('openArrow');

		$('body.mobileSize #pageBody').css('position', 'relative').css('top', '0');

		listItem.addClass('blueInactive');
		listItem.removeClass('blueActive');

		$('header.open').addClass('close');
		$('header').removeClass('iPadOpen');
		$('header.open').removeClass('open');
	});

	// this helps with the overlay/pushing content down when the navigation opens
	var sw = document.body.clientWidth;
	if (sw > 666) {
		$('.rightSideNav nav[style]').removeAttr('style');
	}
	if (sw < 831) {
		$('body').addClass('mobileSize');
		$('body').removeClass('fullSize');
		$('body.mobileSize #rightNavigation ul li:nth-of-type(2) a').text('Calendar');
	}
	if (sw > 830) {
		$('body').addClass('fullSize');
		$('body').removeClass('mobileSize');
		$('body #pageBody').css('position', 'relative').css('top', '0');
	}


	$(window).resize(function () {
		// this helps with the overlay/pushing content down when the navigation opens
		var sw = document.body.clientWidth;
		if (sw > 666) {
			$('.rightSideNav nav[style]').removeAttr('style');
		}
		if (sw < 831) {
			$('body').addClass('mobileSize');
			$('body').removeClass('fullSize');
			$('body.mobileSize #rightNavigation ul li:nth-of-type(2) a').text('Calendar');

			$('footer section nav p').removeClass('rotate');
			$('footer section nav ul').removeClass('open').addClass('hide');

			// fix ipad flipping, position the body below the megamenu
			if ( $('#leftNav #students-nav').hasClass('blueActive') ) {
				$('body.mobileSize header.iPadOpen').next().css('position', 'relative').css('top', '545px');
			}
			if ( $('#leftNav #community-nav').hasClass('blueActive') ) {
				$('body.mobileSize #pageBody').css('position', 'relative').css('top', '439px');
			}
			if ( $('#leftNav #career-nav').hasClass('blueActive') ) {
				$('body.mobileSize #pageBody').css('position', 'relative').css('top', '490px');
			}

		}
		if (sw > 830) {
			$('body').addClass('fullSize');
			$('body').removeClass('mobileSize');
			$('body #pageBody').css('position', 'relative').css('top', '0');
			$('body.fullSize #rightNavigation ul li:nth-of-type(2) a').text('Calendar + News');

			$('.rightSideNav nav').css('display', 'flex');

			$('body.mobileSize #pageBody').css('position', 'relative').css('top', '0');
		}
		$('footer ul').removeAttr('style');
		$('footer p').removeClass('rotate');
	});

	// add year for footer
	var currentYear = new Date().getFullYear();
	$('#year').html(currentYear);


	// mobile show footer
	$('footer section nav p').click(function(event){
		$(this).next().toggleClass('open').removeClass('hide');
		var item = event.target;
		$(item).toggleClass('rotate');
  });


	//   remove these items from appearing
	$('table[style], span[style], p[style], a[style], tr[style], th[style], td[style], h1[style], h2[style], h3[style], h4[style], h5[style], ul[style], ol[style], #bodyCopy div[style]').removeAttr('style');
	$('[align]').not('#calendarResults p').removeAttr('align');
	$('[valign]').removeAttr('valign');
	$('td[bgcolor]').removeAttr('bgcolor');
	$('table').removeAttr('border').removeAttr('width').removeAttr('cellpadding').removeAttr('cellspacing');
	$('table').attr('border', '0').attr('cellpadding', '0').attr('cellspacing', '0');
	//$('td').removeAttr('class').removeAttr('height').removeAttr('width');
	$('td').removeAttr('height').removeAttr('width');


	//remove &nbsp; with space
	$('p, h1, h2, h3, h4, h5, ul, ol, td, th, a').each(function(){
		$(this).html($(this).html().replace(/&nbsp;/g,' '));
	});

	// calendar when there is active event, add class to parent
	$('#calendar table td a.hasEvents').parent().addClass('grey');

	// if subnav is empty remove it
	if ( $('.leftNav li').length === 0 ) {
		$('nav#subNav').remove();
		$('.rightSideNav .hamburger').remove();
	}

	// add class to 4 boxes on calendar landing page
	var h1 = $('h1').html();
	if ( h1 === 'Calendar + News' ) {
		$('aside').addClass('calendarPage');
	}


	/*$(function () {
		// back to top
		$(window).scroll(function () {
			var scroll = $(window).scrollTop();
			if (scroll >= 2000) {
				$('#up').fadeIn(500);
			} else {
				$('#up').fadeOut(500);
			}
		});
	});*/


	// from homepage.js
	if ($('body').hasClass('home')) {
		var where = $('<div id="message"></div>').insertBefore('header');
		where.wrap('<div id="emergency" />');
		where.bucksAlert({
			'alertLocation': '/globalparts/codebits/alertcrawl/',
			'activeClassLocation': '#emergency'
		});
	}

});

var getUrlParameter = function (name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function bucksIsTouch() {
	return $("html").hasClass("touch");
}


(function ($) {
	$.fn.deepest = function (selector) {
		var deepestLevel = 0,
			$deepestChild,
			$deepestChildSet;

		this.each(function () {
			$parent = $(this);
			$parent
				.find((selector || '*'))
				.each(function () {
					if (!this.firstChild || this.firstChild.nodeType !== 1) {
						var levelsToParent = $(this).parentsUntil($parent).length;
						if (levelsToParent > deepestLevel) {
							deepestLevel = levelsToParent;
							$deepestChild = $(this);
						} else if (levelsToParent === deepestLevel) {
							$deepestChild = !$deepestChild ? $(this) : $deepestChild.add(this);
						}
					}
				});
			$deepestChildSet = !$deepestChildSet ? $deepestChild : $deepestChildSet.add($deepestChild);
		});

		return this.pushStack($deepestChildSet || [], 'deepest', selector || '');
	};
}(jQuery));


$(function () {
	$(".youtube").each(function () {
		var wrap = $(this);
		var iframe = wrap.find("iframe");

		if (iframe.length < 1) {
			iframe = wrap.find("object");
		}

		var w = iframe.attr("width");
		var h = iframe.attr("height");
		var ratio = 100 * (h / w);
		wrap.css({
			"paddingTop": ratio + "%"
		});

		var prev = wrap.prev();
		if (prev.is("h2")) {
			prev.addClass("youtube-h2");
		}
	});
});


// Get IE or Edge browser version
var version = detectIE();

if (version === false) {
	//document.getElementById('result').innerHTML = '<s>IE/Edge</s>';
} else if (version >= 12) {
	//document.getElementById('result').innerHTML = 'Edge ' + version;
	$('body').addClass('Edge' + version);
} else {
	//document.getElementById('result').innerHTML = 'IE ' + version;
	$('body').addClass('IE' + version);
}
function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}



/* Homepage search behaviors */
$(function () {
	if ($("body").hasClass("home")){
		var searchForm = $("#homePageSearch");
		var textBox = searchForm.find("input[name=search]");

		textBox.on("input", function () {
			var input = $(this);

			if (input.val().trim() !== "") {
				$("#homeSearch").addClass("active-searching");
			} else {
				$("#homeSearch").removeClass("active-searching");
			}
		}).on("focus", function () {
			if (textBox.val().trim() !== "") {
				$("#homeSearch").addClass("active-searching");
			}
			$("#homeSearch").addClass("homesearch-about-to");
		});

		if (!(bucksIsTouch())){
			textBox.focus();
			textBox.attr('tabindex', '1');
		}


	}

});
