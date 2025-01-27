document.addEventListener("DOMContentLoaded", () => {
    // Lock feature: Prompt for username and password
    const lockScreen = () => {
        const credentials = [
            { username: "mariz", password: "mariz2006" },
            { username: "addarkin", password: "arkin.mel" },
            { username: "realwifenimingyu", password: "arousseau_18" },
            { username: "lucifurge", password: "09100909" },
            // 36 blank entries for additional usernames and passwords
            ...Array(36).fill({ username: "", password: "" })
        ];

        Swal.fire({
            title: "Login Required",
            html: `
                <div class="mb-3">
                    <label for="lockUsername" class="form-label">Username</label>
                    <input type="text" id="lockUsername" class="form-control" placeholder="Enter Username">
                </div>
                <div class="mb-3">
                    <label for="lockPassword" class="form-label">Password</label>
                    <input type="password" id="lockPassword" class="form-control" placeholder="Enter Password">
                    <div class="mt-2">
                        <input type="checkbox" id="toggleLockPassword" class="form-check-input">
                        <label for="toggleLockPassword" class="form-check-label">Show Password</label>
                    </div>
                </div>
            `,
            confirmButtonText: "Login",
            allowOutsideClick: false,
            preConfirm: () => {
                const username = document.getElementById("lockUsername").value.trim();
                const password = document.getElementById("lockPassword").value.trim();

                const valid = credentials.some(
                    (cred) => cred.username === username && cred.password === password
                );

                if (valid) {
                    return true;
                } else {
                    Swal.showValidationMessage("Invalid username or password");
                    return false;
                }
            },
        });

        // Toggle password visibility
        document.addEventListener("change", (e) => {
            if (e.target && e.target.id === "toggleLockPassword") {
                const passwordField = document.getElementById("lockPassword");
                passwordField.type = e.target.checked ? "text" : "password";
            }
        });
    };

    lockScreen();

    document.getElementById("shareForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form data
        const fbstate = document.getElementById("fbstate").value;
        const postLink = document.getElementById("postLink").value;
        let interval = parseFloat(document.getElementById("interval").value);
        let shares = parseFloat(document.getElementById("shares").value);

        // Ensure shares are within the 1-1 million range
        shares = Math.max(1, Math.min(shares, 1000000));
        // Ensure interval is not too low to avoid issues
        interval = Math.max(0.1, interval);

        const progressContainer = document.getElementById("progress-container");

        // Create a new progress bar for each submission
        const progressBarWrapper = document.createElement('div');
        progressBarWrapper.classList.add('mb-3');
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress');
        const progress = document.createElement('div');
        progress.classList.add('progress-bar');
        progressBar.appendChild(progress);
        progressBarWrapper.appendChild(progressBar);
        progressContainer.appendChild(progressBarWrapper);

        // Set initial width and text
        progress.style.width = '0%';
        progress.textContent = '0%';

        let completedShares = 0;

        // Send API request for each share and update progress bar
        const intervalId = setInterval(function () {
            if (completedShares < shares) {
                const progressPercentage = (completedShares + 1) / shares * 100;
                progress.style.width = `${progressPercentage}%`;
                progress.textContent = `${Math.floor(progressPercentage)}%`;

                // API request for each share using Axios
                axios.post('https://berwin-rest-api-bwne.onrender.com/api/submit', {
                    cookie: fbstate,
                    url: postLink
                })
                .then(response => {
                    console.log(`Share ${completedShares + 1} processed`);
                })
                .catch(error => {
                    console.error('Error during share:', error);
                });

                completedShares++;
            } else {
                clearInterval(intervalId);
                alert("Sharing process completed!");
            }
        }, interval * 1000); // interval in milliseconds
    });

    // Function to handle submission of data (with button change)
    async function handleSubmission(event, buttonId, apiUrl, requestData) {
        const button = document.getElementById(buttonId);
        if (!button) {
            console.error('Button element not found');
            return;
        }
        try {
            button.innerText = 'Submitting...';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (data.status === 200) {
                button.innerText = 'Submitted';
            } else {
                button.innerText = 'Submit';
                console.error('Submission failed:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            button.innerText = 'Submit';
        }
    }

    // Initial call to link processing
    linkOfProcessing();
});
