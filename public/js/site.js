(function($) {
	function landingInit() {
		var landing = $('#landing');
		var winHeight = $(window).height();
		var contentHeight = $(".landing-content").height();
		var landingHeight = Math.max(winHeight, contentHeight)*.80;
		landing.css({
			height: landingHeight + "px"
		});
	};

	$(window).resize(landingInit);
	$(document).ready(landingInit);
	$(".button-collapse").sideNav();
})(jQuery);