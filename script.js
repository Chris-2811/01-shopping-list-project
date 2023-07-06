const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const filter = document.getElementById('filter');
const itemList = document.getElementById('item-list');
const clear = document.getElementById('clear');

const btn = document.querySelector('.btn');

let editMode = false;

// Add item
function onAddItemSubmit(e) {
  e.preventDefault();
  newItem = input.value;

  if (input.value === '') {
    alert('Please enter an item');
    return;
  }

  if (editMode) {
    if (checkForDuplicates(newItem)) {
      alert('That item already exists!');
      return;
    } else {
      const itemToEdit = itemList.querySelector('.edit-mode');
      itemToEdit.classList.remove('edit-mode');
      itemToEdit.remove();
      editMode = false;
    }
  } else {
    if (checkForDuplicates(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  addItemToStorage(newItem);
  addToDOM(newItem);
  updateUI();
}

// Check for duplicates
function checkForDuplicates(item) {
  const items = getItemsFromStorage();

  return items.includes(item);
}

// Add item to dom
function addToDOM(newItem) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);

  input.value = '';
}

// Create Button
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);

  return button;
}

// Create Icon
function createIcon(classes) {
  const icon = document.createElement('icon');
  icon.className = classes;

  return icon;
}

// On item click
function onItemClick(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?'))
      removeItem(e.target.parentElement.parentElement);
  } else {
    setToEditMode(e.target);
  }
}

// Set to edit mode
function setToEditMode(item) {
  const items = document.querySelectorAll('li');
  items.forEach((item) => {
    item.classList.remove('edit-mode');
  });
  item.classList.add('edit-mode');
  input.value = item.textContent;
  btn.style.backgroundColor = 'green';
  btn.innerHTML = '<i class="fa fa-pen"></i> Update Item';

  editMode = true;
}

// Remove Item
function removeItem(item) {
  item.remove();
  removeItemFromStorage(item.textContent);
  updateUI();
}

// Clear Items
function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  clearStorage();
  updateUI();
}

// Filter Items
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  console.log(text);

  document.querySelectorAll('li').forEach((item) => {
    const itemText = item.textContent.toLowerCase();

    if (itemText.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Update the UI
function updateUI() {
  const items = document.querySelectorAll('li');

  if (items.length < 1) {
    clear.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clear.style.display = 'block';
    clear.style.display = 'block';
  }

  btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  btn.style.backgroundColor = '#000';
}

// Locale Storage

// Get items from local Storage
function getItemsFromStorage() {
  let items;

  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  return items;
}

// Add item to local storage
function addItemToStorage(item) {
  let items = getItemsFromStorage();

  items.push(item);

  localStorage.setItem('items', JSON.stringify(items));
}

// Remove item from local storage
function removeItemFromStorage(i) {
  let items = getItemsFromStorage();

  items.forEach((item, index) => {
    if (item === i) {
      items.splice(index, 1);
    }
  });

  localStorage.setItem('items', JSON.stringify(items));
}

// Clear local storage
function clearStorage() {
  localStorage.clear();
}

// Display from local storage
function displayFromLocalStorage() {
  let items = getItemsFromStorage();

  items.forEach((item) => {
    addToDOM(item);
  });
}

// Add Eventlistener
function init() {
  form.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onItemClick);
  clear.addEventListener('click', clearItems);
  filter.addEventListener('input', filterItems);
  window.addEventListener('DOMContentLoaded', displayFromLocalStorage);

  updateUI();
}

init();
