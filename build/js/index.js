const burgerMenu = document.querySelector('.burger-menu');
const list = document.querySelector('.menu-list');
const aside = document.querySelector('.aside');
const header = document.querySelector('.header');

let menuIsOpened = false;

burgerMenu.addEventListener('click', collapseMenu)

// Menu slide animation 
function collapseMenu () {
	burgerMenu.classList.toggle("change");
	list.classList.toggle("slide-down");
	aside.classList.toggle("slide-right");

	menuIsOpened = menuIsOpened ? false : true
	header.style.backgroundColor = menuIsOpened? 'white' : 'transparent';

}