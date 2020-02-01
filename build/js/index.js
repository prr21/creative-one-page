const burgerMenu = document.querySelector('.burger-menu');
const list = document.querySelector('.menu-list');
const aside = document.querySelector('.aside');
const header = document.querySelector('.header');
const galleryMenu = document.querySelector('.gallery-menu');
const showMore = document.querySelector('#show-more');

//default params
let menuIsOpened = false;
let maxLengthPhotos = 6;
let albumId = 'album-1';

const cacheGallery = {};

// event listeners
document.addEventListener("DOMContentLoaded", () => {showAlbum(albumId)} )

burgerMenu.addEventListener('click', collapseMenu);
galleryMenu.addEventListener('click', toggleGallery);
showMore.addEventListener('click', showMorePhotos)


// Menu slide animation 
function collapseMenu() {
	burgerMenu.classList.toggle("change");
	list.classList.toggle("slide-down");
	aside.classList.toggle("slide-right");

	menuIsOpened = menuIsOpened ? false : true
	header.style.backgroundColor = menuIsOpened? 'white' : 'transparent';
}

// adding class active on li
function toggleGallery(e) {
	if (e.target.className != "gallery-menu__list") return;

	albumId = e.target.id;

	let selectedGallery = document.querySelector('.' + albumId);
	let activeList = document.querySelectorAll('.active');

	activeList[0].classList.remove('active');
	activeList[1].classList.remove('active');

	e.target.classList.add('active');
	selectedGallery.classList.add('active');

	showAlbum(albumId)
}

function showMorePhotos(){
	maxLengthPhotos =+ 3;
	showAlbum(albumId, maxLengthPhotos)
}
let spinner = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

const showAlbum = (albumId, countPhotos = 6) => {
	const gallery = document.querySelector('.' + albumId);
		albumId = albumId.replace(RegExp(/\D/g), '');			//extract num from string

	const countOfPhotosInGallery = gallery.childElementCount || 0
	const maxPhotosInAlbum = 50;
	const startPhotoIdInAlbum = maxPhotosInAlbum * (albumId - 1);

	let photoId = startPhotoIdInAlbum + countOfPhotosInGallery;

	if ( countOfPhotosInGallery && countPhotos == 6 ) return

	displayPhotos(countPhotos);

	// Display photo in gallery
	async function displayPhotos(haveToAdd) {
		for (let i = 0; i < haveToAdd; i++) {
			++photoId;
			
			if (photoId % maxPhotosInAlbum == 0) return;

			let item = document.createElement('div');
			item.className = 'gallery__item';
			item.innerHTML = spinner;

			gallery.appendChild(item);

			const newItem = await getPhoto(albumId, photoId);

			if (!newItem[0]) return;

			const { url, title, id } = newItem[0];

			item.innerHTML = `
				<div class="gallery-wallpaper">
					<img src="${url}" alt="${title} img">
				</div>						
				<div class="gallery__item-info">
					<h4 class="gallery__item-title head-text title-column"><span>№${id} Free mockups collection </span><span>laptop and phone</span></h4>
					<p class="reg-text">${title.repeat(4)};</p>
					<span class="btn-text">Read more</span>
				</div>;`
		}
	}

	// Reqest photo with fetch
	async function getPhoto(albumId, photoId) {
		// if (cacheGallery[id]) return cacheGallery[id];
		let url = `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}&id=${photoId}`;
		let response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Cannot find url ${response.url}! Code ${response.status}`)
		}

		let json = await response.json();
		return json
	}
}