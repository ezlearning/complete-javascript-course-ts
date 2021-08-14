import { getPosition } from "./geo";

const btn = document.querySelector<HTMLButtonElement>(".btn-country");
const countriesContainer = document.querySelector<HTMLDivElement>(".countries");

///////////////////////////////////////
function renderError(msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
}

function renderCountry(data, neighbour = "") {
  const html = `
  <article class="country ${neighbour}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        Number(data.population) / 1000000
      ).toFixed(1)}M</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
}

// https://github.com/public-apis/public-apis
function getCountryByCode(countryCode: string) {
  // ajax call country 1
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.eu/rest/v2/alpha/${countryCode}`);
  request.send();
  request.addEventListener("load", function () {
    console.log("resposne2", request.responseText);
    const data = JSON.parse(request.responseText);
    console.log("data2", data);
    // render country 1
    renderCountry(data);
  });
}

// https://github.com/public-apis/public-apis
function getCountryAndNeighbour(countryName: string) {
  // ajax call country 1
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.eu/rest/v2/name/${countryName}`);
  request.send();
  request.addEventListener("load", function () {
    console.log("resposne1", request.responseText);
    const [data] = JSON.parse(request.responseText);
    console.log("data1", data);
    // render country 1
    renderCountry(data);

    // get neighbour country 2
    const [neighbour] = data.borders;
    if (!neighbour) return;
    getCountryByCode(neighbour);
  });
}
// getCountryAndNeighbour("portugal");

function getJSON(url, errMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errMsg} (${response.status})`);
    return response.json();
  });
}

function getCountryData(country: string) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then((response) => {
      if (!response.ok) throw new Error(`country is not found (${response.status})`);
      return response.json();
    })
    .then(async (data) => {
      renderCountry(data[0]);
      const [neighbour] = data[0].borders;
      if (!neighbour) return "";
      return await fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then((resosne) => {
      if (resosne === "") {
        return "";
      } else {
        return resosne.json();
      }
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err: Error) => {
      console.error(`${err} 💥 💥 💥`);
      renderError(`Something went wrong 💥 💥 💥 ${err.message}. Try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = "1";
      console.log("done!");
    });
}

function getCountryDataV2(country: string) {
  getJSON(`https://restcountries.eu/rest/v2/name/${country}`, "country is not found")
    .then((data) => {
      renderCountry(data[0]);
      const [neighbour] = data[0].borders;
      if (!neighbour) throw new Error("No neighbour found");
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        "country is not found"
      );
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err: Error) => {
      console.error(`${err} 💥 💥 💥`);
      renderError(`Something went wrong 💥 💥 💥 ${err.message}. Try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = "1";
      console.log("done!");
    });
}

const whereAmI = function () {
  getPosition()
    .then((posiiton) => {
      const { latitude, longitude } = posiiton.coords;
      return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Country not found ${res.status}`);
      return res.json();
    })
    .then((data) => renderCountry(data[0]))
    .catch((err: Error) => {
      console.error(`${err} 💥 💥 💥`);
      renderError(`Something went wrong 💥 💥 💥 ${err.message}. Try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = "1";
      console.log("done!");
    });
};

btn.addEventListener("click", (event) => {
  // getCountryDataV2("portugal");
  whereAmI();
});
