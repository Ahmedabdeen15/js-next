const Pizza = document.getElementById('Pizza');
const Pasta = document.getElementById('Pasta');
const Beef = document.getElementById('Beef');
const Salad = document.getElementById('Salad');
const main = document.querySelector('main');
const nav = document.querySelector('nav');
const url = 'https://forkify-api.herokuapp.com/api/search?q=';

const fetchData = async (url) => {
    main.innerHTML = `
        <div class="loaderContainer">
            <span class="loader"></span>
        </div>`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    displayData(data);
}

Pizza.addEventListener('click', () => {
    const pizzaUrl = url + 'pizza';
    nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    Pizza.classList.add('active');
    fetchData(pizzaUrl);
});

Pasta.addEventListener('click', () => {
    const pastaUrl = url + 'pasta';
    nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    Pasta.classList.add('active');
    fetchData(pastaUrl);
});

Beef.addEventListener('click', () => {
    const beefUrl = url + 'beef';
    nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    Beef.classList.add('active');
    fetchData(beefUrl);
});

Salad.addEventListener('click', () => {
    const saladUrl = url + 'salad';
    nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    Salad.classList.add('active');
    fetchData(saladUrl);
});


function displayData(data){
    main.innerHTML = '';
    data.recipes.forEach(recipe => {
        console.log(recipe);
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.cursor = 'pointer';

        card.innerHTML = `
        <img src="${recipe.image_url}" alt="${recipe.title}">
        <p class="title">${recipe.title}</p>
        <p class="publisher">${recipe.publisher}</p>
        `;
        
        card.addEventListener('click', () => {
            window.open(recipe.source_url, '_blank');
        });
        
        main.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    Pizza.click();
});
/*
<img src="http://forkify-api.herokuapp.com/images/best_pizza_dough_recipe1b20.jpg" alt="">
            <p class="title">Best Pizza Dough Ever</p>
            <p class="publisher">101 Cookbooks</p>
*/