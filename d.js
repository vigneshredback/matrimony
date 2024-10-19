const apiUrl = 'https://api.example.com/items';

// CREATE: Adding a new item
async function createItem(item) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        const data = await response.json();
        console.log('Created Item:', data);
    } catch (error) {
        console.error('Error creating item:', error);
    }
}

// READ: Fetching all items
async function getItems() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Items:', data);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// UPDATE: Updating an existing item
async function updateItem(itemId, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        const data = await response.json();
        console.log('Updated Item:', data);
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

// DELETE: Removing an item
async function deleteItem(itemId) {
    try {
        const response = await fetch(`${apiUrl}/${itemId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log(`Deleted item with ID: ${itemId}`);
        } else {
            console.error('Error deleting item:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Example usage:
const newItem = { name: 'Sample Item', price: 19.99 };
createItem(newItem);
getItems();
updateItem(1, { name: 'Updated Item', price: 24.99 });
deleteItem(1);
