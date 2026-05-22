document.addEventListener("DOMContentLoaded", () => {
    const wizardForm = document.getElementById("appointment-wizard-form");
    if (!wizardForm) return;

    const steps = document.querySelectorAll(".form-step");
    const stepIndicators = document.querySelectorAll(".wizard-step");
    const btnPrev = document.querySelector(".btn-wizard-prev");
    const btnNext = document.querySelector(".btn-wizard-next");
    const btnSubmit = document.querySelector(".btn-wizard-submit");
    const successContainer = document.getElementById("booking-success-container");
    const formContainer = document.getElementById("booking-form-container");

    let currentStep = 0;

    // PRE-FILL FIELDS FROM URL PARAMETERS (Premium Multi-Page Coordination)
    const fillParamsFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const deptParam = urlParams.get("dept");
        const docParam = urlParams.get("doc");
        const packageParam = urlParams.get("package");

        if (deptParam) {
            const deptSelect = document.getElementById("department");
            if (deptSelect) {
                // Find matching option
                for (let option of deptSelect.options) {
                    if (option.value.toLowerCase() === deptParam.toLowerCase() || option.text.toLowerCase().includes(deptParam.toLowerCase())) {
                        deptSelect.value = option.value;
                        // Trigger change event to load appropriate doctors
                        deptSelect.dispatchEvent(new Event("change"));
                        break;
                    }
                }
            }
        }

        if (docParam) {
            // Wait slightly for department doctors list to update if needed
            setTimeout(() => {
                const docSelect = document.getElementById("doctor");
                if (docSelect) {
                    for (let option of docSelect.options) {
                        if (option.text.toLowerCase().includes(docParam.toLowerCase())) {
                            docSelect.value = option.value;
                            break;
                        }
                    }
                }
            }, 100);
        }

        if (packageParam) {
            const messageTextarea = document.getElementById("message");
            if (messageTextarea) {
                let packageName = "";
                if (packageParam.toLowerCase().includes("basic")) {
                    packageName = "Basic Wellness Checkup (₹999)";
                } else if (packageParam.toLowerCase().includes("executive")) {
                    packageName = "Executive Health Package (₹2,499)";
                } else if (packageParam.toLowerCase().includes("women")) {
                    packageName = "Women's Health Shield (₹2,999)";
                } else {
                    packageName = packageParam;
                }
                messageTextarea.value = `Hi, I would like to book the preventive health package: ${packageName}.`;
            }
        }
    };

    // UPDATE STEP DISPLAY
    const updateStepDisplay = () => {
        steps.forEach((step, idx) => {
            if (idx === currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });

        stepIndicators.forEach((indicator, idx) => {
            if (idx <= currentStep) {
                indicator.classList.add("active");
            } else {
                indicator.classList.remove("active");
            }
        });

        // Toggle buttons
        if (currentStep === 0) {
            btnPrev.style.display = "none";
        } else {
            btnPrev.style.display = "inline-flex";
        }

        if (currentStep === steps.length - 1) {
            btnNext.style.display = "none";
            btnSubmit.style.display = "inline-flex";
        } else {
            btnNext.style.display = "inline-flex";
            btnSubmit.style.display = "none";
        }
    };

    // FORM STEP FIELD VALIDATION
    const validateStep = (stepIdx) => {
        let isValid = true;
        const currentStepEl = steps[stepIdx];
        const requiredInputs = currentStepEl.querySelectorAll("[required]");

        requiredInputs.forEach(input => {
            // Reset custom error if present
            input.style.borderColor = "";
            const formGroup = input.closest(".form-group");
            const existingErr = formGroup.querySelector(".error-text");
            if (existingErr) existingErr.remove();

            if (!input.value.trim()) {
                isValid = false;
                markInvalid(input, "This field is required.");
            } else if (input.type === "tel") {
                const indianPhonePattern = /^[6-9]\d{9}$/;
                if (!indianPhonePattern.test(input.value.trim())) {
                    isValid = false;
                    markInvalid(input, "Please enter a valid 10-digit mobile number.");
                }
            } else if (input.type === "date") {
                const selectedDate = new Date(input.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    isValid = false;
                    markInvalid(input, "Appointment date cannot be in the past.");
                }
            }
        });

        return isValid;
    };

    const markInvalid = (input, message) => {
        input.style.borderColor = "var(--emergency)";
        const formGroup = input.closest(".form-group");
        const errorText = document.createElement("span");
        errorText.className = "error-text";
        errorText.style.color = "var(--emergency)";
        errorText.style.fontSize = "0.75rem";
        errorText.style.fontWeight = "600";
        errorText.style.marginTop = "4px";
        errorText.textContent = message;
        formGroup.appendChild(errorText);
    };

    // BUTTON EVENT LISTENERS
    btnNext.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStepDisplay();
            // Scroll to wizard top
            document.querySelector(".appointment-wizard-wrapper").scrollIntoView({ behavior: "smooth" });
        } else {
            if (window.showToast) {
                window.showToast("Validation Error", "Please fill all required fields correctly before moving next.", "error");
            }
        }
    });

    btnPrev.addEventListener("click", () => {
        currentStep--;
        updateStepDisplay();
    });

    // DEPARTMENT -> DOCTOR AUTO SELECTION DYNAMICS
    const deptSelect = document.getElementById("department");
    const docSelect = document.getElementById("doctor");

    const deptDoctors = {
        "General Medicine": [
            { name: "Dr. Lal Kumar Kishnani (MD - Chief Physician)", val: "dr-lal-kishnani" },
            { name: "Dr. Sandeep Malviya (MD - Consultant)", val: "dr-sandeep-malviya" }
        ],
        "Gynecology": [
            { name: "Dr. Anita Sharma (MD, DGO - Gynaecologist)", val: "dr-anita-sharma" },
            { name: "Dr. Preeti Sachdeva (MBBS - Consultant)", val: "dr-preeti-sachdeva" }
        ],
        "Pediatrics": [
            { name: "Dr. Amit Verma (MD - Pediatrician)", val: "dr-amit-verma" }
        ],
        "Orthopedics": [
            { name: "Dr. Devendra Kushwaha (MS - Orthopedic Surgeon)", val: "dr-devendra-kushwaha" },
            { name: "Dr. Vikas Choudhary (MS - Trauma Specialist)", val: "dr-vikas-choudhary" }
        ],
        "Surgery": [
            { name: "Dr. Rajesh Kishnani (MS - Chief Surgeon)", val: "dr-rajesh-kishnani" }
        ],
        "Cardiology": [
            { name: "Dr. Sunita Patel (MD, DM - Cardiologist)", val: "dr-sunita-patel" }
        ],
        "Ophthalmology": [
            { name: "Dr. Mansi Kishnani (MS - Eye Surgeon)", val: "dr-mansi-kishnani" }
        ]
    };

    if (deptSelect && docSelect) {
        deptSelect.addEventListener("change", () => {
            const selectedDept = deptSelect.value;
            // Clear existing options except default
            docSelect.innerHTML = '<option value="">Select Doctor</option>';

            if (selectedDept && deptDoctors[selectedDept]) {
                deptDoctors[selectedDept].forEach(doc => {
                    const opt = document.createElement("option");
                    opt.value = doc.val;
                    opt.text = doc.name;
                    docSelect.appendChild(opt);
                });
            } else {
                // Default fallback: show all doctors
                Object.values(deptDoctors).flat().forEach(doc => {
                    const opt = document.createElement("option");
                    opt.value = doc.val;
                    opt.text = doc.name;
                    docSelect.appendChild(opt);
                });
            }
        });
    }

    // FORM SUBMISSION (LOCAL STORAGE CACHE & SIMULATED API CALLS)
    wizardForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            if (window.showToast) {
                window.showToast("Validation Error", "Please resolve errors before submitting.", "error");
            }
            return;
        }

        // Gather form data
        const patientName = document.getElementById("name").value.trim();
        const patientPhone = document.getElementById("phone").value.trim();
        const department = document.getElementById("department").value;
        const doctorVal = document.getElementById("doctor").value;
        const doctorText = document.getElementById("doctor").options[document.getElementById("doctor").selectedIndex].text;
        const apptDate = document.getElementById("date").value;
        const apptTime = document.getElementById("time")?.value || "10:00 AM - 12:00 PM";
        const message = document.getElementById("message").value.trim();

        // Disable submit button and show loading state
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Booking...';

        setTimeout(() => {
            // Generate mock booking ID
            const bookingId = "KH-" + Math.floor(100000 + Math.random() * 900000);

            // Store in LocalStorage
            const bookingRecord = {
                bookingId,
                patientName,
                patientPhone,
                department,
                doctor: doctorText,
                apptDate,
                apptTime,
                message,
                createdAt: new Date().toISOString()
            };

            const existingBookings = JSON.parse(localStorage.getItem("kishnani_bookings") || "[]");
            existingBookings.push(bookingRecord);
            localStorage.setItem("kishnani_bookings", JSON.stringify(existingBookings));

            // Render Success details
            document.getElementById("summary-booking-id").textContent = bookingId;
            document.getElementById("summary-patient-name").textContent = patientName;
            document.getElementById("summary-phone").textContent = patientPhone;
            document.getElementById("summary-department").textContent = department;
            document.getElementById("summary-doctor").textContent = doctorText;
            document.getElementById("summary-date").textContent = apptDate;
            document.getElementById("summary-time").textContent = apptTime;

            // Trigger animations
            formContainer.style.display = "none";
            successContainer.style.display = "block";

            if (window.showToast) {
                window.showToast(
                    "Appointment Scheduled!",
                    `Successfully booked for ${patientName} on ${apptDate}.`,
                    "success"
                );
            }

            // Scroll success block into view
            document.querySelector(".appointment-wizard-wrapper").scrollIntoView({ behavior: "smooth" });
        }, 1500); // 1.5 second artificial load delay for premium feeling
    });

    // Initialize Layout & URL Checks
    updateStepDisplay();
    fillParamsFromURL();
});
