import { menuArray } from "./data.js";

// State management for orders
const orderItems = [];

function addToOrder(itemId) {
    const menuItem = menuArray.find(item => item.id === itemId);
    if (menuItem) {
        orderItems.push(menuItem);
        renderOrder();
        console.log(`Added ${menuItem.name} to order`);
    }
}

function removeFromOrder(index) {
    orderItems.splice(index, 1);
    renderOrder();
}

function handlePaymentSubmit(event, total) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    
    // Hide payment form
    document.getElementById('payment-modal').style.display = 'none';
    
    // Show thank you message
    renderThankYouMessage(name);
    
    // Clear order
    orderItems.length = 0;
    renderOrder();
}

function renderThankYouMessage(name) {
    const orderSection = document.querySelector('.order');
    if (!orderSection) return;
    
    // Generate a random order number
    const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    orderSection.innerHTML = `
        <div class="thank-you-message" style="
            text-align: center;
            padding: 2rem;
            background-color: #ECFDF5;
            border-radius: 12px;
            margin: 2rem auto;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: slideDown 0.5s ease-out;
        ">
            <div style="
                width: 60px;
                height: 60px;
                background-color: #16DB99;
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: scaleIn 0.5s ease-out;
            ">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
            </div>
            <h2 style="
                color: #16DB99;
                margin-bottom: 1rem;
                font-size: 1.5rem;
                font-weight: 600;
            ">Thanks, ${name}!</h2>
            <p style="
                color: #065F46;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            ">Your order is confirmed!</p>
            <p style="
                color: #065F46;
                margin-bottom: 1.5rem;
                font-size: 0.9rem;
            ">Order #${orderNumber}</p>
            <p style="
                background-color: white;
                padding: 1rem;
                border-radius: 8px;
                color: #374151;
                font-size: 0.9rem;
            ">We'll start preparing your delicious meal right away!</p>
        </div>
    `;

    // Add CSS animation keyframes if they don't exist
    if (!document.getElementById('thank-you-animations')) {
        const style = document.createElement('style');
        style.id = 'thank-you-animations';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes scaleIn {
                from {
                    transform: scale(0);
                }
                to {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function renderPaymentModal(total) {
    const modal = document.getElementById('payment-modal') || document.createElement('div');
    modal.id = 'payment-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 500px;">
            <h2 style="margin-bottom: 1rem;">Enter payment details</h2>
            <form id="payment-form">
                <input type="text" name="name" placeholder="Enter your name" required 
                    style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                <input type="text" name="card" placeholder="Enter card number" required 
                    style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                <input type="text" name="cvv" placeholder="Enter CVV" required 
                    style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                <button type="submit" 
                    style="width: 100%; padding: 1rem; background: #16DB99; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Pay $${total}
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (e) => handlePaymentSubmit(e, total));
}

function renderOrder() {
    const orderSection = document.querySelector('.order');
    if (!orderSection) return;

    if (orderItems.length === 0) {
        orderSection.innerHTML = `
            <h3 class="order-title">Your Order</h3>
            <p style="text-align: center; color: #666;">No items in order yet</p>
        `;
        return;
    }

    let orderHtml = `<h3 class="order-title">Your Order</h3>`;
    
    orderItems.forEach((item, index) => {
        orderHtml += `
            <div class="order-values">
                <div class="order-value">
                    <p>${item.name}</p>
                    <button type="button" class="btn-remove" data-index="${index}">remove</button>
                </div>
                <div class="price">
                    <p>$${item.price}</p>
                </div>
            </div>
        `;
    });

    const total = orderItems.reduce((sum, item) => sum + item.price, 0);
    
    orderHtml += `
        <div class="total-ordered">
            <h3>Total price:</h3>
            <p>$${total}</p>
        </div>
        <button class="btn-complete__order">Complete order</button>
    `;

    orderSection.innerHTML = orderHtml;

    // Add event listeners for remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromOrder(index);
        });
    });

    // Add event listener for complete order button
    const completeOrderBtn = orderSection.querySelector('.btn-complete__order');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', () => {
            renderPaymentModal(total);
        });
    }
}

function renderMenu() {
    const menuContainer = document.getElementById("menu-container");
    if (!menuContainer) {
        console.error("Menu container not found!");
        return;
    }

    let html = "";
    menuArray.forEach((menuItem) => {
        html += `
            <div class="item">
                <div class="emoji">${menuItem.emoji}</div>
                <div class="property">
                    <h3>${menuItem.name}</h3>
                    <p>${menuItem.ingredients.join(', ')}</p>
                    <span>$${menuItem.price}</span>
                </div>
                <button class="btn-add__container" data-item-id="${menuItem.id}">
                    <img src="./img/add-btn.png" class="btn-add" alt="add">
                </button>
            </div>`;
    });
    
    menuContainer.innerHTML = html;

    // Add event listeners for add buttons using event delegation
    menuContainer.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.btn-add__container');
        if (addBtn) {
            const itemId = parseInt(addBtn.dataset.itemId);
            addToOrder(itemId);
        }
    });
}


// complete order function can be added here

const btnCompleteOrder = document.querySelector('.btn-complete__order');
if (btnCompleteOrder) {
    btnCompleteOrder.addEventListener('click', () => {
        // Logic to complete the order
        alert('Order completed! Thank you for your purchase.');
        orderItems.length = 0; // Clear the order
        renderOrder(); // Re-render the order section
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    renderOrder(); // Initialize empty order section
    console.log('Menu rendered with items:', menuArray.length);
});



