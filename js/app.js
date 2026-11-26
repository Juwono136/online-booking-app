$(document).ready(function () {
  // Application State
  const state = {
    selectedCategory: "all",
    selectedVehicleId: "brio-rs",
    rentalDays: 3,
    isAuthenticated: false,
    userEmail: null,
  };

  // Format numbers into Indonesian Rupiah (e.g., Rp 350.000)
  function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
  }

  // Format YYYY-MM-DD into readable "Nov 27"
  function formatShortDate(dateString) {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // Calculate inclusive rental days and update UI labels
  function updateDateCalculation() {
    const pickupVal = $("#pickup-date").val();
    const returnVal = $("#return-date").val();

    if (!pickupVal || !returnVal) return;

    const start = new Date(pickupVal + "T00:00:00");
    const end = new Date(returnVal + "T00:00:00");

    // Enforce return date >= pickup date
    if (end < start) {
      $("#return-date").val(pickupVal);
      state.rentalDays = 1;
    } else {
      const diffTime = Math.abs(end - start);
      state.rentalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const dayLabel = state.rentalDays === 1 ? "1 Day" : `${state.rentalDays} Days`;
    $("#hero-duration").text(dayLabel);
    $("#catalog-date-badge").text(
      `${formatShortDate($("#pickup-date").val())} – ${formatShortDate($("#return-date").val())} (${dayLabel})`,
    );

    updateCheckoutBar();
  }

  // Render Fleet Cards based on active category filter
  function renderFleetCatalog() {
    const $grid = $("#fleet-grid");
    $grid.empty();

    const filteredVehicles = FLEET_INVENTORY.filter(function (vehicle) {
      if (state.selectedCategory === "all") return true;
      return vehicle.category === state.selectedCategory;
    });

    $.each(filteredVehicles, function (_, vehicle) {
      const isSelected = vehicle.id === state.selectedVehicleId ? "selected" : "";
      const cardHtml = `
        <article class="vehicle-card ${isSelected}" data-id="${vehicle.id}">
          <div>
            <div class="vehicle-card-top">
              <div>
                <h3 class="vehicle-name">${vehicle.name}</h3>
                <p class="vehicle-specs">${vehicle.specs}</p>
              </div>
              <span class="badge-available">Available</span>
            </div>
            <div class="vehicle-image-box">
              <img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy" />
            </div>
          </div>
          <div class="vehicle-card-bottom">
            <div class="vehicle-price">
              ${formatRupiah(vehicle.dailyRate)} <span>/ day</span>
            </div>
            <button type="button" class="btn btn-primary btn-reserve" data-id="${vehicle.id}">
              Reserve Unit
            </button>
          </div>
        </article>
      `;
      $grid.append(cardHtml);
    });
  }

  // Synchronize Bottom Checkout Hold Bar with selected vehicle & duration
  function updateCheckoutBar() {
    const vehicle =
      FLEET_INVENTORY.find((v) => v.id === state.selectedVehicleId) || FLEET_INVENTORY[0];
    const totalCost = vehicle.dailyRate * state.rentalDays;
    const dayLabel = state.rentalDays === 1 ? "1 Day" : `${state.rentalDays} Days`;

    $("#checkout-summary-title").text(`${vehicle.name} · ${dayLabel} (10-min inventory hold)`);
    $("#checkout-total-price").text(formatRupiah(totalCost));
  }

  // Reusable Modal Helper
  function openModal(title, bodyHtml) {
    $("#modal-title").text(title);
    $("#modal-body").html(bodyHtml);
    $("#app-modal").removeAttr("hidden");
  }

  function closeModal() {
    $("#app-modal").attr("hidden", true);
  }

  // --- Event Listeners (jQuery) ---

  // 1. Date Change & Form Submit
  $("#pickup-date, #return-date").on("change", updateDateCalculation);

  $("#date-search-form").on("submit", function (e) {
    e.preventDefault();
    updateDateCalculation();
    $("html, body").animate(
      {
        scrollTop: $("#fleet-section").offset().top - 88,
      },
      350,
    );
  });

  // 2. Category Filter Tabs
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    state.selectedCategory = $(this).data("category");
    renderFleetCatalog();
  });

  // 3. Reserve Unit Button (Event Delegation for dynamic cards)
  $("#fleet-grid").on("click", ".btn-reserve", function () {
    state.selectedVehicleId = $(this).data("id");
    renderFleetCatalog();
    updateCheckoutBar();

    $("html, body").animate(
      {
        scrollTop: $("#checkout-bar").offset().top - 100,
      },
      350,
    );
  });

  // 4. Google Sign-In & Sign Up Modals
  $("#btn-google-signin").on("click", function () {
    state.isAuthenticated = true;
    state.userEmail = "raka.pratama@gmail.com";
    $(this).html("<span>✓ raka.pratama@gmail.com</span>");
    openModal(
      "Google SSO Connected",
      "<p>You are now signed in as <strong>raka.pratama@gmail.com</strong>. Your selected vehicle hold is linked to your account.</p>",
    );
  });

  $("#btn-signup").on("click", function () {
    openModal(
      "Create RodaRent Account",
      `
        <p>Register to lock your vehicle and receive instant digital QR pickup tickets.</p>
        <form id="signup-form">
          <input type="text" class="modal-input" placeholder="Full Name" required />
          <input type="email" class="modal-input" id="signup-email" placeholder="Email Address" required />
          <input type="password" class="modal-input" placeholder="Password" required />
          <button type="submit" class="btn btn-primary btn-block">Create Account</button>
        </form>
      `,
    );
  });

  $(document).on("submit", "#signup-form", function (e) {
    e.preventDefault();
    const email = $("#signup-email").val();
    state.isAuthenticated = true;
    state.userEmail = email;
    $("#btn-google-signin").html(`<span>✓ ${email}</span>`);
    closeModal();
  });

  // 5. Show Active QR Ticket Modal
  $("#btn-show-qr").on("click", function () {
    openModal(
      "Digital Pickup Ticket · RD-2026-8841",
      `
        <p>Present this verified booking code at the RodaRent pickup counter:</p>
        <div style="text-align:center; padding: 16px; background:#fdf4f3; border-radius:12px; margin-bottom:12px;">
          <div style="font-family:monospace; font-size:1.25rem; font-weight:700; color:#88131d;">[ QR: RD-2026-8841 ]</div>
          <div style="font-size:0.85rem; margin-top:6px;"><strong>Honda Vario 160</strong> &bull; Nov 27–29</div>
        </div>
      `,
    );
  });

  // 6. Proceed to Payment Gateway Gate
  $("#btn-proceed-payment").on("click", function () {
    if (!state.isAuthenticated) {
      openModal(
        "Sign In Required",
        "<p>Please sign in with <strong>Google Sign-In</strong> or create an account before proceeding to the payment gateway.</p>",
      );
      return;
    }

    const vehicle = FLEET_INVENTORY.find((v) => v.id === state.selectedVehicleId);
    const total = formatRupiah(vehicle.dailyRate * state.rentalDays);
    openModal(
      "Payment Gateway Checkout",
      `
        <p>Initializing secure payment session for <strong>${vehicle.name}</strong> (${state.rentalDays} days).</p>
        <p style="font-size:1.1rem; font-weight:700; color:#88131d;">Total Due: ${total}</p>
        <button type="button" class="btn btn-primary btn-block" id="btn-confirm-mock-pay">Simulate Payment Success</button>
      `,
    );
  });

  $(document).on("click", "#btn-confirm-mock-pay", function () {
    closeModal();
    alert("Payment confirmed! Your digital booking ticket is now available in your dashboard.");
  });

  // Close Modal Handlers
  $("#btn-close-modal").on("click", closeModal);
  $("#app-modal").on("click", function (e) {
    if (e.target === this) closeModal();
  });

  // Initial Render on Page Load
  updateDateCalculation();
  renderFleetCatalog();
});
