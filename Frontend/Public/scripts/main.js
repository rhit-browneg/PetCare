
var rhit = rhit || {};
const userUrl = "http://localhost:3000/api/";
let username = "";

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.UserController = class {
	constructor() {
		document.querySelector("#Register").onclick = (event) => {
			const InputUser = document.querySelector("#inputUser");
			const InputPassword = document.querySelector("#inputPassword");
			const InputFName = document.querySelector("#inputFName");
			const InputLName = document.querySelector("#inputLName");
			const InputAddress = document.querySelector("#inputAddress");
			const InputPhone = document.querySelector("#inputPhone");
			this.register(InputUser.value, InputPassword.value, InputFName.value, InputLName.value, InputAddress.value, InputPhone.value);
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
			this.login(InputUser.value, InputPassword.value);
			InputUser.value = "";
			InputPassword.value = "";
		};

		document.querySelector("#loginbutton").onclick = (event) => {
			if (document.querySelector("#loginbutton").innerHTML == "Account")
				window.location.href = `/account.html?user=${username}`;
		};

	}
	register(user, pass, fName, lName, address, phone) {
		if (!user) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"user": user,
			"pass": pass,
			"fName": fName,
			"lName": lName,
			"address": address,
			"phone": phone
		};
		let entry = fetch(userUrl + "reg/", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(Response => Response.json())
			.then(Response => {
				const isEmpty = Object.keys(Response).length === 0;
				console.log(Response);
				if (!isEmpty) {
					window.location.href = `/account.html?user=${user}`;
				} else {
					document.querySelector("#RegisterLabel").innerHTML = "Registration Failed: Please try again"
				}
			})
			.catch((err) => {
				console.log(err);

			});


	}
	login(user, pass) {
		if (!user) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"user": user,
			"pass": pass,
		};
		let entry = fetch(userUrl + "log/", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(Response => Response.json())
			.then(Response => {
				console.log("got response");
				console.log(Response);
				const isEmpty = Object.keys(Response).length === 0;
				if (!isEmpty) {
					if (Response.pwordhash === Response.hash) {
						window.location.href = `/account.html?user=${user}`;
					} else {
						document.querySelector("#loginLabel").innerHTML = "Invalid Login, try again";
					}
				} else {
					document.querySelector("#loginLabel").innerHTML = "Invalid Login, try again";
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

};
rhit.AccountController = class {
	constructor(user) {
		username = user;
		console.log("User: " + username);
		let entry = fetch(userUrl + "user/" + username)
			.then(response => response.json())
			.then(data => {
				document.querySelector("#username").innerHTML = user;
				document.querySelector("#Name").innerHTML = data.FName + " " + data.LName;
				document.querySelector("#Address").innerHTML = data.Address;
				document.querySelector("#Phone").innerHTML = data.Phone;
			});
		document.querySelector("#clickpets").onclick = (event) => {
			window.location.href = `/petinfo.html?user=${user}`;
		};
	}

};

rhit.PetController = class {
	constructor(user) {
		username = user;
		const newList = htmlToElement('<div id = "petListContainer"></div>');
		let data = {
			"user": user,
		};
		let entry = fetch(userUrl + "getpets/", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(Response => Response.json())
			.then(Response => {
				console.log("got response");
				console.log(Response);
				for (let x = 0; x < Response.length; x++) {
					const newCard = this.createPetCard(Response[x].Name, Response[x].Age, Response[x].breed, Response[x].gender, Response[x].Species, "vet");
					newList.append(newCard);
					// 		newCard.onclick = (event) => {
					// 			// window.location.href = `/reviews.html?name=${restaurant.name}&author=${restaurant.author}&id=${restaurant.id}`;
					// 		};
				}
				//Remove the old quoteListContainer
				const oldList = document.querySelector("#petListContainer");
				oldList.removeAttribute("id");
				oldList.hidden = true;
				//Put in the new quoteListContauner
				oldList.parentElement.appendChild(newList);
			})
			.catch((err) => {
				console.log(err);
			});
			document.querySelector("#account").onclick = (event) => {
				window.location.href = `/account.html?user=${user}`;
			};
			document.querySelector("#Add").onclick = (event) => {
				const InputName = document.querySelector("#pName");
				const InputDOB = document.querySelector("#DOB");
				const InputBreed = document.querySelector("#breed");
				const InputGender = document.querySelector("#gender");
				const InputSpecies = document.querySelector("#species");
				console.log(InputName.value);
				this.addPet(InputName.value, InputSpecies.value, InputGender.value, InputBreed.value, InputDOB.value, user);
				InputName.value = "";
				InputDOB.value = "";
				InputBreed.value = "";
				InputGender.value = "";
				InputSpecies.value = "";
	
			};
	}
	addPet(petName, type, sex, breed, dob, ownerusername) {
		if (!petName) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"petName": petName,
			"type": type,
			"sex": sex,
			"breed": breed,
			"dob": dob,
			"ownerusername": ownerusername
		};
		let entry = fetch(userUrl + "addpet/", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(Response => Response.json())
			.then(Response => {
				console.log(Response);
			})
			.catch((err) => {
				console.log(err);

			});


	}
	createPetCard(name, dob, breed, gender, species, vet) {
		return htmlToElement(
			`<div class="card petcards" style="width: 25rem;">
        <div class="card-body">
          <div class="form-group">
            <label for="pName">Pet Name</label>
            <input type="text" class="form-control" placeholder=${name}>
          </div>
          <div class="form-group">
            <label for="DOB">Age</label>
            <input type="text" class="form-control" placeholder=${dob}>
          </div>
          <div class="form-group">
            <label for="breed">Breed</label>
            <input type="text" class="form-control" placeholder=${breed}>
          </div>
          <div class="form-group">
            <label for="gender">Gender</label>
            <input type="text" class="form-control" placeholder=${gender}>
          </div>
          <div class="form-group">
            <label for="species">Species</label>
            <input type="text" class="form-control" placeholder=${species}>
          </div>
        </div>
      </div>
		*/`);
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
	if (document.querySelector("#petPage")) {
		console.log("On the pet page");
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const user = urlParams.get("user");
		new rhit.PetController(user);
	}
};

rhit.main();