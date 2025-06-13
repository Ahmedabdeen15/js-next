const main = document.querySelector('main');
const nav = document.querySelector('nav');
const baseUrl = 'https://forkify-api.herokuapp.com/api/search?q=';

const fetchData = async (url) => {
    main.innerHTML = `
        <div class="loaderContainer">
            <span class="loader"></span>
        </div>`;
    const response = await fetch(url);
    const data = await response.json();
    displayData(data);
}

nav.addEventListener('click', (event) => {
    if(event.target.tagName === 'LI'){
        nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        event.target.classList.add('active');
        const url = baseUrl + event.target.textContent.toLowerCase();
        fetchData(url);
    }
});



function displayData(data){
    main.innerHTML = '';
    data.recipes.forEach(recipe => {
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
    // Fetch initial data
    const initialUrl = baseUrl + 'pizza';
    fetchData(initialUrl);
});
/*
<img src="http://forkify-api.herokuapp.com/images/best_pizza_dough_recipe1b20.jpg" alt="">
            <p class="title">Best Pizza Dough Ever</p>
            <p class="publisher">101 Cookbooks</p>
*/