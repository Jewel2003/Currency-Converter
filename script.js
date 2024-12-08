dropdowns = document.querySelectorAll(".dropdown select");
messageDetail = document.querySelector(".msg");
clickButton = document.querySelector("#btn");
BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";
fromURL = document.querySelector(".from select");
toURL = document.querySelector(".to select");
reverseButton = document.querySelector("#reverseCurrency");

// Populate dropdowns with currency options
for (const select of dropdowns) {
    for (let currencyCode in countryList) {
        let newElement = document.createElement("option");
        newElement.innerText = currencyCode; // Set the visible text of the option
        newElement.value = currencyCode; // Set the value of the option
        if (select.name === "from" && currencyCode === "USD") {
            newElement.selected = "selected"; // Set USD as default from currency
        } else if (select.name === "to" && currencyCode === "INR") {
            newElement.selected = "selected"; // Set INR as default to currency
        }
        select.append(newElement); // Append the new option to the select element
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target); // Update flag when currency is changed
    });
}

// Event listener to reverse the currencies
reverseButton.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let fromValue = fromURL.value;
    let toValue = toURL.value;
    fromURL.value = toValue; // Swap from and to values
    toURL.value = fromValue;
    updateFlag(fromURL); // Update flag after swap
    updateFlag(toURL);
});

// Function to update the flag for the selected currency
const updateFlag = (evt) => {
    let currencyCode = evt.value; // Get the selected currency code
    let countryCode = countryList[currencyCode]; // Get the country code from the list
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // URL for the flag image
    let img = evt.parentElement.querySelector("img"); // Select the img element of the parent
    img.src = newSrc; // Update the img source with the new flag
};

// Event listener for the conversion button
clickButton.addEventListener("click", async (evt) => {
    evt.preventDefault();
    await fetchDataRespone(); // Call the function to fetch data and display conversion
});

// Function to fetch data and calculate the conversion rate
const fetchDataRespone = async () => {
    messageDetail.innerHTML = `<div class="loader"></div>`; // Show loader while fetching data
    let amt = document.querySelector(".amount input");
    let amtVul = amt.value;

    if (amtVul === "" || amtVul < 1) { // Validate input amount
        amtVul = 1;
        amt.value = "1";
    }

    const API1_URL = `${BASE_URL}${fromURL.value.toLowerCase()}/${toURL.value.toLowerCase()}.json`; // URL for currency API endpoint
    const API_URL = `https://open.er-api.com/v6/latest/${fromURL.value}`; // Alternative API URL for exchange rates

    // Define a function to fetch data from an API
    async function fetchData(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                return await response.json(); // Parse and return the JSON response
            } else {
                console.error(`API call to ${apiUrl} failed with status code ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching data from ${apiUrl}: ${error.message}`);
            return null;
        }
    }

    // Fetch data from both APIs sequentially using async/await
    const apiData = await fetchData(API_URL);

    if (apiData) {
        // Call your fetchdata method for API2
        console.log("API call was successful. Calling fetchdata method...");
        await fetchDataMethod(apiData, toURL.value, amtVul);
    }
};

// Function to process and display the conversion result
const fetchDataMethod = async (response, value, amtVul) => {
    let responseData = response.rates; // Extract conversion rates from API response
    if (responseData.hasOwnProperty(value)) {
        const result = responseData[value];
        let finalResult = Math.round(result * amtVul); // Calculate the conversion amount
        console.log(finalResult);
        messageDetail.innerText = `${amtVul} ${fromURL.value} = ${finalResult} ${toURL.value}`; // Display the result
    }
};

// Event listener to load the conversion data on page load
window.addEventListener("load", () => {
    fetchDataRespone(); // Fetch and display conversion rates on page load
});
