console.log("minimod online");

Hooks.once("ready", (app, html, data) => { //ensures this runs last after Simple Calendar is fully loaded

	Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
		//console.log(data);
		if (data.date.hour == 5 && data.diff >= 3600 || (data.diff >= 86400)) { //runs if at least one hour advances forward into 5am, or if a full day is skipped
			console.log("weather table triggered");
			game.tables.getName("Weather Table").draw();
		}
	});
});
