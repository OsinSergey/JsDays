'use strict';
const
  cartButton = document.querySelector("#cart-button"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  loginInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  sectionHeading = document.querySelector('.section-heading'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');


const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`);

  }


  return await (response.json());


}





const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;

  return nameReg.test(str);
}
valid();

function toggleModal() {

  modalAuth.classList.toggle("is-open");

}

function toggleModalAuth() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    returnMain();
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}



function notAutorized() {
  function logIn(event) {
    event.preventDefault();
    if (valid(loginInput.value.trim())) {



      login = loginInput.value;

      localStorage.setItem('gloDelivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      loginInForm.removeEventListener('submit', logIn);
      loginInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = '#ff7a71';

    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginInForm.addEventListener('submit', logIn);

}

function checkAuth() {
  if (login) {
    authorized();

  } else {
    notAutorized();
  }
}


function createCardsRestaurants({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) {




  const card = `<a  class="card card-restaurant" data-products="${products}">
  <img src="${image}"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${timeOfDelivery} мин</span>
    </div>
    <div class="card-info">
      <div class="rating">
      ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  </div>
</a>`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}






function crasteCardGood({
  id,
  image,
  name,
  price,
  description,
  time_of_delivery: timeOfDelivery
}) {



  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>		
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>

  `);

  cardsMenu.insertAdjacentElement('beforeend', card);

}


function openGoods(e) {

  const target = e.target;
  if (login) {


    const restorant = target.closest('.card-restaurant');

    
  

    if (restorant) {



      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');



      getData(`./db/${restorant.dataset.products}`).then(function (data) {

        data.forEach(crasteCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }



}


getData('./db/partners.json').then(function (data) {

  data.forEach(createCardsRestaurants);


});



function init() {
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', returnMain);
  checkAuth();



  new Swiper('.swiper-container', {
    // Optional parameters
    loop: true,
    speed: 400,

    slidesPerView: 1,
    autoplay: {
      delay: 5000,
    },
  });
}

init();