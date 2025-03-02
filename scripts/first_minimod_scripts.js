console.log("minimod online");

Hooks.on("init", () => {
	game.settings.register("first-minimod", "Temperature", {
		name: "Current Temperature",
		hint: "Decide what temperature it is today. The bigger the number, the worse it gets (colder)",
		scope: "world",
		config: true,
		type: Number,
		default: 5,
		range: {
			min: 1,
			step: 1,
			max: 16
		},
	});
	game.settings.register("first-minimod", "Precipitation", {
		name: "Current Precipitation",
		hint: "Decide if it's raining today. The bigger the number, the worse it gets (more rain)",
		scope: "world",
		config: true,
		type: Number,
		default: 5,
		range: {
			min: 1,
			step: 1,
			max: 16
		},
	});

});

Hooks.on("setup", () => {
	const WFRP4E = game.wfrp4e.config

	WFRP4E.difficultyModifiers["a bit average"] = 10;

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
			if (game.user.isGM) { //otherwise it runs the script for each user logged in
				console.log("weather table triggered");

				let oldTemp = game.settings.get("first-minimod", "Temperature");
				let oldWeather = game.settings.get("first-minimod", "Precipitation");
				let newTemp, changeTemp, newWeather, changeWeather;



				async function callback() {
					//temperature
					let roll1 = await new Roll("1d8").evaluate();
					let roll2 = await new Roll("1d8").evaluate();

					let upTemp = roll1._total;
					let downTemp = roll2._total;

					if (upTemp > downTemp) {
						changeTemp = downTemp;
					} else {
						changeTemp = -upTemp;
					}

					newTemp = oldTemp + changeTemp;
					if (newTemp < 1) { newTemp = 3 };
					if (newTemp > 16) { newTemp = 13 };


					//weather
					let roll3 = await new Roll("1d8").evaluate();
					let roll4 = await new Roll("1d8").evaluate();

					let upWeather = roll3._total;
					let downWeather = roll4._total;

					if (upWeather > downWeather) {
						changeWeather = downWeather;
					} else {
						changeWeather = -upWeather;
					}

					newWeather = oldWeather + changeWeather;
					if (newWeather < 1) { newWeather = 3 };
					if (newWeather > 16) { newWeather = 13 };

					//get results
					const tempTemperature = game.tables.getName("Temperature").getResultsForRoll(newTemp);
					let text1 = tempTemperature[0].text;
					const tempWeather = game.tables.getName("Precipitation").getResultsForRoll(newWeather);
					let text2 = tempWeather[0].text;


					//chat card
					let content = '';
					content += `<table style="font-size: var(--font-size-14)">`;
					content += `<tr></td><b>Weather table</b></td></tr>`;
					content += `<tr><td>${text1}</td></tr>`;
					content += `<tr><td>${text2}</td></tr>`;
					//content += `<tr><td>${texts[3]}</td></tr>`;
					//content += `<tr><td>${texts[4]}</td></tr>`;
					content += `</table>`;

					await ChatMessage.create({
						speaker: {},
						content
					})

					//set new weather of the day
					game.settings.set("first-minimod", "Temperature", newTemp);
					game.settings.set("first-minimod", "Precipitation", newWeather);
				}
				callback();
			}
		}
	});
});
