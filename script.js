const input = document.getElementById('item-input');
const form = document.getElementById('item-form');
const filter = document.getElementById('filter');
const itemList = document.getElementById('item-list');
const clear = document.getElementById('clear');
const btn = document.querySelector('.btn');

let isEditMode = false;


// On submit add

function onItemSubmitAdd (e) {
    e.preventDefault()
    const newItem = input.value;
   

    if(newItem === '') {
        alert('please enter something');
        return
    }

    if(isEditMode) {

        const item = document.querySelector('.edit-mode');

        item.classList.remove('edit-mode');
        item.remove();

        removeFromLocalStorage(item.textContent)

        isEditMode = false;
    } else {
        if(checkForDubplicates(newItem)) {
            alert('That item already exists');
            return
        }
    }


    addItemToDOM(newItem)

    addToLocalStorage(newItem)
    checkUI();
    input.value = ''

}

// Check for duplicates

function checkForDubplicates(item) {
    const items = getFromLocalStorage();
    return items.includes(item)
}

// Add item to DOM

function addItemToDOM(item) {

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li);
}

// Create Button

function createButton(classes) {
    const button = document.createElement('button');
    button.classList = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon)

    return button
}

// Create Icon

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.classList = classes

    return icon
}

// On click item

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setToEditMode(e.target)
    }
}

// Set item to edit mode

function setToEditMode(item) {
    isEditMode = true;

    const items = document.querySelectorAll('.edit-mode')
    items.forEach(item => {
        item.classList.remove('edit-mode')
    })

    item.classList.add('edit-mode');
    btn.style.backgroundColor = 'lightgreen';
    btn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'


    input.value = item.textContent
}

// Remove Item

function removeItem(item) {
   if(confirm('Are you sure?')) {
    item.remove()
   }

    removeFromLocalStorage(item)

    checkUI()
}

// Clear Items

function clearItems() {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }

    clearFromLocalStorage()

    checkUI()
}

// Filter Items

function filterItems(e) {
    const text = e.target.value.toLowerCase();

    const items = document.querySelectorAll('li');


    items.forEach(item => {
        const itemText = item.textContent.toLowerCase();

        if(itemText.indexOf(text) !== -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none'
        }
    })

}

// checkUI 

function checkUI() {
    input.value = ''

    const items = document.querySelectorAll('li');

    if(items.length === 0) {
        filter.style.display = 'none';
        clear.style.display = 'none';
    } else {
        filter.style.display = 'block';
        clear.style.display = 'block';
    }

    btn.style.backgroundColor = '#333';
    btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'

}

// Add to local storage

function addToLocalStorage(item) {
    let items = getFromLocalStorage();

    items.push(item)

    localStorage.setItem('items', JSON.stringify(items))
}

// Get from local storage

function getFromLocalStorage() {
    let items;

    if(localStorage.getItem('items') === null) {
        items = []
    } else {
        items = JSON.parse(localStorage.getItem('items'))
    }

    return items
}

// Remove from local storage

function removeFromLocalStorage(item) {
    let items = getFromLocalStorage();

    items = items.filter(i => {
        i !== item
    })

    localStorage.setItem('items', JSON.stringify(items))

}

// Clear from local storage

function clearFromLocalStorage() {
    let items = getFromLocalStorage();

    items = [];

    localStorage.setItem('items', JSON.stringify(items))
}

// Display from local storage

function displayFromLocalStorage() {
    let items = getFromLocalStorage();

    items.forEach(item => {
        const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li);
    })

}


function init() {
    form.addEventListener('submit', onItemSubmitAdd);
    itemList.addEventListener('click', onClickItem);
    clear.addEventListener('click', clearItems);
    filter.addEventListener('input', filterItems);
    window.addEventListener('DOMContentLoaded', displayFromLocalStorage)

    checkUI()
}


init();