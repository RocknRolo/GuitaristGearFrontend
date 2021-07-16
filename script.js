// index page

async function makeGuitaristListHTML() {
    const response = await fetch("http://localhost:8080/gg/guitarist");
    if (response.status !== 200) {
        console.warn('HTTP Error: ' + response.status);
        return;
    }
    const jsonData = await response.json();
    let output = ""
    jsonData.forEach(function(guitarist) {
        output += `
             <div class="item">
                 <p id="guitarist_info">
                     <strong>${guitarist.name}</strong><br><br>
                     <u>Place of Birth:</u><br>
                     ${guitarist.birthPlace}<br><br>
                     <u>Birth year:</u><br>
                     ${guitarist.birthYear}<br><br>
                     <u>Genre:</u><br>
                     ${guitarist.genre}
                 </p>
                 <p id="gear_list">
                     <strong>Gear list:</strong><br><br>
        `
        for (let gear in guitarist.gearList) {
            let gearToAdd = guitarist.gearList[gear];
            output += gearToAdd.brand.name + ": " + gearToAdd.name +
                `<br><button onclick="window.location.href='geardetails.html?id=${gearToAdd.id}'">details..</button><br><br>`;
        }
        output += `</p></div>`
    }
);
    document.getElementById('guitaristList').innerHTML=output;
}

// forms page

function addAllDataSelectFields() {
    addDataToDropdown('select_guitarist', 'Add new...', 'http://localhost:8080/gg/guitarist');
    addDataToDropdown('select_delete_guitarist', 'Make a selection...', 'http://localhost:8080/gg/guitarist');

    addDataToDropdown('select_gear', 'Add new...', 'http://localhost:8080/gg/gear');
    addDataToDropdown('select_gear_man', 'Make a selection...', 'http://localhost:8080/gg/manufacturer');
    addDataToDropdown('select_delete_gear', 'Make a selection...', 'http://localhost:8080/gg/gear');

    addDataToDropdown('select_manufacturer', 'Add new...', 'http://localhost:8080/gg/manufacturer');
    addDataToDropdown('select_delete_man', 'Make a selection...', 'http://localhost:8080/gg/manufacturer');

    addDataToDropdown('select_gearlist', 'Make a selection...', 'http://localhost:8080/gg/guitarist');
}

function addDataToDropdown(dropDownId, defaultOptionText, url) {
    let dropdown = document.getElementById(dropDownId);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = defaultOptionText;
    defaultOption.value = "0";

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    fetch(url).then(
            function(response) {
                if (response.status !== 200) {
                    console.warn('Something went wrong.. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function(data) {
                    let option;

                    for (let i = 0; i < data.length; i++) {
                        option = document.createElement('option');
                        option.text = data[i].name;
                        option.value = data[i].id;
                        dropdown.add(option);
                    }
                });
            }
        )
        .catch(function(err) {
            console.error('Fetch Error -', err);
        });
}

function checkEditGearlistSelection() {
    if (document.getElementById('select_gearlist').value !== "0")
    {
        document.getElementById('select_add_gear').disabled = false;
        //document.getElementById('add_gear_to_gearlist').disabled = false;

        document.getElementById('select_delete_gear_from_gearlist').disabled = false;
        //document.getElementById('delete_gear_from_gearlist').disabled = false;

        addDataToDropdown('select_add_gear', 'Make a selection...', 'http://localhost:8080/gg/gear');
        addDataToDropdown('select_delete_gear_from_gearlist', 'Make a selection...',
            'http://localhost:8080/gg/gear/guitarist/' + select_gearlist.value);
    }
    if (document.getElementById('select_gearlist').value === "0")
    {
        document.getElementById('select_add_gear').length = 0;
        document.getElementById('select_add_gear').disabled = true;
        document.getElementById('add_gear_to_gearlist').disabled = true;

        document.getElementById('select_delete_gear_from_gearlist').length = 0;
        document.getElementById('select_delete_gear_from_gearlist').disabled = true;
        document.getElementById('delete_gear_from_gearlist').disabled = true;

    }
}

async function addGearToGearlist(e) {
    //e.preventDefault();
    let selectedGearlistId = document.getElementById('select_gearlist').value;
    let selectedGearId = document.getElementById('select_add_gear').value;
    if (selectedGearId === "0") {
        return;
    }
    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: selectedGearId,
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/gear/guitarist/` + selectedGearlistId, settings);
        return await fetchResponse.json();
    } catch (ex) {
        return ex;
    }
}

async function deleteGearFromGearlist(e) {
    //e.preventDefault();
    let selectedGearId = document.getElementById('select_delete_gear_from_gearlist').value;
    let selectedGearListId = document.getElementById('select_gearlist').value;
    if (selectedGearId === "0") {
        return;
    }
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: selectedGearId,
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/gear/guitarist/` + selectedGearListId, settings);
        return await fetchResponse.json();
    } catch (ex) {
        return ex;
    }
}

function fillGuitaristFields() {
    let selectedGuitaristId = document.getElementById('select_guitarist').value;
    if (selectedGuitaristId !== "0") {
        document.getElementById('addEditGuitarist').value = "Edit";

        fetch("http://localhost:8080/gg/guitarist/" + selectedGuitaristId)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.warn('Something went wrong.. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then(function(data) {
                        document.getElementById('guitaristName').value = data.name;
                        document.getElementById('birthPlace').value = data.birthPlace;
                        document.getElementById('birthYear').value = data.birthYear;
                        document.getElementById('genre').value = data.genre;
                    });
                }
            )
            .catch(function(err) {
                console.error('HTTP Error: ', err);
            });
    } else {
        document.getElementById('guitaristForm').reset();
        document.getElementById('addEditGuitarist').value = "Add";
    }
}

function fillGearFields() {
    let selectedGearId = document.getElementById('select_gear').value;
    if (selectedGearId !== "0") {
        document.getElementById('addEditGear').textContent = "Edit";
        fetch("http://localhost:8080/gg/gear/" + selectedGearId)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.warn('HTTP Error: ' + response.status);
                        return;
                    }
                    response.json().then(function(data) {
                        document.getElementById('select_gear_man').value = data.brand.id;
                        document.getElementById('gearName').value = data.name;
                        document.getElementById('gearType').value = data.type;
                        document.getElementById('weightInGrams').value = data.weightInGrams;
                    });
                }
            )
            .catch(function(err) {
                console.error('Fetch Error -', err);
            });
    } else {
        document.getElementById('gearForm').reset();
        document.getElementById('addEditGear').textContent = "Add";
    }
}

function fillManFields() {
    let selectedGearId = document.getElementById('select_manufacturer').value;
    if (selectedGearId !== "0") {
        document.getElementById('addEditMan').textContent = "Edit";
        fetch("http://localhost:8080/gg/manufacturer/" + selectedGearId)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.warn('HTTP Error: ' + response.status);
                        return;
                    }
                    response.json().then(function(data) {
                        document.getElementById('manName').value = data.name;
                        document.getElementById('mainProductType').value = data.mainProductType;
                        document.getElementById('placeFounded').value = data.placeFounded;
                        document.getElementById('yearFounded').value = data.yearFounded;
                    });
                }
            )
            .catch(function(err) {
                console.error('Fetch Error -', err);
            });
    } else {
        document.getElementById('manufacturerForm').reset();
        document.getElementById('addEditMan').textContent = "Add";
    }
}

function updateButton(dropDownId, buttonId) {
    let dropDown = document.getElementById(dropDownId);
    let button = document.getElementById(buttonId);
    if (dropDown.value !== "0") {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

// guitarist form

function validateGuitaristForm() {
    let guitaristName = document.getElementById('guitaristName');
    let birthPlace = document.getElementById('birthPlace');
    let birthYear = document.getElementById('birthYear');
    let genre = document.getElementById('genre');

    let allOk = true;

    let allTextInputs = document.getElementById('form1').querySelectorAll("input[type='text']");
    for (let i = 0; i < allTextInputs.length; i++) {
        allTextInputs[i].style.borderColor = "";
    }

    if (!onlyHasLettersAndSpaces(guitaristName.value) || guitaristName.value === "") {
        guitaristName.style.borderColor = "red";
        allOk = false;
    }
    if (!onlyHasLettersCommasAndSpaces(birthPlace.value) || birthPlace.value === "") {
        birthPlace.style.borderColor = "red";
        allOk = false;
    }
    if (!onlyHasNumbers(birthYear.value) || birthYear.value <= 0 || birthYear.value === "") {
        birthYear.style.borderColor = "red";
        allOk = false;
    }
    if (!onlyHasLettersAndSpaces(genre.value) || genre.value === "") {
        genre.style.borderColor = "red";
        allOk = false;
    }

    if (allOk) {
        for (let i = 0; i < allTextInputs.length; i++) {
            allTextInputs[i].style.borderColor = "";
        }
    }
    return allOk;
}

function addOrEditGuitarist(e) {
    e.preventDefault();
    if (validateGuitaristForm()) {
        if (document.getElementById('select_guitarist').value === "0") {
            postGuitarist();
        } else {
            putGuitarist();
        }
        window.location.reload(true);
    }
}

async function postGuitarist() {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('guitaristName').value,
            birthPlace: document.getElementById('birthPlace').value,
            birthYear: document.getElementById('birthYear').value,
            genre: document.getElementById('genre').value
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/guitarist`, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

async function putGuitarist() {
    let selectedGuitaristId = document.getElementById('select_guitarist').value;
    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('guitaristName').value,
            birthPlace: document.getElementById('birthPlace').value,
            birthYear: document.getElementById('birthYear').value,
            genre: document.getElementById('genre').value
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/guitarist/` + selectedGuitaristId, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

async function deleteGuitarist(e) {
    //e.preventDefault();
    let selectedGuitaristId = document.getElementById('select_delete_guitarist').value;
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/guitarist/` + selectedGuitaristId, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}


// gear form

function validateGearForm() {
    let gearMan = document.getElementById('select_gear_man')
    let gearName = document.getElementById('gearName');
    let gearType = document.getElementById('gearType');
    let weightInGrams = document.getElementById('weightInGrams');

    let allOk = true;

    let allTextInputs = document.getElementById('form2').querySelectorAll("input[type='text']");
    for (let i = 0; i < allTextInputs.length; i++) {
        allTextInputs[i].style.borderColor = "";
    }
    gearMan.style.borderColor = "";

    if (gearMan.value === "0") {
        gearMan.style.borderColor = "red";
        allOk = false;
    }

    if (!onlyHasLettersNumbersAndSpaces(gearName.value) || gearName.value === "") {
        gearName.style.borderColor = "red";
        allOk = false;
    }

    if (!onlyHasLettersAndSpaces(gearType.value) || gearType.value === "") {
        gearType.style.borderColor = "red";
        allOk = false;
    }

    if (!onlyHasNumbers(weightInGrams.value) || weightInGrams >= 0 || weightInGrams.value === "") {
        weightInGrams.style.borderColor = "red";
        allOk = false;
    }

    if (allOk) {
        for (let i = 0; i < allTextInputs.length; i++) {
            allTextInputs[i].style.borderColor = "";
        }
        gearMan.style.borderColor = "";
    }
    return allOk;
}

function addOrEditGear(e) {
    e.preventDefault();
    if (validateGearForm()) {
        if (document.getElementById('select_gear').value === "0") {
            postGear();
        } else {
            putGear();
        }
        window.location.reload(true);
    }
}

async function postGear() {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            brand: document.getElementById('select_gear_man').value,
            name: document.getElementById('gearName').value,
            type: document.getElementById('gearType').value,
            weightInGrams: document.getElementById('weightInGrams').value
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/gear`, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

async function putGear() {
    let selectedGearId = document.getElementById('select_gear').value;
    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            brand: document.getElementById('select_gear_man').value,
            name: document.getElementById('gearName').value,
            type: document.getElementById('gearType').value,
            weightInGrams: document.getElementById('weightInGrams').value
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/gear/` + selectedGearId, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

async function deleteGear(e) {
    //e.preventDefault();
    let selectedGearId = document.getElementById('select_delete_gear').value;
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/gear/` + selectedGearId, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

// manufacturer form

function validateManufacturerForm() {
    let manName = document.getElementById('manName');
    let mainProductType = document.getElementById('mainProductType');
    let placeFounded = document.getElementById('placeFounded');
    let yearFounded = document.getElementById('yearFounded');

    let allOk = true;

    let allTextInputs = document.getElementById('form3').querySelectorAll("input[type='text']");
    for (let i = 0; i < allTextInputs.length; i++) {
        allTextInputs[i].style.borderColor = "";
    }

    if (!onlyHasLettersAndSpaces(manName.value) || manName.value === "") {
        manName.style.borderColor = "red";
        allOk = false;
    }
    if (!onlyHasLettersAndSpaces(mainProductType.value) || mainProductType.value === "") {
        mainProductType.style.borderColor = "red";
        allOk = false;
    }
    if (!onlyHasLettersCommasAndSpaces(placeFounded.value) || placeFounded.value === "") {
        placeFounded.style.borderColor = "red";
        allOk = false;
    }
    if (!onlyHasNumbers(yearFounded.value) || yearFounded.value >= 0 || yearFounded.value === "") {
        yearFounded.style.borderColor = "red";
        allOk = false;
    }

    if (allOk) {
        for (let i = 0; i < allTextInputs.length; i++) {
            allTextInputs[i].style.borderColor = "";
        }
    }
    return allOk;
}

function addOrEditMan(e) {
    e.preventDefault();
    if (validateManufacturerForm()) {
        if (document.getElementById('select_manufacturer').value === "0") {
            postMan();
        } else {
            putMan();
        }
        window.location.reload(true);
    }
}

async function postMan() {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('manName').value,
            mainProductType: document.getElementById('mainProductType').value,
            placeFounded: document.getElementById('placeFounded').value,
            yearFounded: document.getElementById('yearFounded').value
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/manufacturer`, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

async function putMan() {
    let selectedManId = document.getElementById('select_manufacturer').value;
    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('manName').value,
            mainProductType: document.getElementById('mainProductType').value,
            placeFounded: document.getElementById('placeFounded').value,
            yearFounded: document.getElementById('yearFounded').value
        })
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/manufacturer/` + selectedManId, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

async function deleteMan(e) {
    //e.preventDefault();
    let selectedManId = document.getElementById('select_delete_man').value;
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    try {
        const fetchResponse = await fetch(`http://localhost:8080/gg/manufacturer/` + selectedManId, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (ex) {
        return ex;
    }
}

// Hulpmethoden voor validatie
function onlyHasLettersAndSpaces(toCheck) {
    return /^[a-zA-Z\s]*$/.test(toCheck);
}

function onlyHasLettersNumbersAndSpaces(toCheck) {
    return /^[a-zA-Z0-9\s]*$/.test(toCheck);
}

function onlyHasLettersCommasAndSpaces(toCheck) {
    return /^[a-zA-Z\s,]*$/.test(toCheck);
}

function onlyHasNumbers(toCheck) {
    return /^[0-9]*$/.test(toCheck);
}

// gear details page
async function makeGearDetailsHTML() {

    const response = await fetch("http://localhost:8080/gg/gear/" + getUrlVars().id);
    if (!response.ok) {
        throw new Error('HTTP error! Status: $(response.status)');
    }
    const data = await response.json();

    document.getElementById('gearDetails').innerHTML = `
        <h2>Gear</h2><br>
        ${data.brand.name}: ${data.name}<br><br>
        Type: ${data.type}<br>
        Weight: ${data.weightInGrams} grams`;
    document.getElementById('manDetails').innerHTML = `
        <h2>Manufacturer</h2><br>
        Name: ${data.brand.name}<br><br>
        Main product type: ${data.brand.mainProductType}<br>
        Founded in ${data.brand.placeFounded} in the year ${data.brand.yearFounded}.`;
}

function getUrlVars() {
    var vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

async function populateGearList() {
    const response = await fetch("http://localhost:8080/gg/gear");
    if (response.status !== 200) {
        console.warn('HTTP error: ' +
            response.status);
        return;
    }
    const jsonData = await response.json();
    let output = "<p>";
    jsonData.forEach(function(gear) {
        output += `
            <div class="gearListing" id="${gear.id}">
                ${gear.brand.name}: ${gear.name}<br>
                <button class="show_gear_details" onclick="window.location.href='geardetails.html?id=${gear.id}'">
                details..</button></div><br>`
    });
    output += `</p>`;
    document.getElementById('gear_list').innerHTML = output;
}

