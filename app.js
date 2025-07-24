document.addEventListener('DOMContentLoaded', () => {

    // 1. DOM Element Selection
    // =====================================
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const themeSwitch = document.getElementById('checkbox');
    const userDropdownBtn = document.querySelector('.user-avatar');
    const userDropdownMenu = document.querySelector('.user-dropdown .dropdown-menu');

    // Modal elements
    const modal = document.getElementById('myModal');
    const closeButton = document.querySelector('#myModal .close-button'); 
    const modalActionButton = document.getElementById('modalActionButton');

    // Toast container
    const toastContainer = document.getElementById('toastContainer');

    // 2. Sidebar Toggle Functionality
    // =====================================
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebar.classList.contains('active')) {
                document.body.classList.add('sidebar-open');
            } else {
                document.body.classList.remove('sidebar-open');
            }
        });

        // Close sidebar when clicking outside (for mobile overlay)
        document.body.addEventListener('click', (event) => {
            
            if (sidebar.classList.contains('active') &&
                !sidebar.contains(event.target) &&
                !sidebarToggleBtn.contains(event.target)) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');

            }
        });

        // Optional: Close sidebar on desktop resize if it was open on mobile
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }

    // 3. Dark/Light Theme Toggle with localStorage
    // =====================================

    // Function to apply the theme
    const applyTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme + '-theme');
    };

    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        themeSwitch.checked = (savedTheme === 'dark');
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            themeSwitch.checked = true;
            applyTheme('dark');
        } else {
            themeSwitch.checked = false;
            applyTheme('light');
        }
    }

    // Event listener for theme switch
    if (themeSwitch) {
        themeSwitch.addEventListener('change', (event) => {
            const newTheme = event.target.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 4. User Dropdown Open/Close
    // =====================================
    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener('click', (event) => {
            userDropdownMenu.classList.toggle('show');
            event.stopPropagation();
        });

        // Close dropdown when clicking anywhere outside
        document.addEventListener('click', (event) => {
            if (!userDropdownMenu.contains(event.target) && !userDropdownBtn.contains(event.target)) {
                userDropdownMenu.classList.remove('show');
            }
        });
    }

    // 5. Modal Open/Close
    // =====================================
    window.openModal = () => {
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    // Function to close modal
    const closeModal = () => {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    // Event listeners for modal
    if (modal) {
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // Close when clicking outside content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Example: Action inside modal
        if (modalActionButton) {
            modalActionButton.addEventListener('click', () => {
                showToast('Changes saved successfully!');
                closeModal();
            });
        }
    }

    // 6. Simple Toast Alert
    // =====================================
    window.showToast = (message, duration = 3000) => {
        if (!toastContainer) {
            console.error("Toast container not found. Add <div id='toastContainer'></div> to your HTML.");
            return;
        }

        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    };

    // Example of calling toast on page load:
    showToast('Welcome to the Dashboard!', 4000);
});
