'use strict';
const
  cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal-auth"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  loginInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

function toggleModal() {

  modal.classList.toggle("is-open");

}

function toggleModalAuth() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
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
    if (loginInput.value.trim()) {



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


function createCardsRestaurants() {

  const card = `<a  class="card card-restaurant">
  <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">Пицца плюс</h3>
      <span class="card-tag tag">60 мин</span>
    </div>
    <div class="card-info">
      <div class="rating">
        4.8
      </div>
      <div class="price">От 1900 ₽</div>
      <div class="category">Пицца</div>
    </div>
  </div>
</a>`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}




function crasteCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
						<img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Везувий</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
									«Халапенье», соус «Тобаско», томаты.
								</div>
							</div>		
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">545 ₽</strong>
							</div>
						</div>

  `);
  cardsMenu.insertAdjacentElement('beforeend', card);

}


function openGoods(e) {

  const target = e.target;

  const restorant = target.closest('.card-restaurant');
  if (login) {


    if (restorant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');


      crasteCardGood();
      crasteCardGood();
      crasteCardGood();

    }

  }else{
    toggleModal();
  }

}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});
checkAuth();

createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();