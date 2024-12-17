// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Store references to elements in the html
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const addToBasketButtons = document.querySelectorAll('.add-to-basket');
    const basketContainer = document.querySelector('.basket-container');
    const totalPriceElement = document.querySelector('.total-price');
    const basketCount = document.querySelector('.basket-count');
    const basketCountMobile = document.querySelector('.basket-count-mobile'); 
    const finalCheckoutButton = document.querySelector('.checkout-btn-final');
    
    // Function to show the 'Added to basket' popup
    function showAddedToBasketPopup() {
        const addedToBasketPopup = document.getElementById('addedToBasketPopup');
        addedToBasketPopup.style.display = 'block';
        setTimeout(() => {
            addedToBasketPopup.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }

    // Function to clear local storage and reset form fields
    function clearLocalStorageAndForm() {
        localStorage.removeItem('basket'); // Clear local storage
        document.getElementById('checkoutForm').reset(); // Reset form fields
    }

    // Function to display the 'Order placed' popup
    function showOrderPlacedPopup() {
        const orderPlacedPopup = document.getElementById('checkoutPopup');
        orderPlacedPopup.style.display = 'block';
        setTimeout(() => {
            orderPlacedPopup.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }

    // Show drop down menu when burger item clicked
    menuBtn.addEventListener('click', (event) => {
        // Check if the clicked element is not the basket icon for mobile
        if (!event.target.closest('.basket-icon-mobile')) {
            navLinks.classList.toggle('active');
        }
    });

    // Hide the dropdown menu when you click anywhere but the dropdown menu
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickInsideMenuBtn = menuBtn.contains(event.target);

        if (!isClickInsideNav && !isClickInsideMenuBtn && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });



    // Retrieve basket items from local storage
    let basketItems = JSON.parse(localStorage.getItem('basket')) || [];

    // Function to update the basket count
    function updateBasketCount() {
        const totalCount = basketItems.reduce((acc, item) => acc + item.quantity, 0);
        basketCount.textContent = totalCount;
        basketCountMobile.textContent = totalCount; // Update basket count in mobile menu
    }

    // Function to update the basket UI
    function updateBasketUI() {
        if (!basketContainer) return; // Check if basketContainer is null

        // Clear existing basket items
        basketContainer.innerHTML = '';

        // Loop through the basekt items, creating a HTML div ffor each one
        basketItems.forEach(item => {
            const basketItem = document.createElement('div');
            basketItem.classList.add('basket-item');

            // Calculate subtotal for the item
            const subtotal = item.price * item.quantity;

            // Populate the HTML in the basketItem div
            basketItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Price: £${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Subtotal: £${subtotal.toFixed(2)}</p>
                    <div class="quantity">
                        <button class="decrease-quantity-btn" data-id="${item.id}">-</button>
                        <input type="number" min="1" value="${item.quantity}" disabled>
                        <button class="increase-quantity-btn" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            `;
            
            // Append basket item to parent container
            basketContainer.appendChild(basketItem);
        });

        // Update total price
        const totalPrice = basketItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        totalPriceElement.textContent = '£' + totalPrice.toFixed(2);
 

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const itemId = this.getAttribute('data-id');
                // Filter out the item with the matching id, update basketItems array
                basketItems = basketItems.filter(item => item.id !== itemId);
                // Update local storage
                localStorage.setItem('basket', JSON.stringify(basketItems));
                updateBasketUI();
                updateBasketCount(); // Update basket count
            });
        });

        // Add event listeners to increase quantity buttons
        const increaseButtons = document.querySelectorAll('.increase-quantity-btn');
        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const itemId = this.getAttribute('data-id');
                // Find the index of the item in the basketItems array
                const itemIndex = basketItems.findIndex(item => item.id === itemId);

                // If the item exists in the basket
                if (itemIndex !== -1) {
                    // Update the quantity of the item
                    basketItems[itemIndex].quantity++;
                    // Update local storage
                    localStorage.setItem('basket', JSON.stringify(basketItems));
                    updateBasketUI();
                    updateBasketCount(); 
                }
            });
        });

        // Add event listeners to decrease quantity buttons
        const decreaseButtons = document.querySelectorAll('.decrease-quantity-btn');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const itemId = this.getAttribute('data-id');
                const itemIndex = basketItems.findIndex(item => item.id === itemId);
                if (itemIndex !== -1 && basketItems[itemIndex].quantity > 1) {
                    basketItems[itemIndex].quantity--;
                    localStorage.setItem('basket', JSON.stringify(basketItems));
                    updateBasketUI();
                    updateBasketCount(); // Update basket count
                }
            });
        });
    }

    // Add event listeners to 'Add to Basket' buttons
    addToBasketButtons.forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const id = Math.floor(Math.random() * 10000).toString(); // Generate a random ID
            const image = this.parentNode.querySelector('img').getAttribute('src');
            const existingItemIndex = basketItems.findIndex(item => item.name === name);

            // If the item already exists in the basket, increase quantity by 1
            if (existingItemIndex !== -1) {
                basketItems[existingItemIndex].quantity++;
            }
            // If the item doesn't already exist in the basket, add it
            else {
                basketItems.push({
                    id: id,
                    name: name,
                    price: price,
                    quantity: 1,
                    image: image
                });
            }

            // Update local storage and UI
            localStorage.setItem('basket', JSON.stringify(basketItems));
            updateBasketUI();
            updateBasketCount(); // Update basket count
            showAddedToBasketPopup();


        });
    });


    // Initial UI update
    updateBasketUI();
    updateBasketCount(); // Update basket count initially


});

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutBtnFinal = document.querySelector('.checkout-btn-final');
    const checkoutPopup = document.getElementById('checkoutPopup');

    // Function to validate form fields and display error messages
    function validateForm() {
        // Trim whitespace from start and end of the data
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const address = document.getElementById('address').value.trim();
        const town = document.getElementById('town').value.trim();
        const county = document.getElementById('county').value.trim();
        const postcode = document.getElementById('postcode').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        // Regular expression pattern for email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Regular expression pattern for phone number validation
        const phonePattern = /^\d{11}$/;

        // Check if any field is empty
        if (firstName === '' || lastName === '' || address === '' || town === '' || county === '' || postcode === '' || email === '' || phone === '' || cardNumber === '' || expiryDate === '' || cvv === '') {
            displayErrorMessage('All fields are required');
            return false;
        }

        // Check if email is valid
        if (!emailPattern.test(email)) {
            displayErrorMessage('Invalid email format');
            return false;
        }

        // Check if phone number is valid
        if (!phonePattern.test(phone)) {
            displayErrorMessage('Phone number must be 11 digits');
            return false;
        }

        // Check if card number is a 16-digit number
        if (!/^\d{16}$/.test(cardNumber)) {
            displayErrorMessage('Card number must be 16 digits');
            return false;
        }

        // Check if expiry date is in MM/YY format
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            displayErrorMessage('Invalid expiry date format (MM/YY)');
            return false;
        }

        // Check if expiry date is in the past
        const currentDate = new Date();
        const [month, year] = expiryDate.split('/');
        const expiryMonth = parseInt(month);
        const expiryYear = parseInt('20' + year);
        if (expiryYear < currentDate.getFullYear() || (expiryYear === currentDate.getFullYear() && expiryMonth < (currentDate.getMonth() + 1))) {
            displayErrorMessage('Card past expiry date');
            return false;
        }

        // Check if CVV is a 3-digit number
        if (!/^\d{3}$/.test(cvv)) {
            displayErrorMessage('CVV must be 3 digits');
            return false;
        }

        // If all validations pass, return true
        return true;
    }

    // Function to display error message
    function displayErrorMessage(message) {
        const errorMessageElement = document.createElement('p');
        errorMessageElement.classList.add('error-message');
        errorMessageElement.textContent = message;

        const expiryDateInput = document.getElementById('expiryDate');
        expiryDateInput.parentNode.insertBefore(errorMessageElement, expiryDateInput.nextSibling);
    }

    // Remove existing error messages when form is submitted
    function removeErrorMessages() {
        const errorMessageElements = document.querySelectorAll('.error-message');
        errorMessageElements.forEach(element => {
            element.remove();
        });
    }
    
    // Function to clear form inputs and local storage(for when checkout button is clicked)
    function clearFormAndLocalStorage() {
        checkoutForm.reset(); // Reset form inputs
        localStorage.removeItem('basket'); // Clear local storage
    }

    // Event listener for form submission
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Remove existing error messages
        removeErrorMessages();

        // Validate form fields
        if (validateForm()) {
            // Proceed with checkout process and display 'the Order Placed popup'
            checkoutPopup.style.display = 'block';
            setTimeout(function () {
                checkoutPopup.style.display = 'none';
                clearFormAndLocalStorage();
                location.reload();
            }, 2000);
        }
    });
});

