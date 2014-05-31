(function($) {
	function landingInit() {
		var landing = $('#landing');
		var winHeight = $(window).height();
		var landingHeight = winHeight;
		landing.css({
			height: landingHeight + "px"
		});
	};

	$(window).resize(landingInit);
	$(document).ready(landingInit);
})(jQuery);