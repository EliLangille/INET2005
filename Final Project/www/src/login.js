document.addEventListener("DOMContentLoaded", function() {
    // Extract query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    // Show an error message if there was an invalid login error
    if (error === 'invalid') {
    alert('Invalid username or password. Please try again.');
    
    // Remove the query parameter to avoid showing the error message again on reload
    history.replaceState({}, document.title, "/login");
    }

    // Add event listener for the login form submission
    document.getElementById('login-form').addEventListener('submit', function(event) {
        // Clear any existing error messages
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'none';
    
        // Validate the form fields
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
    
        // Basic client-side validation (ensure fields are not empty)
        if (!username || !password) {
        errorMessage.textContent = 'Both fields are required!';
        errorMessage.style.display = 'block';
        event.preventDefault(); // Prevent form submission
        return;
        }
    });
});