window.onload = function() {
    const link = document.getElementById('start');

    // Disable click initially
    let enabled = false;

    link.addEventListener('click', function(event) {
        if (!enabled) {
            event.preventDefault(); // Stop navigating
        }
    });

    // Show as disabled
    link.classList.remove('enabled');

    // Enable after 10 seconds
    setTimeout(() => {
        enabled = true;
        link.classList.add('enabled');
    }, 5000);
};
