(function () {
  const form = document.getElementById("contactFormPage");
  const alertBox = document.getElementById("contactAlert");
  const spinner = document.getElementById("contactSpinner");
  const submitBtn = document.getElementById("contactSubmit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    form.reset();
    return alert("Message validated!, Not sent as its a test server.");
    spinner.classList.remove("d-none");
    submitBtn.setAttribute("disabled", "disabled");

    setTimeout(() => {
      spinner.classList.add("d-none");
      submitBtn.removeAttribute("disabled");

      alertBox.className = "alert alert-success mt-3";
      alertBox.innerHTML =
        "<strong>Thanks!</strong> Your message has been received. We will contact you shortly.";
      alertBox.classList.remove("d-none");

      form.reset();
      form.classList.remove("was-validated");

      setTimeout(() => {
        alertBox.classList.add("d-none");
      }, 6000);
    }, 1200);
  });

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