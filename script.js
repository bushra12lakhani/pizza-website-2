document.addEventListener("DOMContentLoaded", function () {
  // ===== NAVBAR ACTIVE LINK LOGIC =====
  const navItems = document.querySelectorAll(".nav-item");
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  navItems.forEach(link => {
    const linkPage = link.getAttribute("href")?.split("/").pop().toLowerCase();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", function () {
      navItems.forEach(item => item.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ===== DROPDOWN TOGGLE LOGIC =====
  const toggles = document.querySelectorAll(".dropdown-toggle");
  toggles.forEach(toggle => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const parent = this.parentElement;
      const siblings = parent.parentElement.querySelectorAll(".dropdown.open");
      siblings.forEach(sib => {
        if (sib !== parent) {
          sib.classList.remove("open");
        }
      });
      parent.classList.toggle("open");
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown.open").forEach(drop => {
      drop.classList.remove("open");
    });
  });

  // ===== FORMS (SAFE ACCESS) =====
  const orderForm = document.querySelector('#orderNowModal form');
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert("✅ Thank you! Your order has been placed successfully.");
      const orderModal = bootstrap.Modal.getInstance(document.getElementById('orderNowModal'));
      orderModal.hide();
      orderForm.reset();
    });
  }

  const bookForm = document.querySelector('#bookTableModal form');
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert("✅ Your table has been booked!");
      const bookModal = bootstrap.Modal.getInstance(document.getElementById('bookTableModal'));
      bookModal.hide();
      bookForm.reset();
    });
  }

  const inquiryForm = document.getElementById("inquiryForm");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const modal = new bootstrap.Modal(document.getElementById('inquiryThanksModal'));
      modal.show();
      inquiryForm.reset();
    });
  }

  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const modal = new bootstrap.Modal(document.getElementById('feedbackThanksModal'));
      modal.show();
      feedbackForm.reset();
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const modal = new bootstrap.Modal(document.getElementById('contactThanksModal'));
      modal.show();
      contactForm.reset();
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  let quantity = 1;
  const quantityInput = document.getElementById("quantityInput");
  const increaseBtn = document.getElementById("increaseQty");
  const decreaseBtn = document.getElementById("decreaseQty");
  const sizeOptions = document.querySelectorAll(".size-option");
  const crustOptions = document.querySelectorAll(".crust-option");
  const addonCheckboxes = document.querySelectorAll(".addon");
  const confirmAddBtn = document.getElementById("confirmAddToCart");

  // Function to get selected size price
  function getSelectedSizePrice() {
    const selectedSize = document.querySelector(".size-option:checked");
    return parseInt(selectedSize.dataset.price);
  }

  // Function to get selected crust price
  function getSelectedCrustPrice() {
    const selectedCrust = document.querySelector(".crust-option:checked");
    return parseInt(selectedCrust.dataset.price);
  }

  // Function to get total addon price
  function getAddonPrice() {
    let addonTotal = 0;
    addonCheckboxes.forEach((addon) => {
      if (addon.checked) {
        addonTotal += parseInt(addon.dataset.price);
      }
    });
    return addonTotal;
  }

  // Update Total Price
  function updateTotalPrice() {
    const sizePrice = getSelectedSizePrice();
    const crustPrice = getSelectedCrustPrice();
    const addonPrice = getAddonPrice();
    const total = (sizePrice + crustPrice + addonPrice) * quantity;
    // Only update if totalPriceEl exists
    if (document.getElementById("totalPrice")) {
      document.getElementById("totalPrice").textContent = `Rs. ${total}`;
    }
  }

  // Quantity + / -
  if (increaseBtn && decreaseBtn && quantityInput) {
    increaseBtn.addEventListener("click", () => {
      quantity++;
      quantityInput.value = quantity;
      updateTotalPrice();
    });

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
        updateTotalPrice();
      }
    });
  }

  // Handle size / crust / addons
  sizeOptions.forEach((opt) => opt.addEventListener("change", updateTotalPrice));
  crustOptions.forEach((opt) => opt.addEventListener("change", updateTotalPrice));
  addonCheckboxes.forEach((opt) => opt.addEventListener("change", updateTotalPrice));

  // Add to Cart
  confirmAddBtn.addEventListener("click", () => {
    const selectedSize = document.querySelector(".size-option:checked").value;
    const selectedCrust = document.querySelector(".crust-option:checked").value;
    const instructions = document.getElementById("specialInstructions").value;

    const selectedAddons = [];
    addonCheckboxes.forEach((addon) => {
      if (addon.checked) {
        selectedAddons.push(`${addon.value} (+Rs. ${addon.dataset.price})`);
      }
    });

    const sizePrice = getSelectedSizePrice();
    const crustPrice = getSelectedCrustPrice();
    const addonTotal = getAddonPrice();
    const total = (sizePrice + crustPrice + addonTotal) * quantity;

    const cartItem = {
      size: selectedSize,
      crust: selectedCrust,
      addons: selectedAddons,
      quantity: quantity,
      total: total,
      notes: instructions
    };

    addToSideCart(cartItem); // Your side cart function
    const modal = document.getElementById("addToCartModal");
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
    document.querySelector(".modal-backdrop")?.remove();
    quantity = 1; // reset quantity
    quantityInput.value = quantity;
  });

  // Reset when modal opens
  const cartModal = document.getElementById("addToCartModal");
  cartModal.addEventListener("show.bs.modal", () => {
    quantity = 1;
    quantityInput.value = 1;
    sizeOptions[0].checked = true;
    crustOptions[0].checked = true;
    addonCheckboxes.forEach((a) => (a.checked = false));
    document.getElementById("specialInstructions").value = "";
    updateTotalPrice();
  });
});


// Show the Add to Cart modal when any add-to-cart button is clicked
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("addToCartModal"));
    modal.show();
  });
});
