const DEBOUNCE_DELAY = 300;
import ApiCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import countryItemTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/country-list.hbs';
import Notiflix from "notiflix";
const apiCountries = new ApiCountries();

const searchElement = document.getElementById("search-box");
const listElement = document.querySelector(".country-list");
const infoElement = document.querySelector(".country-info");

searchElement.addEventListener('input', debounce((e) => {
    if (!searchElement.value.trim()) {
        return;
    }

    apiCountries.query = searchElement.value;
    
    apiCountries.fetchCountries()
        .then((countries) => {
       
            if (countries.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            }

            if (countries.length === 1) {
                renderCountryCard(countries);
            }

            if (countries.length >= 2 && countries.length <= 10) {
                renderCountryList(countries);
            }
             
        })
        .catch(error =>  onReject());

}, DEBOUNCE_DELAY));
function renderCountryCard(countries) {
  clearCountryCard()
    infoElement.insertAdjacentHTML('afterbegin', countryItemTpl(countries));
}
function renderCountryList(countries) {
  clearCountryCard()
    infoElement.insertAdjacentHTML('afterbegin', countryListTpl(countries));
}
function clearCountryCard() {
    infoElement.innerHTML = '';
}
function onReject() {
    clearCountryCard();
    
Notiflix.Notify.failure('Oops, there is no country with that name'); }
