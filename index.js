import {menuArray} from '/data.js'
import { v4 as uuidv4 } from 'uuid'



const menu = document.getElementById('menu')
const checkoutSection = document.getElementById('checkout-section')
const checkoutItems = document.getElementById('checkout-items')
const checkoutItemsPrice = document.getElementById('checkout-items-price')
const paymentSection = document.getElementById('payment-section')
const paymentForm = document.getElementById('payment-form')
const thanksSection = document.getElementById('thanks-section')

let menuHTML = ''
let checkoutItemsHTML = ''
let checkoutItemsArray = []
let checkoutPrice = 0

   document.addEventListener("click", function(e){
         if(e.target.dataset.addItem){
            addCheckoutItem(e.target.dataset.addItem)
         }else if(e.target.dataset.removeItem){
        removeCheckoutItem(e.target.dataset.removeItem)
        } else if(e.target.dataset.compOrderBtn){
             if(checkoutItemsArray === undefined || checkoutItemsArray.length == 0){
            alert("Please add items to your order before placing it.")
            return
        }   else{
            paymentSection.style.display = 'block'
        }
    }
         
   })
   
   
   paymentForm.addEventListener('submit', function(e){
    e.preventDefault()
    paymentSection.style.display = 'none'
    checkoutSection.style.display = 'none'
    thanksSection.style.display = 'flex'
    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get('customer-name')
    thanksSection.innerHTML = `
    <div class="thanks-section-html">
        <h2>Thanks, ${name}! your order is on its way!</h2>
    </div>`
    clearOrder()
})


function renderMenu(){
    menuArray.map(function(menuItems){
        menuHTML += `
                  <div class="item">
            <div class="item-details">
                <div class="item-emoji">${menuItems.emoji}</div>
                <div>
                    <h2 class"item-title">${menuItems.name}</h2>
                    <p class="item-desc">${menuItems.ingredients}</p>
                    <h3>$${menuItems.price}</h3>
                </div>
            </div>
            <div class="item-button"><button data-add-item="${menuItems.id}">+</button></div>
        </div>
        
        `
        
    })
    
   menu.innerHTML = menuHTML
    
}

    function addCheckoutItem(addId){
    checkoutSection.style.display = 'flex'
    menuArray.forEach(function(item){
        if(item.id.toString() === addId){
            checkoutItemsArray.push(
        {
            name: item.name,
            ingredients: [item.ingredients],
            price: item.price,
            emoji: item.emoji,
            uuid: uuidv4() 
        })
            checkoutPrice += item.price
        }
    })
    renderCheckoutItems()
}
    function removeCheckoutItem(removeId){
    const index = checkoutItemsArray.findIndex(item => item.uuid === removeId)
    if(index !== -1){
        checkoutItemsArray.splice(index, 1)
        renderCheckoutItems()
    }
    checkoutItemsArray = checkoutItemsArray.filter(function(item){
        return item.uuid !== removeId
    })
    renderCheckoutItems()
    checkoutPrice = checkoutItemsArray.reduce(function(total, item){
        return total + item.price
    }, 0)
    checkoutItemsPrice.textContent = `$${checkoutPrice}`

}

function renderCheckoutItems(){
    checkoutItemsHTML = ``
    checkoutItemsArray.forEach(function(item){
        checkoutItemsHTML += `
        <div class="checkout-item-wrapper">
            <div class="checkout-item-detail">
                <h2 class="checkout-item-title">${item.name}</h2>
                <p class="checkout-item-remove" data-remove-item="${item.uuid}">remove</p>
            </div>
            <h3>$${item.price}</h3>
        </div>
        `
    })
    checkoutItemsPrice.textContent = `$${checkoutPrice}`
    document.querySelector('.checkout-items').innerHTML = checkoutItemsHTML
}

function clearOrder() {
    setTimeout(function(){
        checkoutItemsArray = [];
        checkoutPrice = 0;
        menuHTML = '';
        checkoutItemsHTML = '';
        checkoutItems.innerHTML = ''; 
        thanksSection.innerHTML = '';
        thanksSection.style.display = 'none'
        paymentForm.reset()
    }, 5000)
}


renderMenu()