export const elements=  {
    searchInput : document.querySelector('.search__field'),
    searchForm  :document.querySelector('.search'),
    searchResList : document.querySelector('.results__list'),
    searchRes : document.querySelector('.results'),
    searchResPage : document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    servings : document.querySelector('.recipe__info-buttons'),
    shopping : document.querySelector('.shopping__list'),
    likesPanel : document.querySelector('.likes__list'),
    loveButton : document.querySelector('.likes__field')

};

export const elementStrings = {
    loader : 'loader'
};

export const renderLoader = (parent) => {
    const loader = `
        <div class = "${elementStrings.loader}">
            <svg> 
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML("afterbegin",loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader)
        loader.parentElement.removeChild(loader);
};
