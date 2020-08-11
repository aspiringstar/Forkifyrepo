// Global app controller
import Search from './models/Search';
import * as SearchView from './views/searchView';
import * as RecipeView from './views/recipeView';
import {elements,renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as ListView from './views/listView';
import * as LikesView from './views/likesView';



const state ={}  ;
window.state = state ;
const controlSearch = async () => {
    //1.get query from view
    const query = SearchView.getInput();
    //const query = 'pizza';

    
    if (query){

        //2. new search object added to state
        state.search = new Search(query);
        

        //3. prepare UI for results
        SearchView.clearField();
        SearchView.clearList();
        renderLoader(elements.searchRes);

        try{
                 //4. search for recipes
        await state.search.getResults();

        //5.render results on UI
        clearLoader();
        SearchView.renderResults(state.search.result);
        }catch (e){
            clearLoader();
            alert("Oops! There is an error!");
            console.log(e);
        }
   
    }
} ;

elements.searchForm.addEventListener('submit', f => {
    f.preventDefault();
    controlSearch();
});

window.addEventListener('load', f => {
    state.likes = new Likes ();
    LikesView.toggleLoveBtn(false); 
    state.likes.readStorage();

    if(state.likes.numLikes() !== 0) 
        LikesView.toggleLoveBtn(true); 

    state.likes.likes.forEach(function (el){
        LikesView.renderLikes(el);
    })


}); 

elements.searchResPage.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto);
        SearchView.clearList();
        SearchView.renderResults(state.search.result, gotoPage);
    }
});

const controlRecipe =async () => {
    const id = window.location.hash.replace('#','');
    console.log(id);
    if (id){
        state.recipe = new Recipe(id);
        RecipeView.clearRecipe();
        renderLoader(elements.recipe);
        //window.r = state.recipe ;
        SearchView.activeRecipe(id);

        try {
            
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calcTime ();
            state.recipe.calcServings();
            clearLoader();
            const flag = state.likes.isliked(state.recipe.id);
            RecipeView.renderRecipe(state.recipe, flag );
            
            
            console.log(state.recipe);
            
        }catch(e){
            alert("There is an error! " + e);
            console.log(e);
        }
    }
    
    
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe ));

const controlList = () => {
   if(!state.list) state.list = new List ();
   //window.l = state.list;

    state.recipe.ingredients.forEach(function(el){
        const item = state.list.addItems(el.count,el.unit,el.ingredient);
        ListView.renderList (item);
        //console.log(item);
        })
        
};

elements.shopping.addEventListener('click',e => {
    const id  = e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        ListView.delItem(id);
        
    } else if(e.target.closest ('.shopping__count-value')){
       const val = parseFloat( e.target.value,10);
       state.list.updateItem (id,val);

    }
   // console.log(id);
   
})





const controlLikes = () => {
    if(!state.likes) state.likes = new Likes ();

    if(state.likes.isliked(state.recipe.id)){
        //Remove from likes
       const item= state.likes.deleteLikes(state.recipe.id)

        //Toggle love button
       // if(state.likes.likes.length=0)
            //document.querySelector('.recipe__love').display = hidden;
        LikesView.isLiked(false);  
        if(state.likes.numLikes() == 0)  LikesView.toggleLoveBtn(false);  

        //Remove from UI
        console.log(item)
        LikesView.delLikes(state.recipe.id);
    }else{
        //Add to likes
        
        const item = state.likes.addLikes (state.recipe.id,state.recipe.title,state.recipe.author,state.recipe.img);

        //Toggle love button
        LikesView.isLiked(true);
        LikesView.toggleLoveBtn(true);

        //Add to UI
        LikesView.renderLikes(item);
        console.log(item);


    }
};

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        RecipeView.updateRecipe(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        RecipeView.updateRecipe(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
       controlList();
        //console.log('hello');
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
    
    
}  );

