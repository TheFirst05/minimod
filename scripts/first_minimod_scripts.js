console.log("minimod online");

Hooks.on("setup", () => {
	const WFRP4E = game.wfrp4e.config

	WFRP4E.difficultyModifiers["a bit average"] = 10 ; 

	// WFRP4E.difficultyLabels["a bit average"] = "A Bit Average (+10)" ;
	WFRP4E.difficultyLabels = {

		"veasy": "Very Easy (+60)",
		"easy": "Easy (+40)",
		"average": "Average (+20)",
		"a bit average": "A Bit Average (+10)",
		"challenging": "Challenging (+0)",
		"difficult": "Difficult (-10)",
		"hard": "Hard (-20)",
		"vhard": "Very Hard (-30)"
	}

	console.log("set up")
  });

Hooks.once("ready", (app, html, data) => { //ensures this runs last after Simple Calendar is fully loaded

	Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
		//console.log(data);
		if (data.date.hour == 5 && data.diff >= 3600 || (data.diff >= 86400)) { //runs if at least one hour advances forward into 5am, or if a full day is skipped
			console.log("weather table triggered");
			game.tables.getName("Weather Table").draw();
		}
	});
});

