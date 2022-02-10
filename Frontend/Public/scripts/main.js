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
				.then(Response => Response.json())
				.then(Response =>{
					const isEmpty = Object.keys(Response).length === 0;
					console.log(Response);
					if (!isEmpty) {
					window.location.href= `/account.html?user=${user}`;
					}
					else{
						document.querySelector("#RegisterLabel").innerHTML = "Registration Failed: Please try again"
					}
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
						else{
							document.querySelector("#loginLabel").innerHTML = "Invalid Login, try again";
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
		 let entry = fetch(userUrl + "user/" + username)
		 .then(response => response.json())
		 .then(data => {
			 document.querySelector("#username").innerHTML = user;
			 document.querySelector("#Name").innerHTML = data.FName +" "+  data.LName;
			 document.querySelector("#Address").innerHTML = data.Address;
			 document.querySelector("#Phone").innerHTML = data.Phone;
		 });
      }

};

rhit.PetController = class {
	constructor(user){
		const newList = htmlToElement('<div id = "petListContainer"></div>');
		newList.append(this.createPetCard());
				// // Make a new quoteListContainer
				// const newList = htmlToElement('<div id = "restaurantListContainer"></div>');
				// for (let i = 0; i < rhit.fbRestaurantsManager.length; i++){
				// 	const restaurant = rhit.fbRestaurantsManager.getRestaurantAtIndex(i);
		
				// 	rhit.fbSingleRestaurantManager = new rhit.fbSingleRestaurantManager(restaurant.id, restaurant.name, restaurant.author);
				// 	for(let x = 0; x < rhit.FbSingleRestaurantManager.length; x++){	
				// 	const review = rhit.fbSingleRestaurantManager.getReviewAtIndex(x);
				// 	if (review.author == this.rhit.FbAuthManager.uid){
				// 		const newCard = this._createRestaurantCard(review);
				// 		newCard.onclick = (event) => {
				// 			// window.location.href = `/reviews.html?name=${restaurant.name}&author=${restaurant.author}&id=${restaurant.id}`;
				// 		};
				// 		newList.appendChild(newCard);
				// 		}
				// 	}
					
					
					
				// }
		
				//Remove the old quoteListContainer
				const oldList = document.querySelector("#petListContainer");
				oldList.removeAttribute("id");
				oldList.hidden = true;
				//Put in the new quoteListContauner
				oldList.parentElement.appendChild(newList);
	}
	createPetCard(){
		return htmlToElement(      
		`<div class="card petcards" style="width: 25rem;">
        <div class="card-body">
          <div class="form-group">
            <label for="pName">Pet Name</label>
            <input type="text" class="form-control" id="pName" placeholder="Pet Name">
          </div>
          <div class="form-group">
            <label for="DOB">Birthday</label>
            <input type="text" class="form-control" id="DOB" placeholder="Birthday">
          </div>
          <div class="form-group">
            <label for="breed">Breed</label>
            <input type="text" class="form-control" id="breed" placeholder="Breed">
          </div>
          <div class="form-group">
            <label for="gender">Gender</label>
            <input type="text" class="form-control" id="gender" placeholder="Gender">
          </div>
          <div class="form-group">
            <label for="species">Species</label>
            <input type="text" class="form-control" id="species" placeholder="Species">
          </div>
          <div class="form-group">
            <label for="vet">Vet</label>
            <input type="text" class="form-control" id="vet" placeholder="Vet">
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
