var rhit = rhit || {};
const userUrl = "http://localhost:3000/api/";


rhit.UserController = class {
	constructor(){
		document.querySelector("#Register").onclick = (event) => {
			const InputUser = document.querySelector("#inputUser");
			const InputPassword = document.querySelector("#inputPassword");
			const InputFName = document.querySelector("#inputFName");
			const InputLName = document.querySelector("#inputLName");
			const InputAddress = document.querySelector("#inputAddress");
			const InputPhone = document.querySelector("#inputPhone");
			this.register(InputUser.value,InputPassword.value,InputFName.value,InputLName.value,InputAddress.value,InputPhone.value);
			InputUser.value = "";
			InputPassword.value = "";
			InputFName.value = "";
			InputLName.value = "";
			InputAddress.value = "";
			InputPhone.value = "";

		};
		document.querySelector("#Login").onclick = (event) => {
			const InputUser = document.querySelector("#inputExistUser");
			const InputPassword = document.querySelector("#inputExistPassword");
			this.login(InputUser.value,InputPassword.value);
			InputUser.value = "";
			InputPassword.value = "";

		};

	}
	register(user,pass,fName,lName,address,phone) {
		if (!user) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
				"user": user,
				"pass": pass,
				"fName" : fName,
				"lName" : lName,
				"address" : address,
				"phone" : phone
			};
			let entry = fetch(userUrl+"reg/", {
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
	login(user,pass) {
		if (!user) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
				"user": user,
				"pass": pass,
			};
			let entry = fetch(userUrl+"log/", {
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
	 
};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#mainPage")) {
		new rhit.UserController();

	}
};

rhit.main();
