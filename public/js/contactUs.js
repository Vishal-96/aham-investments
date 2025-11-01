// Basic client-side validation + demo submit for the contact form
(function () {
  const form = document.getElementById("contactFormPage");
  const alertBox = document.getElementById("contactAlert");
  const spinner = document.getElementById("contactSpinner");
  const submitBtn = document.getElementById("contactSubmit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // simple validity check
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // show spinner & disable
    spinner.classList.remove("d-none");
    submitBtn.setAttribute("disabled", "disabled");

    // demo send (simulate network)
    setTimeout(() => {
      spinner.classList.add("d-none");
      submitBtn.removeAttribute("disabled");

      // show success
      alertBox.className = "alert alert-success mt-3";
      alertBox.innerHTML =
        "<strong>Thanks!</strong> Your message has been received. We will contact you shortly.";
      alertBox.classList.remove("d-none");

      // reset form
      form.reset();
      form.classList.remove("was-validated");

      // auto hide after 6s
      setTimeout(() => {
        alertBox.classList.add("d-none");
      }, 6000);
    }, 1200);
  });

  // small enhancement: move focus to first invalid
  form.addEventListener(
    "invalid",
    function (e) {
      e.preventDefault();
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
    },
    true
  );
})();