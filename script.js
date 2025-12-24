// https://v6.exchangerate-api.com/v6/1c2faa62e65ede8027c96917/pair/USD/INR currency conversion API
// https://v6.exchangerate-api.com/v6/1c2faa62e65ede8027c96917/codes currency codes API
// https://flagsapi.com/IN/flat/64.png  flag API for country flags

const countryFixes = {
    "EU": "FR", 
    "AN": "NL", 
    "AR": "AW", 
    "BA": "BA",
    "AN": "CW", 
    "XA": "CM", 
    "XO": "SN",
    "XP": "PF",
    "XD": "UN", 
};

let tcurrency = document.querySelector(".to-currency");
let fcurrency = document.querySelector(".from-currency");
let fimage = document.querySelector(".from-image");
let timage = document.querySelector(".to-image");
let button = document.querySelector(".cbutton");
let input_text = document.querySelector(".input-text");
let output_text = document.querySelector(".output-text");
let message = document.querySelector(".message-div");
let noteIcon = document.querySelector(".note-icon");
let note = document.querySelector(".note-text");
let toptions = "";
let foptions = "";

let currency_codes = async () => {
  let response = await fetch(
    "https://v6.exchangerate-api.com/v6/1c2faa62e65ede8027c96917/codes"
  );
  let data = await response.json();
  let money_codes = data.supported_codes;
  for (let currency of money_codes) {
    let full_code = currency[0];
    let short_code = full_code.substring(0, 2);
    let fselected = full_code === "INR" ? "selected" : "";
    let tselected = full_code === "USD" ? "selected" : "";
    toptions += `<option value=${short_code} ${tselected}>${full_code}</option>`;
    foptions += `<option value=${short_code} ${fselected}>${full_code}</option>`;
  }
  tcurrency.innerHTML = toptions;
  fcurrency.innerHTML = foptions;

  updateFlag(tcurrency, timage);
  updateFlag(fcurrency, fimage);
};
currency_codes();

const updateFlag = (element, imageContainer) => {
    let countryCode = element.value;

    if (countryFixes[countryCode]) {
        countryCode = countryFixes[countryCode];
    }

    if (!countryCode) return;

    imageContainer.src = `https://flagsapi.com/${countryCode}/flat/64.png`;

    imageContainer.onerror = () => {
        imageContainer.src = "https://cdn-icons-png.flaticon.com/512/2099/2099192.png"; // Generic Globe icon
    };
};

tcurrency.addEventListener("change", (e) => {
  updateFlag(e.target, timage);
});

fcurrency.addEventListener("change", (e) => {
  updateFlag(e.target, fimage);
});

let conversion = async (t, f, i) => {
    let response = await fetch(`https://v6.exchangerate-api.com/v6/1c2faa62e65ede8027c96917/pair/${f}/${t}`);
    let data = await response.json();
    if (data.result === "success") {
        let rate = data.conversion_rate;
        let final_amt = (rate * i).toFixed(2); 
        if (output_text) {
            output_text.value= final_amt;
        } else {
            console.error("The output element was not found in the DOM!");
        }
    }
    button.disabled = false;
    message.classList.add("hide");
}

button.addEventListener("click", (e) => {
    e.preventDefault();
    let input = input_text.value;
    if(input === ""|| input<1) {
        input = 1;
        input_text.value = "1";
    }
    let tcode = tcurrency.options[tcurrency.selectedIndex].text;
    let fcode = fcurrency.options[fcurrency.selectedIndex].text;
    conversion(tcode,fcode,input);
    message.classList.remove("hide");
    button.disabled = true;
})

noteIcon.addEventListener("mouseenter", () => {
    note.classList.remove("hide");
})
noteIcon.addEventListener("mouseleave", () => {
    note.classList.add("hide");
})