var rhit = rhit || {};
const userUrl = "http://localhost:3000/api/";

rhit.UserController = class {
	constructor(){
		document.querySelector("#Register").onclick = (event) => {
			const createWordInput = document.querySelector("#inputUser");
			this.register(createWordInput.value);
			createWordInput.value = "";
		};

	}
	register(user) {
		if (!user) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
			let data = {
				"user": user,
			};
			let entry = fetch(userUrl+"add/", {
					method: "POST",
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(data)
				})
				.catch((err) => {
					console.log(err);
				});
		

	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#mainPage")) {
		new rhit.UserController();
	}
};

rhit.main();
