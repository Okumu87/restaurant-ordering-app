import { menuArray } from './data.js';

const menuContainer = document.getElementById('menu-container');

function renderMenu() {
    let menuHTML = '';
    menuArray.forEach((item) => {
        menuHTML += `

<div class="item">
       <div class="emoji">${item.emoji}</div>
        <div class="property">
            <h3>${item.name}</h3>
            <p>${item.ingredients.join(', ')}</p>
            <span>$${item.price}</span>
        </div>
          <div class="btn-add__container">
                <img src="./img/add-btn.png" class="btn-add" alt="add" data-id="${item.id}">
            </div>
    </div>
        `;
    });
    if (!menuContainer) return;
    menuContainer.innerHTML = menuHTML;
}

renderMenu();                    


const addButtons = document.querySelectorAll('.btn-add');
addButtons.forEach((button) => {
    button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        console.log('Item added with ID:', itemId);
       
    });
});