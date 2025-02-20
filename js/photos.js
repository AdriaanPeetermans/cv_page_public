MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
PHOTOLIB = undefined;
CURRENTPHOTO = undefined;
CURRENTROLL = undefined;

function loadScript() {
    // activatePhotoHover();
    activateEnlarge();
    // get photo lib:
    getPhotos();
}

function photoMouseEnterListener(metaBar) {
    metaBar.classList.add('hover');
}

function photoMouseLeaveListener(metaBar) {
    metaBar.classList.remove('hover');
}

function photoClickListener(photoData, rollTitle, photoIndex, rollIndex) {
    CURRENTPHOTO = photoIndex;
    CURRENTROLL = rollIndex;
    const enlarge = document.getElementById('enlarge_photo');
    const enlargeAlbum = document.getElementById('enlarge_album');
    const enlargeImage = document.getElementById('enlarge_photo_container').getElementsByTagName('img').item(0);
    const enlargeMeta = document.getElementById('enlarge_photo_meta');
    const metaCols = enlargeMeta.getElementsByClassName('enlarge-photo-meta-col');
    for (col of metaCols) {
        const colDiv = col.getElementsByTagName('div').item(0);
        if (col.title.toLowerCase() == 'date') {
            if (typeof photoData.date !== 'undefined') {
                colDiv.innerHTML = `${MONTHS[photoData.date.month - 1]} ${photoData.date.year}`;
                col.style.display = 'flex';
            }
            else {
                col.style.display = 'none';
            }
        }
        else if (col.title.toLowerCase() == 'location') {
            if (typeof photoData.location !== 'undefined') {
                colDiv.innerHTML = `${photoData.location.town}, ${photoData.location.country}`;
                col.style.display = 'flex';
            }
            else {
                col.style.display = 'none';
            }
        }
        else if (col.title.toLowerCase() == 'camera') {
            if (typeof photoData.camera !== 'undefined') {
                colDiv.innerHTML = `${photoData.camera.make} - ${photoData.camera.model}`;
                col.style.display = 'flex';
            }
            else {
                col.style.display = 'none';
            }
        }
        else if (col.title.toLowerCase().startsWith('aperture')) {
            if (typeof photoData.settings !== 'undefined') {
                colDiv.innerHTML = `f/${photoData.settings.fnumber}, 1/${photoData.settings.speed}, ${photoData.settings.focal35mm} mm`;
                col.style.display = 'flex';
            }
            else {
                col.style.display = 'none';
            }
        }
        else if (col.title.toLowerCase().startsWith('film')) {
            if (typeof photoData.film !== 'undefined') {
                colDiv.innerHTML = `${photoData.film.make} ${photoData.film.model} ISO ${photoData.film.iso}, ${photoData.film.format}`;
                col.style.display = 'flex';
            }
            else {
                col.style.display = 'none';
            }
        }
    }
    enlargeImage.src = photoData.url;
    enlarge.style.display = 'flex';
    enlargeAlbum.innerHTML = rollTitle;
    // Activate keypress:
    window.onkeydown = function(e) {
        if (e.keyCode == 39) {
            // Right
            enlargeNextClickListener();
        }
        else if (e.keyCode == 37) {
            // Left
            enlargePreviousClickListener();
        }
        else if (e.keyCode == 27) {
            // Escape
            enlargeCloseClickListener();
        }
    };
}

function activateEnlarge() {
    const closeButton = document.getElementById('enlarge_close_container');
    const nextButton = document.getElementById('enlarge_next_container');
    const previousButton = document.getElementById('enlarge_previous_container');
    const infoButton = document.getElementById('enlarge_info_container');
    closeButton.addEventListener('click', enlargeCloseClickListener);
    nextButton.addEventListener('click', enlargeNextClickListener);
    previousButton.addEventListener('click', enlargePreviousClickListener);
    infoButton.addEventListener('click', enlargeInfoClickListener);
}

function enlargeCloseClickListener() {
    const enlarge = document.getElementById('enlarge_photo');
    enlarge.style.display = 'none';
    if (enlargeInfoShow) {
        enlargeInfoClickListener();
    }
    window.onkeydown = null;
}

function enlargeNextClickListener() {
    CURRENTPHOTO++;
    if (CURRENTPHOTO >= PHOTOLIB.rolls[CURRENTROLL].photos.length) {
        CURRENTPHOTO = 0;
    }
    photoClickListener(PHOTOLIB.rolls[CURRENTROLL].photos[CURRENTPHOTO], PHOTOLIB.rolls[CURRENTROLL].title, CURRENTPHOTO, CURRENTROLL);
}

function enlargePreviousClickListener() {
    CURRENTPHOTO--;
    if (CURRENTPHOTO < 0) {
        CURRENTPHOTO = PHOTOLIB.rolls[CURRENTROLL].photos.length - 1;
    }
    photoClickListener(PHOTOLIB.rolls[CURRENTROLL].photos[CURRENTPHOTO], PHOTOLIB.rolls[CURRENTROLL].title, CURRENTPHOTO, CURRENTROLL);
}

let enlargeInfoShow = false;

function enlargeInfoClickListener() {
    const metaBar = document.getElementById('enlarge_photo_meta');
    if (enlargeInfoShow) {
        metaBar.style.transform = 'translateY(100%)';
    }
    else {
        metaBar.style.transform = 'translateY(0)';
    }
    enlargeInfoShow = !enlargeInfoShow;
}

// Build photoRolls:

function getPhotos() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'json/photo_library.json');
    xhr.send();
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            PHOTOLIB = xhr.response;
            for (const [iRoll, roll] of xhr.response.rolls.entries()) {
                for (const [iPhoto, photo] of roll.photos.entries()) {
                    addPhoto(photo, roll.title, iPhoto, iRoll);
                }
            }
        }
        else {
            console.log(`Error requesting photo lib: ${xhr.status}`);
        }
    };
}

function addPhoto(photoData, rollTitle, photoIndex, rollIndex) {
    const mainContent = document.getElementById('main_content');
    let existingRolls = mainContent.getElementsByClassName('photo-paragraph');
    const existingRollTitles = [];
    for (roll of existingRolls) {
        const title = roll.getElementsByClassName('about-title').item(0).getElementsByTagName('h1').item(0).textContent;
        existingRollTitles.push(title);
    }
    if (!existingRollTitles.includes(rollTitle)) {
        addRoll(rollTitle);
    }
    existingRollTitles.push(rollTitle);
    existingRolls = mainContent.getElementsByClassName('photo-paragraph');
    const selectedRoll = existingRolls.item(existingRollTitles.indexOf(rollTitle));
    const photoRoll = selectedRoll.getElementsByClassName('photo-roll').item(0);
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('photo');
    const photoImg = document.createElement('img');
    photoImg.src = photoData.url;
    photoDiv.appendChild(photoImg);
    const metaBarDiv = document.createElement('div');
    metaBarDiv.classList.add('meta-bar');
    if (typeof photoData.date !== 'undefined') {
        metaBarDiv.appendChild(createMetaRow('Date', 'svg/generic/date.svg', `${MONTHS[photoData.date.month - 1]}<br>${photoData.date.year}`));
    }
    if (typeof photoData.location !== 'undefined') {
        metaBarDiv.appendChild(createMetaRow('Location', 'svg/generic/location.svg', `${photoData.location.town}<br>${photoData.location.country}`));
    }
    if (typeof photoData.camera !== 'undefined') {
        metaBarDiv.appendChild(createMetaRow('Camera', 'svg/generic/camera.svg', `${photoData.camera.make}<br>${photoData.camera.model}`));
    }
    if (typeof photoData.settings !== 'undefined') {
        metaBarDiv.appendChild(createMetaRow('Aperture, shutter speed, 35 mm equivalent focal length', 'svg/generic/aperture.svg', `f/${photoData.settings.fnumber}, 1/${photoData.settings.speed},<br>${photoData.settings.focal35mm} mm`));
    }
    if (typeof photoData.film !== 'undefined') {
        metaBarDiv.appendChild(createMetaRow('Film stock', 'svg/generic/film.svg', `${photoData.film.make} ${photoData.film.model}<br>ISO ${photoData.film.iso}, ${photoData.film.format}`));
    }
    photoDiv.appendChild(metaBarDiv);
    photoRoll.appendChild(photoDiv);
    photoDiv.addEventListener('mouseenter', photoMouseEnterListener.bind(null, metaBarDiv));
    photoDiv.addEventListener('mouseleave', photoMouseLeaveListener.bind(null, metaBarDiv));
    photoDiv.addEventListener('click', photoClickListener.bind(null, photoData, rollTitle, photoIndex, rollIndex));
}

function addRoll(rollTitle) {
    const mainContent = document.getElementById('main_content');
    const photoParDiv = document.createElement('div');
    photoParDiv.classList.add('paragraph', 'photo-paragraph');
    const aboutTitleDiv = document.createElement('div');
    aboutTitleDiv.classList.add('about-title');
    const aboutTitleH1 = document.createElement('h1');
    aboutTitleH1.innerText = rollTitle;
    const aboutTitleLine = document.createElement('div');
    aboutTitleLine.classList.add('about-title-line');
    aboutTitleDiv.appendChild(aboutTitleH1);
    aboutTitleDiv.appendChild(aboutTitleLine);
    photoParDiv.appendChild(aboutTitleDiv);
    const photoRollDiv = document.createElement('div');
    photoRollDiv.classList.add('photo-roll');
    photoParDiv.appendChild(photoRollDiv);
    mainContent.appendChild(photoParDiv);
}

function createMetaRow(title, iconUrl, data) {
    const metaRowDiv = document.createElement('div');
    metaRowDiv.classList.add('meta-row');
    metaRowDiv.title = title;
    const iconImg = document.createElement('img');
    iconImg.src = iconUrl;
    iconImg.onload = SVGInject.bind(null, iconImg);
    metaRowDiv.appendChild(iconImg);
    const dataDiv = document.createElement('div');
    dataDiv.innerHTML = data;
    metaRowDiv.appendChild(dataDiv);
    return metaRowDiv;
}