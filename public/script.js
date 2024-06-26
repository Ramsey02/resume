document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;

        try {
            const response = await fetch('/api/submit-email', {  // Make sure this matches your server route
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
            alert('Email submitted successfully!');
        } catch (error) {
            console.error('An error occurred:', error);
            alert('There was an error submitting your email. Please try again.');
        }
    });
});