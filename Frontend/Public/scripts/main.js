
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
		this.getUser(username);
		document.querySelector("#Edit").onclick = (event) =>{
			const EditFName = document.querySelector("#inputAccountFName");
			const EditLName = document.querySelector("#inputAccountLName");
			const EditAddress = document.querySelector("#inputAccountAddress");
			const EditPhone = document.querySelector("#inputAccountPhone");
			this.editUser(EditFName.value,EditLName.value,EditAddress.value,EditPhone.value);
		};
		document.querySelector("#Delete").onclick = (event) =>{
			this.delete(username);
			window.location.href = `/index.html`;
		};
        document.querySelector("#Password").onclick = (event) =>{
			const OldPass = document.querySelector("#inputAccountOldPass");
			const NewPass = document.querySelector("#inputAccountNewPass");
			this.checkPass(username,OldPass.value,NewPass.value);
			OldPass.value = "";
			NewPass.value = "";
		}
		document.querySelector("#clickpets").onclick = (event) => {
			window.location.href = `/petinfo.html?user=${user}`;
		};
	}
	getUser(username){
		let entry = fetch(userUrl + "user/" + username)
			.then(response => response.json())
			.then(data => {
				document.querySelector("#username").innerHTML = "Account: " + username;
				document.querySelector("#Name").innerHTML = "Name: " + data.FName + " " + data.LName;
				document.querySelector("#Address").innerHTML ="Address: " + data.Address;
				document.querySelector("#Phone").innerHTML = "Phone: " + data.Phone;
				document.querySelector("#inputAccountFName").value = data.FName;
				document.querySelector("#inputAccountLName").value = data.LName;
				document.querySelector("#inputAccountAddress").value = data.Address;
				document.querySelector("#inputAccountPhone").value = data.Phone;
			})
			.catch((err) => {
				console.log(err);
			});
	}
    editUser(newFName,newLName,newAddress,newPhoneNum){
		let d = {
			"fName": newFName,
			"lName": newLName,
			"address": newAddress,
			"phone" : newPhoneNum
		};
		fetch(userUrl+ "editUser/" + username, {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify(d)
		})
		.then(response => response.json())
		.then(data =>{
           this.getUser(data.user);
		})
		.catch(err => {
			console.log(err);
		});
	}
	delete(username){
		fetch(userUrl + "deleteUser/" + username, {
            method: "DELETE"
        })
        .catch(err => {
            console.log(err);
        });  
	};
	checkPass(username,oldPass,newPass){
        if (!username) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"user": username,
			"pass": oldPass,
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
						this.changePass(username,newPass);
					} else {
						document.querySelector("#Passlabel").innerHTML = "Invalid Password, try again";
					}
				} else {
					document.querySelector("#Passlabel").innerHTML = "Invalid Password, try again";
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	changePass(username,password){
		let d = {
			"password":password
		};
		fetch(userUrl+ "editPassword/" + username, {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify(d)
		})
		.then(response => response.json())
		.then(data =>{
            console.log(data.user);
			alert("password changed");
		})
		.catch(err => {
			console.log(err);
		});

	}
};

rhit.PetController = class {
	constructor(user) {
		username = user;
		    this.getPet(username);
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
	getPet(user){
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
					const newCard = this.createPetCard(Response[x].Name, Response[x].Age, Response[x].breed, Response[x].gender, Response[x].Species);
					newList.append(newCard);
							newCard.onclick = (event) => {
								window.location.href = `/petdetails.html?user=${user}&pet=${Response[x].Name}`;
							};
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
				this.getPet(username);
			})
			.catch((err) => {
				console.log(err);

			});


	}
	createPetCard(name, dob, breed, gender, species) {
		return htmlToElement(
			`<div class="card petcards" style="width: 25rem;">
        <div class="card-body">
          <div class="form-group">
            <label for="pName">Pet Name</label>
            <h6>${name}</h6>
          </div>
          <div class="form-group">
            <label for="DOB">Age</label>
            <h6>${dob}</h6>
          </div>
          <div class="form-group">
            <label for="breed">Breed</label>
            <h6>${breed}</h6>
          </div>
          <div class="form-group">
            <label for="gender">Gender</label>
            <h6>${gender}</h6>
          </div>
          <div class="form-group">
            <label for="species">Species</label>
            <h6>${species}</h6>
          </div>
        </div>
      </div>
		*/`);
	}
};

rhit.PetDetailsController = class {
	constructor(user, pet) {
		username = user;
		const newList = htmlToElement('<div id = "petListContainer"></div>');
		let data = {
			"user": user,
		};
		let entry = fetch(userUrl + "getpet/", {
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
					if (Response[x].Name === pet) {
						document.querySelector("#pName").value = Response[x].Name;
						document.querySelector("#DOB").value = (Response[x].DOB).substring(0,10);
						document.querySelector("#breed").value = Response[x].breed;
						document.querySelector("#gender").value = Response[x].gender;
						document.querySelector("#species").value = Response[x].Species;
					}
				}
			})
			.catch((err) => {
				console.log(err);
			});
			document.querySelector("#account").onclick = (event) => {
				window.location.href = `/account.html?user=${user}`;
			};
			document.querySelector("#updatepet").onclick = (event) => {
				const InputName = document.querySelector("#pName");
				const InputDOB = document.querySelector("#DOB");
				const InputBreed = document.querySelector("#breed");
				const InputGender = document.querySelector("#gender");
				const InputSpecies = document.querySelector("#species");
				console.log(InputName.value);
				this.updatePet(InputName.value, InputSpecies.value, InputGender.value, InputBreed.value, InputDOB.value, user);
				window.location.href = `/petinfo.html?user=${user}`;
	
			};
			document.querySelector("#delete").onclick = (event) => {
				const InputName = document.querySelector("#pName");
				this.deletePet(InputName.value, user);
				window.location.href = `/petinfo.html?user=${user}`;
			};
			document.querySelector("#clickpets").onclick = (event) => {
				window.location.href = `/petinfo.html?user=${user}`;
			};
			document.querySelector("#showNeeds").onclick = (event) => {
				document.querySelector("#showNeeds").hidden = true;
				const InputName = document.querySelector("#pName");
				this.getNeeds(InputName.value, user);
			};
			document.querySelector("#showExercise").onclick = (event) => {
				document.querySelector("#showExercise").hidden = true;
				const InputName = document.querySelector("#pName");
				this.getExercise(InputName.value, user);
			};
	}
	updatePet(petName, type, sex, breed, dob, ownerusername) {
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
		let entry = fetch(userUrl + "editpet/", {
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
	deletePet(petName, ownerusername) {
		if (!petName) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"petName": petName,
			"ownerusername": ownerusername
		};
		let entry = fetch(userUrl + "deletepet/", {
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
	getNeeds(petName, ownerusername) {
		if (!petName) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"petName": petName,
			"ownerusername": ownerusername
		};
		const newList = htmlToElement('<div id = "petneedsContainer"></div>');
		let entry = fetch(userUrl + "getNeeds/", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(Response => Response.json())
			.then(Response => {
				console.log(Response);
				let foods = `<div id = "petfoodcard" class="card petcards" style="width: 25rem;">
							<div class="card-body"> <h6 class="card-title text-center">Foods</h6>`;
				for (let x = 0; x < Response.length; x++) {
					foods = foods + `<h6>Food: ${Response[x].Food}`;
					if (Response[x].Price) {
						foods = foods + `, Price: $${Response[x].Price} </h6>`;
					}
					else{
						foods = foods + `</h6>`;
					}
				}
				foods = foods + `</div></div>`;
				newList.append(htmlToElement(foods));
				//Remove the old quoteListContainer
				const oldList = document.querySelector("#petneedsContainer");
				oldList.removeAttribute("id");
				oldList.hidden = true;
				//Put in the new quoteListContauner
				oldList.parentElement.appendChild(newList);
			})
			.catch((err) => {
				console.log(err);

			});
	}
	getExercise(petName, ownerusername) {
		if (!petName) {
			console.log("No user provided.  Ignoring request.");
			return;
		}
		let data = {
			"petName": petName,
			"ownerusername": ownerusername
		};
		const newList = htmlToElement('<div id = "petexerciseContainer"></div>');
		let entry = fetch(userUrl + "getexercise/", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(Response => Response.json())
			.then(Response => {
				console.log(Response);
				let exercise = `<div id = "petexercisecard" class="card petcards" style="width: 25rem;">
							<div class="card-body"> <h6 class="card-title text-center">Exercise</h6>`;
				for (let x = 0; x < Response.length; x++) {
					exercise = exercise + `<h6>Exercise: ${Response[x].Type}`;
					if (Response[x].Description) {
						exercise = exercise + `, ${Response[x].Description}`;
					}
					exercise = exercise + `, Frequency: ${Response[x].Frequency}</h6>`;
					
				}
				exercise = exercise + `</div></div>`;
				newList.append(htmlToElement(exercise));
				//Remove the old quoteListContainer
				const oldList = document.querySelector("#petexerciseContainer");
				oldList.removeAttribute("id");
				oldList.hidden = true;
				//Put in the new quoteListContauner
				oldList.parentElement.appendChild(newList);
			})
			.catch((err) => {
				console.log(err);

			});
	}
	createFoodSection(food, price) {
		return htmlToElement(
			`<div id = "petfoodcard" class="card petcards" style="width: 25rem;">
			<div class="card-body">
				<h6>Food: ${food}, Price: ${price} </h6>
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
	if (document.querySelector("#petdetails")) {
		console.log("On the pet details page");
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const user = urlParams.get("user");
		const pet = urlParams.get("pet");
		new rhit.PetDetailsController(user, pet);
	}
};

rhit.main();