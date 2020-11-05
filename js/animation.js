function fadeOut(el) {
	let opacity = 1;
	let timer = setInterval(function() {
		if(opacity <= 0.1) {
			clearInterval(timer);
			el.style.display = "none";
		}
		el.style.opacity = opacity;
		opacity -= opacity * 0.1;
	}, 10);
}

function fadeIn(el) {
	let opacity = 0.01;
	el.style.opacity = opacity;
	el.style.display = "block";
	let timer = setInterval(function() {
		if(opacity >= 0.5) {
			clearInterval(timer);
		}
		el.style.opacity = opacity;
		opacity += opacity * 0.1;
	}, 10);
}