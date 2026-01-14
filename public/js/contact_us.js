const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwTLSVt2AFW5MSNEJzmM7NWG2ZwKcClcrcEYuWK2bDprkQcCi60EkDXq0M4pMl61XQe/exec";

const sendMessage = async (payload) => {
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      }
    });
    showResult(true);
  } catch (err) {
    console.log("Error: ", err);
    showResult(false);
  }
};

function showResult(success) {
  const resultBox = document.getElementById("formResult");
  const resultText = document.getElementById("resultText");
  const resultIcon = document.getElementById("resultIcon");
  resultBox.classList.remove("d-none");

  if (success) {
    resultIcon.innerHTML = `<i class="fas fa-envelope-open-text"></i>`;
    resultIcon.className = "result-icon result-success mb-3";
    resultText.textContent =
      "Message is sent. Thank you for connecting with AHAM.";
  } else {
    resultIcon.innerHTML = `<i class="fas fa-exclamation-triangle"></i>`;
    resultIcon.className = "result-icon result-error mb-3";
    resultText.textContent = "Something went wrong. Please try again later.";
  }
}

(function () {
  const form = document.getElementById("contactFormPage");
  const submitBtn = document.getElementById("contactSubmit");
  const overlay = document.getElementById("formOverlay");

  const params = new URLSearchParams(window.location.search);
  const vehicle = params.get("vehicle");
  const messageField = document.getElementById("c_message");

  if (vehicle && messageField) {
    messageField.value = `I would like to hire a ${vehicle}.`;
    messageField.focus();
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const payload = {
      name: document.getElementById("c_name").value,
      email: document.getElementById("c_email").value,
      phone: document.getElementById("c_phone").value,
      message: document.getElementById("c_message").value,
      address: document.getElementById("c_address").value,
    };
    overlay.classList.remove("d-none");
    submitBtn.setAttribute("disabled", true);
    await sendMessage(payload);
    form.reset();
    form.classList.remove("was-validated");
    submitBtn.setAttribute("disabled", false);
    overlay.classList.add("d-none");
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
