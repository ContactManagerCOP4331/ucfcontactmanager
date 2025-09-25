const urlBase = 'http://ucfcontactmanager.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let ids = [];

function doLogin()
{
  userId = 0;
  firstName = "";
  lastName = "";
  
  const login = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value;
  localStorage.setItem("loginName", login);
  
  const hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  const jsonPayload = JSON.stringify({ login: login, password: hash });

  const url = urlBase + '/Login.' + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        const jsonObject = JSON.parse(xhr.responseText || "{}");
        userId = jsonObject.id || 0;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName || "";
        lastName  = jsonObject.lastName  || "";

        // persist for other pages
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginName", jsonObject.login || localStorage.getItem("loginName") || "");
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);

        saveCookie();
        window.location.href = "contact.html";
      } else {
        document.getElementById("loginResult").innerHTML = "Login failed.";
      }
    }
  };
  xhr.send(jsonPayload);
}

function doSignup() {
    firstName = document.getElementById("first-name").value;   // not "firstName"
    lastName  = document.getElementById("last-name").value;    // not "lastName"
    let username = document.getElementById("signup-username").value; // not "username"
    let password = document.getElementById("signup-password").value; // not "password"

    if (!validSignUpForm(firstName, lastName, username, password)) {
        document.getElementById("signupResult").innerHTML = "Invalid signup";
        return;
    }

    let hash = md5(password);  // your md5.js must be loaded in <script> before this runs

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SignUp.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200 || this.status === 201) {
                let jsonObject = JSON.parse(xhr.responseText || "{}");
                userId = jsonObject.id || 0;
                firstName = jsonObject.firstName || "";
                lastName = jsonObject.lastName || "";

                // persist for other pages
                localStorage.setItem("userId", userId);
                localStorage.setItem("firstName", firstName);
                localStorage.setItem("lastName", lastName);

                saveCookie();
                document.getElementById("signupResult").innerHTML = "User added";
                window.location.href = "contact.html";
                return;
            } else {
                document.getElementById("signupResult").innerHTML = "Signup failed.";
            }
        }

        document.getElementById("signupResult").innerHTML = "Signup failed.";
    };

    xhr.send(jsonPayload);
}

function validLoginForm(logName, logPass) {

    var logNameErr = logPassErr = true;

    if (logName == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if (regex.test(logName) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            logNameErr = false;
        }
    }

    if (logPass == "") {
        console.log("PASSWORD IS BLANK");
        logPassErr = true;
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(logPass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            logPassErr = false;
        }
    }

    if ((logNameErr || logPassErr) == true) {
        return false;
    }
    return true;

}

function validSignUpForm(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function presentTable() {
    var section = document.getElementById("addContactsSection");
    var contacts = document.getElementById("contacts");
    if (!section || !contacts) return;

    if (section.style.display === "none" || section.style.display === "") {
        section.style.display = "block";
        contacts.style.display = "none";
    } else {
        section.style.display = "none";
        contacts.style.display = "table";
    }
}

function addContact() {
    let firstName = document.getElementById("contactTextFirst").value;
    let lastName = document.getElementById("contactTextLast").value;
    let phoneNumber = document.getElementById("contactTextNumber").value;
    let emailAddress = document.getElementById("contactTextEmail").value;

    if (!validContact(firstName, lastName, phoneNumber, emailAddress)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }
    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        userId: userId
    };


    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                // Clear input fields in form 
                document.getElementById("addContact").reset();
                // reload contacts table and switch view to show
                loadContacts();
                showTable();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let rows = "";
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID;
                    rows += "<tr id='row" + i + "'>";
                    rows += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    rows += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    rows += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    rows += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    rows += "<td class='contact-btns'>" +
                        "<button type='button' id='edit_button" + i + "' class='edit-btn w3-button w3-circle w3-lime' onclick='editRow(" + i + ")'>" + "Edit" + "</button>" +
                        "<button type='button' id='save_button" + i + "' value='Save' class='save-btn w3-button w3-circle w3-lime' onclick='saveRow(" + i + ")' style='display: none'>" + "Save" + "</button>" +
                        "<button type='button' onclick='deleteRow(" + i + ")' class=' delete-btn w3-button w3-circle w3-amber'>" + "Delete" + "</button>" + "</td>";
                    rows += "</tr>";
                }
                document.getElementById("tbody").innerHTML = rows;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function showTable() {
    var section = document.getElementById("addContactsSection");
    var contacts = document.getElementById("contacts");
    if (section) section.style.display = "none";    // hide the whole section (not the form)
    if (contacts) contacts.style.display = "table";
}

function editRow(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
}

function saveRow(no) {
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no]

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "none";

    let tmp = {
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteRow(no) {
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: nameOne,
            lastName: nameTwo,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

function searchContacts() {
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");// Table Row
    const tbody = document.getElementById("tbody");

    if (!tbody) return;

    if(!selections){
        tbody
        return;
    }

    tbody.style.display = "table-row-group";

    for (let i = 0; i < tr.length; i++) {
        const td_fn = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const td_ln = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (td_fn && td_ln) {
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_fn.toUpperCase().startsWith(selection)) {
                    tr[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().startsWith(selection)) {
                    tr[i].style.display = "";
                }
            }
        }
    }
}

function validContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;

    }

    return true;

}




