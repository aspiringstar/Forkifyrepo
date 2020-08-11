import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }
    async getRecipe (){
        
        try {
            const res = await axios (`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            //console.log(res);
            

        }
        catch(e){
            alert(`Error is ${e}`);
        }
    }
    calcTime (){
        
        this.time  = 40;
    }
    calcServings () {
        this.servings = 4;
    }
    parseIngredients () {
        const unitLong =['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon','ounces','ounce','cups','pounds'];
        const unitShort = ['tbsp','tbsp', 'tsps','tsps','oz','oz','cup','pound', 'kg', 'g'];
        
        
        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,unitShort[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(e1 => unitShort.includes(e1));

            let objIng;

            if (unitIndex > -1){
                
                const arrCount = arrIng.slice(0,unitIndex);
                
                let count  ;
                if (arrCount === 1){
                    count = eval(arrIng[0].replace('-','+'));
                }else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                    objIng = {
                        count,
                        unit : arrIng[unitIndex],
                        ingredient: arrIng.slice(unitIndex +1).join(' ')
                    };
                }

            }else if (parseInt(arrIng[0],10)){
                objIng ={
                    count :parseInt(arrIng[0],10),
                    unit: '',
                    ingredient : arrIng.slice(1).join(' ')
                };

            }else if (unitIndex === -1){
                objIng ={
                    count : 1,
                    unit : '',
                    ingredient
                };
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
    updateServings (type) {
        let newServings;
        newServings = type === 'dec' ? this.servings-1 : this.servings+1;
        this.ingredients.forEach(el => {
            el.count *= newServings/this.servings;
        })
        this.servings = newServings;
    }
}

