document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-enquiry-form");
    if (!contactForm) return;

    // Dynamic API URL resolver for local hard drive vs Vercel live environments
    const getApiUrl = (endpoint) => {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:") {
            return `http://localhost:3000/api/${endpoint}`;
        }
        return `/dashboard/api/${endpoint}`;
    };

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Gather form fields
        const nameVal = document.getElementById("c-name").value.trim();
        const phoneVal = document.getElementById("c-phone").value.trim();
        const emailVal = document.getElementById("c-email")?.value.trim() || "";
        const subjectVal = document.getElementById("c-subject").value.trim();
        const messageVal = document.getElementById("c-message").value.trim();

        // Get submit button and configure loading state
        const btnSubmit = contactForm.querySelector('button[type="submit"]');
        const originalBtnHTML = btnSubmit.innerHTML;

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Enquiry...';

        // Construct lead details
        const combinedMessage = `Subject: ${subjectVal}\nEmail: ${emailVal || "Not Provided"}\n\nMessage: ${messageVal}`;
        const leadId = "LD-" + Math.floor(100000 + Math.random() * 900000);

        const leadPayload = {
            id: leadId,
            name: nameVal,
            phone: phoneVal,
            type: "Contact Form",
            message: combinedMessage,
            date: new Date().toISOString().split('T')[0],
            status: "Unread"
        };

        try {
            // POST request to the local Next.js Leads API
            const response = await fetch(getApiUrl("leads"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(leadPayload)
            });

            if (response.ok) {
                // Clear fields and display elegant successful toast
                contactForm.reset();
                if (window.showToast) {
                    window.showToast(
                        "Enquiry Received!",
                        "Your message has been received by our clinical desk. We will call you soon.",
                        "success"
                    );
                }
            } else {
                throw new Error("API responded with an error code");
            }
        } catch (error) {
            console.warn("Local server connection offline. Stashing enquiry in localStorage cache.", error);

            // LocalStorage offline fallback storage mechanism
            const existingLeads = JSON.parse(localStorage.getItem("kishnani_leads") || "[]");
            existingLeads.push(leadPayload);
            localStorage.setItem("kishnani_leads", JSON.stringify(existingLeads));

            // Clear the form
            contactForm.reset();

            // Display fallback cached alert
            if (window.showToast) {
                window.showToast(
                    "Offline Saved!",
                    "Enquiry cached locally. Start the local server to synchronize your message.",
                    "info"
    			);
            }
        } finally {
            // Restore button visual elements
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnHTML;
        }
    });
});
