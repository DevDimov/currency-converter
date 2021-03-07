const API_KEY = "YOUR KEY";

const CURRENCIES = ["AUD", "CHF", "EUR", "GBP"];
var USDtoAny = {};

document.body.onload = runOnLoad();

function runOnLoad() {
    for (i = 0; i < CURRENCIES.length; i++) {
        var url = "https://www.quandl.com/api/v3/datasets/CUR/" + CURRENCIES[i] + "?start_date=2016-12-31&end_date=2016-12-31&api_key=" + API_KEY;
        fetch(url)
            .then(response => response.json())
            .then(data => getExchangeRates(data));
    }
}

function getExchangeRates(data) {
    var currency = data.dataset.dataset_code;
    var rate = data.dataset.data[0][1];
    USDtoAny[currency] = rate;
    console.log(USDtoAny);
}

var fromOptions = document.getElementById("from-currency");
var toOptions = document.getElementById("to-currency");
var lastDisabledOption = toOptions.options.namedItem("GBP");

fromOptions.addEventListener("change", updateToOptions);
toOptions.addEventListener("change", updateFromOptions);

function updateToOptions() {
    if (lastDisabledOption != null) {
        lastDisabledOption.disabled = false;
    }
    var selected = fromOptions.value;
    toOptions.options.namedItem(selected).disabled = true;
    lastDisabledOption = toOptions.options.namedItem(selected);
    if (fromOptions.value == toOptions.value) {
        var index = toOptions.selectedIndex;
        if (index + 1 < toOptions.length) {
            toOptions.item(index + 1).selected = true;
        }
        else {
            toOptions.item(0).selected = true;
        }
    }
    calculate();
}

function updateFromOptions() {
    if (lastDisabledOption != null) {
        lastDisabledOption.disabled = false;
    }
    var selected = toOptions.value;
    fromOptions.options.namedItem(selected).disabled = true;
    lastDisabledOption = fromOptions.options.namedItem(selected);
    if (toOptions.value == fromOptions.value) {
        var index = fromOptions.selectedIndex;
        if (index + 1 < fromOptions.length) {
            fromOptions.item(index + 1).selected = true;
        }
        else {
            fromOptions.item(0).selected = true;
        }
    }
    calculate();
}

var inputField = document.getElementById("input");
inputField.addEventListener("input", calculate);

function calculate() {
    var fromCurrency = fromOptions.value;
    var toCurrency = toOptions.value;
    var outputAmount = document.getElementById("output-amount");
    var inputAmount = Number(inputField.value);
    var calculatedAmount;

    if (inputField.value != "") {
        if (Number.isFinite(inputAmount)) {
            if (fromCurrency != "USD" && toCurrency != "USD") {
                var fromCurrencyToUSD = inputAmount / USDtoAny[fromCurrency];
                calculatedAmount = fromCurrencyToUSD * USDtoAny[toCurrency];
            }
            else if (toCurrency == "USD") {
                calculatedAmount = inputAmount / USDtoAny[fromCurrency];
            }
            else {
                calculatedAmount = inputAmount * USDtoAny[toCurrency];
            }
            outputAmount.innerHTML = addCommas(calculatedAmount.toFixed(2)) + " " + toCurrency;
        }
        else {
            outputAmount.innerHTML = "Invalid input";
        }
    }
    else {
        outputAmount.innerHTML = "";
    }
}

function addCommas(num) {
    var numString = num.toString();
    var decimals = numString.substring(numString.length-3)
    numString = numString.substring(0, numString.length-3)
    var result = "";
    var end;
    var commasNeeded = 0;
    var n = numString.length;

    if (n < 4) {
        return numString + decimals;
    }

    else {
        var temp = n;
        while (temp - 3 > 0) {
            commasNeeded++;
            temp = temp - 3;
        }

        while (commasNeeded > 0) {
            end = "," + numString.substring(numString.length-3);
            result = end + result;
            commasNeeded--;
            numString = numString.substring(0, numString.length-3);
        }
        result = numString + result + decimals;
    }
    return result;
}