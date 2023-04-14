import "./css/styles.css";
import pages from './js/json/pages.js';
import templateRoot from './hbs/root.hbs';
import templateGoods from './hbs/goods.hbs';
import templatePages from './hbs/pages.hbs';
import templateAbout from './hbs/aboutus.hbs';
import templateLanding from './hbs/landing.hbs';

const goodsUrl = "./api/goods.json";
let goodsJsonPromise = fetch(goodsUrl).then(result => result.json());// do the fetch, return fectch result
let appEl = document.getElementById("app");
appEl.innerHTML = templateRoot(pages);
let mainEl = document.getElementById("root-main");

// The proceeding code can be used to make this into a real page later


// function to fetch slideshow on home page for window.onload
let showhome = function () {
	goodsJsonPromise.then(results => {
		const shopDataEl = document.getElementById("home-main");
		shopDataEl.innerHTML = templateLanding(results);
		slideshow.init("slideshowarrow-left", "slideshowarrow-right", "landing-slideshow", results.goods);
	});
}

window.onload = () => {

	// sets window.onload to start up on the home page
	mainEl.innerHTML = templatePages(pages.pages[0]);
	// calls showhome so templatePages can browse the pictures in the json file
	showhome();
	//

	let elsNavLink = document.getElementsByClassName("nav-link");

	// for loop assigned to add click event handle to  all navigation pages in pages js
	for (let elNavLink of elsNavLink) {

		elNavLink.addEventListener('click', function () {

			// pushstate what page we were on, the for loop goes inside of a function that loads when page is loaded

			for (let page of pages.pages) {
				if (page.name === this.dataset.link) {
					mainEl.innerHTML = templatePages(page);

					// if Home is clicked on it shows the home page and fetches the stuff from the json file
					if (page.name === "Home") {
						showhome();
					}

					// calls the info page when clicked
					if (page.name === "About Us") {
						goodsJsonPromise.then(results => {
							const aboutUs = document.getElementById("home-main");
							aboutUs.innerHTML = templateAbout(aboutUs);
						});
					}

					// do you see
					if (page.name === "Shop") {
						let showProducts = (d, start, end) => {
							const dataCopy = { ...d };
							dataCopy.goods = dataCopy.goods.slice(start, end);
							goodsListEl.innerHTML = templateGoodsList(dataCopy);
						};

						let addProductQuantity = () => {
							let btngoodsEls = document.getElementsByClassName("btn-add-cart");
							for (let btngoodsEl of btngoodsEls) {
								btngoodsEl.addEventListener("click", function () {
									const par = btngoodsEl.parentElement;
									const gid = par.dataset.goodsid;
									const q = par.children.quantity.value;
									cart.add(gid, q);
									document.getElementById("amt-" + gid).innerHTML = cart.getQuantity(gid);
								});
							}
						};

						let goodsListEl;

						cart.load();
						goodsJsonPromise.then(data => {
							const dataCopy = { ...data };
							dataCopy.goods = dataCopy.goods.slice(0, 6);
							mainEl.innerHTML = templateGoods(dataCopy);
							goodsListEl = document.getElementById("goods-container");

							// showProducts(data, 0, 6);
							addProductQuantity();
							let content = document.getElementById("goods-left-container").innerHTML;
							let goodsSpnLogin = document.getElementById("login");
							goodsSpnLogin.addEventListener("click", () => {
								document.getElementById("goods-left-top-container").innerHTML = "<h1>Welcome!</h1>";
								document.getElementById("goods-left-bottom-container").style.display = "none";
								document.getElementById("logout").style.display = "block";
								document.getElementById("logout").addEventListener("click", () => {
									document.getElementById("goods-left-container").innerHTML = content;
								})
							});

							document.getElementById("btn-second-page").addEventListener("click", () => {
								showProducts(data, 6, 12);
								addProductQuantity();
							});
							document.getElementById("btn-first-page").addEventListener("click", () => {
								showProducts(data, 0, 6);
								addProductQuantity();
							});

						});

						// the pattern?
					} else if (page.name === "Cart") {
						goodsJsonPromise.then(results => {
							const shopDataEl = document.getElementById("home-main");
							cart.load();
							cart.getFullInfo(results);

							shopDataEl.innerHTML = templateCart(cart);
						});
					}
					return;
				}
			}
		});
	};
};