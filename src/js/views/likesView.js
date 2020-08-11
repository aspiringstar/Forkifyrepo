import {elements} from './base';
import {renderResTitle} from './searchView';

export const renderLikes =likes => {
    const markup = `
    <li>
        <a class="likes__link" href="#${likes.id}">
            <figure class="likes__fig">
                <img src="${likes.image}" alt="${likes.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${renderResTitle(likes.title)}</h4>
                <p class="likes__author">${likes.author}</p>
            </div>
        </a>
    </li>
    `;
    elements.likesPanel.insertAdjacentHTML('beforeend', markup);
};

export const isLiked = flag => {
    const el = flag? 'icon-heart': 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${el}`);

};
export const delLikes = id => {
    const item = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(item) {
     item.parentElement.removeChild(item);
    }
};

export const toggleLoveBtn = flag => {
    elements.loveButton.style.visibility= flag ?  'visible' : 'hidden';
};