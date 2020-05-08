'use strict';
const
  cartButton = document.getElementById("cart-button"),
  modalCart = document.querySelector('.modal-cart'),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  loginInForm = document.getElementById('logInForm'),
  loginInput = document.getElementById('login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  restaurantTitle = document.querySelector('.restaurant-title'),
  rating = document.querySelector('.rating'),
  minPrice = document.querySelector('.price'),
  category = document.querySelector('.category'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  inputSearch = document.querySelector('.input-search'),
  modalBody = document.querySelector('.modal-body'),
  modalPriceTag = document.querySelector('.modal-pricetag'),
  buttonclearCart = document.querySelector('.clear-cart'),
  cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

const cart = [];
//Запрос к базе товаров 
const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`);

  }


  return await (response.json());


}




//Проверка на валидность логина 
const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;

  return nameReg.test(str);
}
valid();
//Модальное окно корзины 
function toggleModal() {

  modalCart.classList.toggle("is-open");

}
//Модальное окно авторизации
function toggleModalAuth() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}
// Возврат на главную
function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');

}

function authorized() {
  //вЫХОД
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = 'none';
    buttonOut.removeEventListener('click', logOut);
    returnMain();
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}


//Авторизация
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

//Создаём карту ресторана
function createCardsRestaurants({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) {



  const card = `<a  class="card card-restaurant" 
  data-products="${products}"
  data-info="${[name, price, stars, kitchen]}"
  >
  <img src="${image}" alt="${name}"/>
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





//Создаём карту товара
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
						<img src="${image}" alt="${name}" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>		
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
						</div>

  `);

  cardsMenu.insertAdjacentElement('beforeend', card);

}

//Открывает меню ресторана
function openGoods(e) {

  const target = e.target;
  if (login) {

    const restorant = target.closest('.card-restaurant');


    if (restorant) {

      const info = restorant.dataset.info.split(',');

      const [name, price, stars, kitchen] = info;
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

      getData(`./db/${restorant.dataset.products}`).then(function (data) {

        data.forEach(crasteCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }



}


//Добвляем в корзину
function addToCart(e) {
  const target = e.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function (item) {
      return item.id === id;

    });
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id: id,
        title: title,
        cost: cost,
        count: 1
      })
    }

  }
}

//Собираем корзину

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function ({
    id,
    title,
    cost,
    count
  }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost} </strong>
      <div class="food-counter">
        <button class="counter-button  counter-minus" data-id="${id}">-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id="${id}">+</button>
      </div>
    </div>`;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);
  modalPriceTag.textContent = totalPrice + ' ₽';

}
//Изменяем кол-во товаров 
function changeCount(e) {
  const target = e.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;

    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);

      }
    }

    if (target.classList.contains('counter-plus')) {
      food.count++;
    }
    renderCart();
  }
}
//Поиск
function searchCart(e) {


  if (e.keyCode === 13) {
    if (login) {
      const target = e.target;



      const value = target.value.toLowerCase().trim();

      if (!value || value.length < 3) {
        target.style.background = 'tomato';
        setTimeout(function () {
          target.style.background = '';
        }, 2000)
        return;
      }

      target.value = '';
      const goods = [];

      getData('./db/partners.json').then(function (data) {

        const products = data.map(function (item) {
          return item.products;
        });

        products.forEach(function (product) {
          getData(`./db/${product}`)
            .then(function (data) {
              goods.push(...data);

              const searchGoods = goods.filter(function (item) {
                return item.name.toLowerCase().includes(value)

              });
              console.log(goods);

              cardsMenu.textContent = '';
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              restaurantTitle.textContent = 'Результат поиска';
              rating.textContent = '';
              minPrice.textContent = ``;
              category.textContent = '';

              return searchGoods;


            })
            .then(function (data) {
              data.forEach(crasteCardGood);
            })
        })

      });
    }
    else{toggleModalAuth();}
  }



}

function init() {


  getData('./db/partners.json').then(function (data) {

    data.forEach(createCardsRestaurants);


  });
  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });
  buttonclearCart.addEventListener('click', function () {
    cart.length = 0
    renderCart();
  })
  modalBody.addEventListener('click', changeCount);
  cardsMenu.addEventListener('click', addToCart);
  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', returnMain);
  //Поиск
  inputSearch.addEventListener('keydown', searchCart);

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