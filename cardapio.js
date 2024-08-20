const menuItems = [
    { 
        name: "Sushi de Salmão", 
        description: "Salmão fresco com arroz temperado", 
        price: 15.00, 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/1c/e6/bb/nhac-temaki.jpg" 
    },
    { 
        name: "Temaki de Atum", 
        description: "Cone de alga recheado com atum", 
        price: 20.00, 
        image: "https://www.djapa.com.br/wp-content/uploads/2019/11/temaki-atum.jpg" 
    },
    { 
        name: "Nigiri de Camarão", 
        description: "Camarão sobre arroz japonês", 
        price: 12.00, 
        image: "https://www.djapa.com.br/wp-content/uploads/2022/02/niguiri-de-camarao.jpg" 
    },
    { 
        name: "Sushi de Polvo", 
        description: "Polvo fresco sobre arroz japonês", 
        price: 18.00, 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/07/0f/c2/88/tai-zushi-restaurante.jpg" 
    },
    { 
        name: "Sashimi de Atum", 
        description: "Fatias finas de atum fresco", 
        price: 25.00, 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/04/b2/33/02/sushi-hokkai.jpg" 
    },
    { 
        name: "Sushi de Ebi", 
        description: "Camarão grelhado com arroz e molho especial", 
        price: 22.00, 
        image: "https://order.homeofseafood.com/wp-content/uploads/Ebi20Sushi.jpg" 
    },
    { 
        name: "Roll de Tempura", 
        description: "Rolo crocante com tempura de camarão", 
        price: 30.00, 
        image: "https://www.sushijunction.com/cdn/shop/products/DSC_7720-Edit_088b7cca-0fe4-4372-aaea-d84f727c8cdb.jpg?v=1662538850&width=1445" 
    },
    { 
        name: "Sushi de Unagi", 
        description: "Enguia grelhada com molho teriyaki", 
        price: 28.00, 
        image: "https://www.savorysweetspoon.com/wp-content/uploads/2023/08/Unagi-Sushi-closeup-1x1-1.jpg" 
    }
];

const menuContainer = document.getElementById('menu');
const cartItems = [];
const cartContainer = document.getElementById('cart');
const cartIcon = document.getElementById('cart-icon');
const cartItemList = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const removeAllBtn = document.getElementById('remove-all-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const notification = document.createElement('div');
notification.classList.add('notification');
document.body.appendChild(notification);

const invoice = document.getElementById('invoice');
const invoiceContent = document.getElementById('invoice-content');
const invoiceTotal = document.getElementById('invoice-total');
const downloadInvoiceBtn = document.getElementById('download-invoice');
const closeInvoiceBtn = document.getElementById('close-invoice');
const cartCountEl = document.getElementById('cart-count');

function updateCart() {
    cartItemList.innerHTML = "";
    let totalPrice = 0;

    // Contagem dos itens no carrinho
    const itemCounts = cartItems.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    for (const [name, count] of Object.entries(itemCounts)) {
        const item = menuItems.find(item => item.name === name);
        if (item) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${name} x${count} - R$ ${(count * item.price).toFixed(2)}
                <button class="increase-item">+</button>
                <button class="decrease-item">-</button>
                <button class="remove-item">Remover</button>
            `;
            li.querySelector('.increase-item').addEventListener('click', () => {
                cartItems.push(item);
                updateCart();
                showNotification(`Adicionado mais um ${name} ao carrinho!`);
            });
            li.querySelector('.decrease-item').addEventListener('click', () => {
                const index = cartItems.indexOf(item);
                if (index > -1) {
                    cartItems.splice(index, 1);
                    updateCart();
                    showNotification(`Removido um ${name} do carrinho!`);
                }
            });
            li.querySelector('.remove-item').addEventListener('click', () => {
                const index = cartItems.indexOf(item);
                while (index > -1) {
                    cartItems.splice(index, 1);
                }
                updateCart();
                showNotification(`${name} removido do carrinho!`);
            });
            cartItemList.appendChild(li);
            totalPrice += count * item.price;
        }
    }

    totalPriceEl.textContent = `Total: R$ ${totalPrice.toFixed(2)}`;
    cartCountEl.textContent = cartItems.length; // Atualizar o contador
}

menuItems.forEach(item => {
    const menuItemDiv = document.createElement('div');
    menuItemDiv.classList.add('menu-item');

    menuItemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-price">R$ ${item.price.toFixed(2)}</div>
            <button class="add-to-cart">Adicionar ao Carrinho</button>
        </div>
    `;

    menuItemDiv.querySelector('.add-to-cart').addEventListener('click', () => {
        cartItems.push(item);
        updateCart();
        showNotification(`${item.name} adicionado ao carrinho!`);
    });

    menuContainer.appendChild(menuItemDiv);
});

cartIcon.addEventListener('click', () => {
    const isVisible = cartContainer.style.display === 'block';
    cartContainer.style.display = isVisible ? 'none' : 'block';
});

removeAllBtn.addEventListener('click', () => {
    cartItems.length = 0; // Limpar o array de itens do carrinho
    updateCart();
    showNotification('Todos os itens foram removidos do carrinho!');
});

checkoutBtn.addEventListener('click', () => {
    generateInvoice(); // Gerar nota fiscal
    invoice.style.display = 'block'; // Mostrar nota fiscal
    showNotification('Pedido finalizado. Obrigado por comprar conosco!');
});

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function generateInvoice() {
    invoiceContent.innerHTML = "";
    let totalPrice = 0;

    const itemCounts = cartItems.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    for (const [name, count] of Object.entries(itemCounts)) {
        const item = menuItems.find(item => item.name === name);
        if (item) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
                <span>${name} x${count}</span>
                <span>R$ ${(count * item.price).toFixed(2)}</span>
            `;
            invoiceContent.appendChild(itemDiv);
            totalPrice += count * item.price;
        }
    }

    invoiceTotal.textContent = `Total: R$ ${totalPrice.toFixed(2)}`;
}

function downloadPDF() {
    const doc = new jsPDF();
    doc.text('Nota Fiscal', 20, 20);
    doc.setFontSize(16);
    
    let y = 30;
    const itemCounts = cartItems.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    for (const [name, count] of Object.entries(itemCounts)) {
        const item = menuItems.find(item => item.name === name);
        if (item) {
            doc.text(`${name} x${count}`, 20, y);
            doc.text(`R$ ${(count * item.price).toFixed(2)}`, 160, y);
            y += 10;
        }
    }

    doc.text(`Total: R$ ${invoiceTotal.textContent.replace('Total: ', '')}`, 20, y + 10);
    doc.save('nota_fiscal.pdf');
}

downloadInvoiceBtn.addEventListener('click', () => {
    downloadPDF();
});

closeInvoiceBtn.addEventListener('click', () => {
    invoice.style.display = 'none';
});