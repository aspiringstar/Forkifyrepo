import {elements} from './base';

export const getInput = () => elements.searchInput.value ;

export const clearField = () => {elements.searchInput.value ="";};
export const clearList = () => {elements.searchResList.innerHTML ="";
elements.searchResPage.innerHTML = "";};

export const renderResTitle = (title, num=17) => {
    const newTitle = [];
    if (title.length > num){
         title.split(" ").reduce((acc,cur) => {
             if(acc+cur.length <= num){
                newTitle.push(cur);
             }
            return acc+cur.length;
        },0);
        return `${newTitle.join(" ")}...`;
   }
   return title;
}

const renderRecipe = recipe => {
    const markup = `
    <li>
         <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
             </figure>
            <div class="results__data">
                <h4 class="results__name">${renderResTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
          </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const activeRecipe = (id)=> {
    Array.from(document.querySelectorAll('.results__link')).forEach(function(el) {
        el.classList.remove('results__link--active');
    })


    const item = document.querySelector(`.results__link[href*="${id}"]`);
    if(item){
        item.setAttribute('class','results__link results__link--active');
    }
};

const createButton = (page,type)=>  `
            <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1 : page+1 }> 
            <span>Page ${type==='prev'? page-1 : page+1 }</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left' : 'right'}"></use>
            </svg>
            
            </button>
    `;

const renderButton = (page,resultsNum, resPerPage) => {
    const pages = Math.ceil (resultsNum/resPerPage);
    let button;

    if  (page === 1 && pages>1){
        button = createButton(page,'next');
    } else if (page < pages){
        button = `${createButton(page,'prev')}
        ${createButton(page,'next')}`;
    }else if (page === pages && pages >1 ){
        button = createButton(page, 'prev');
    }
    elements.searchResPage.insertAdjacentHTML('afterbegin',button);
};

export const renderResults =(recipes, page=1, resPerPage=10) => {
    const start = (page-1)*10;
    const end = page*10;
    recipes.slice(start,end).forEach(renderRecipe);
    renderButton(page,recipes.length,resPerPage);
};