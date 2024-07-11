document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;

        try {
            const response = await fetch('/api/submit-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result.message);
            
            // Store email in localStorage and redirect to main page
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('An error occurred:', error);
            alert('There was an error submitting your email. Please try again.');
        }
    });
});