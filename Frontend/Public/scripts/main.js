var rhit = rhit || {};
const userUrl = "http://localhost:3000/api/";
let username = "";

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
			username = InputUser.value;
			InputUser.value = "";
			InputPassword.value = "";
			InputFName.value = "";
			InputLName.value = "";
			InputAddress.value = "";
			InputPhone.value = "";
			document.querySelector("#loginbutton").innerHTML = "Account";			
			document.querySelector("#loginbutton").removeAttribute("data-target");
			

		};
		document.querySelector("#Login").onclick = (event) => {
			const InputUser = document.querySelector("#inputExistUser");
			const InputPassword = document.querySelector("#inputExistPassword");
			this.login(InputUser.value,InputPassword.value);
			InputUser.value = "";
			InputPassword.value = "";
		};

		document.querySelector("#loginbutton").onclick = (event) => {
			if(document.querySelector("#loginbutton").innerHTML=="Account")
			window.location.href= `/account.html?user=${username}`;
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
				.then( Response => Response.json() )
				.then (Response => {
					console.log("got response");
					console.log(Response);
					const isEmpty = Object.keys(Response).length === 0;
					if (!isEmpty) {
						if (Response.pwordhash === Response.hash) {
							window.location.href= `/account.html?user=${user}`;
						}
					}
					else{
						document.querySelector("#loginLabel").innerHTML = "Invalid Login, try again";
					}
				})
				.catch((err) => {
					console.log(err);
				});
	}
	 
};
rhit.AccountController = class {
    constructor(user){
		 username = user;
		 console.log("User: " + username);
      }
};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#mainPage")) {
		new rhit.UserController();
	}
	if (document.querySelector("#accountPage")) {
		console.log("On the account page");
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const user = urlParams.get("user");
		new rhit.AccountController(user);
	}
};

rhit.main();
