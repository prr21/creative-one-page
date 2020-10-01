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
			itemIsLoading = true

			gallery.appendChild(item);

			const newItem = await getPhoto(albumId, photoId);
			if (!newItem[0]) {
				itemIsLoading = false;
				return displayError(newItem, item)
			}

			const { url, title, id } = newItem[0];

			item.innerHTML = `
				<div class="gallery-wallpaper">
					<img src="${url}" alt="${title} img">
				</div>		
				<div class="gallery__item-info">
					<h4 class="gallery__item-title head-text title-column"><span>№${id} Free mockups collection </span><span>laptop and phone</span></h4>
					<p class="reg-text">${title.repeat(4)}</p>
					<span class="btn-text">Read more</span>
				</div>`
		}
		itemIsLoading = false
	}

	function displayError(error, item) {
		item.innerHTML = `
		<div class="gallery__item-error">
			<div><h4>Произошла ошибка!</h4></div>
			<div>${error}</div>
		<div>`

		item.style.border = '1px solid #ff634736'
	}

	// Reqest photo with fetch
	async function getPhoto(albumId, photoId) {
		let url = `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}&id=${photoId}`;
		let response;

		try {
			response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Невозможно найти путь ${response.url}! <br> Код ошибки: ${response.status}`)
			}
		} catch(e) {
			return e
		}

		let json = await response.json();
		return json
	}
}