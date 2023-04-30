const input = document.getElementById('item-input');
const form = document.getElementById('item-form');
const filter = document.getElementById('filter');
const itemList = document.getElementById('item-list');
const clear = document.getElementById('clear');
const btn = document.querySelector('.btn');

let isEditMode

// Add Item

function onSubmitAdd(e) {
    const newItem = input.value
    if(newItem === '') {
        alert('please enter something')
        return
    }

    if(isEditMode) {
        const item = document.querySelector('.edit-mode');
        item.classList.remove('edit-mode');
        item.remove();

        isEditMode = false
    } else {
        if(checkForDuplicates(newItem)) {
            alert('this item already exists')
            return
        }
    }

    addItemToDom(newItem)

    addItemToLocalStorage(newItem)
    checkUI()
    input.value = ''
    e.preventDefault()
}

function checkForDuplicates(item) {
    const items = localStorage.getItem('items');
    return items.includes(item)
}

// Add item to dom

function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    button = createButton('remove-item btn-link text-red');
    li.appendChild(button)
    itemList.appendChild(li)

    checkUI()
}

// Create Button

function createButton(classes) {
    const button = document.createElement('button');
    button.classList = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    
    return button

}

// Create Icon

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.classList = classes

    return icon
}

// Remove Item

function removeItem(item) {
    
        if(confirm('Are you sure?')) {
            item.remove();
        }
        
        removeFromLocalStorage(item.textContent)
        checkUI()
    }
    
function onClickItem(e) {
        
        
        if(e.target.classList.contains('fa-xmark')) {
            removeItem(e.target.parentElement.parentElement)
        } else {
            setToEditMode(e.target)
        }
        
}

function setToEditMode(item) {
    isEditMode = true;

    const items = document.querySelectorAll('li')
    items.forEach(item => {
        item.classList.remove('edit-mode')
    })

    item.classList.add('edit-mode')
    btn.style.backgroundColor = 'lightgreen';
    btn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    input.value = item.textContent;
}

// Filter Items

function filterItems(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('li').forEach(item => {
        const itemText = item.textContent.toLowerCase();

        if(itemText.indexOf(text) !== -1) {
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'
        }
    })
}

// Clear items

function clearItems(e) {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }

    clearFromLocalStorage()
    checkUI()
}   

// checkUI

function checkUI() {
    const items = document.querySelectorAll('li');

    if(items.length <= 0) {
        clear.style.display = 'none'
        filter.style.display = 'none'
    } else {
        clear.style.display = 'block'
        filter.style.display = 'block'
    }

    btn.style.backgroundColor = '#333';
    btn.innerHTML = '<i class ="fa-solid fa-plus"></i> Add Item'
}


// Get Items from Storage 

function getItemsFromStorage() {
    let items;

    if(localStorage.getItem('items') === null) {
        items = []
    } else {
        items = JSON.parse(localStorage.getItem('items'))
    }

    return items
}

function addItemToLocalStorage(item) {
    let items = getItemsFromStorage();

    items.push(item);

    localStorage.setItem('items', JSON.stringify(items))
}

function removeFromLocalStorage(item) {
    let items = getItemsFromStorage();

    items = items.filter(i => i !== item)

    localStorage.setItem('items', JSON.stringify(items))
}

function clearFromLocalStorage() {
    let items = getItemsFromStorage();

    items = [];

    localStorage.setItem('items', JSON.stringify(items))
}

function displayFromLocalStorage() {
    const items = getItemsFromStorage();

    items.forEach(item => {
        addItemToDom(item)
    })
}

function addEventListeners() {
    form.addEventListener('submit', onSubmitAdd);
    itemList.addEventListener('click', onClickItem);
    clear.addEventListener('click', clearItems);
    filter.addEventListener('input', filterItems);
    window.addEventListener('DOMContentLoaded', displayFromLocalStorage)
}

checkUI()
addEventListeners()