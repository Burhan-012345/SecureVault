document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const connectionStatus = document.getElementById('connectionStatus');
    const setupScreen = document.getElementById('setupScreen');
    const loginScreen = document.getElementById('loginScreen');
    const forgotPinScreen = document.getElementById('forgotPinScreen');
    const resetPinScreen = document.getElementById('resetPinScreen');
    const vaultScreen = document.getElementById('vaultScreen');
    
    // Setup Form
    const setupForm = document.getElementById('setupForm');
    const setupPinInputs = setupForm.querySelectorAll('.pin-input input');
    const showSetupPin = document.getElementById('showSetupPin');
    const securityQuestion = document.getElementById('securityQuestion');
    const securityAnswer = document.getElementById('securityAnswer');
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    const loginPinInputs = loginForm.querySelectorAll('.pin-input input');
    const showLoginPin = document.getElementById('showLoginPin');
    const forgotPinBtn = document.getElementById('forgotPinBtn');
    
    // Forgot PIN Form
    const forgotPinForm = document.getElementById('forgotPinForm');
    const securityQuestionDisplay = document.getElementById('securityQuestionDisplay');
    const forgotPinAnswer = document.getElementById('forgotPinAnswer');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    
    // Reset PIN Form
    const resetPinForm = document.getElementById('resetPinForm');
    const resetPinInputs = resetPinForm.querySelectorAll('.pin-input input');
    const showResetPin = document.getElementById('showResetPin');
    
    // Vault Elements
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const lockVaultBtn = document.getElementById('lockVaultBtn');
    const addMediaBtn = document.getElementById('addMediaBtn');
    const mediaUploadInput = document.getElementById('mediaUploadInput');
    const mediaGrid = document.getElementById('mediaGrid');
    
    // Modals
    const mediaViewerModal = document.getElementById('mediaViewerModal');
    const closeMediaViewer = document.getElementById('closeMediaViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerVideo = document.getElementById('viewerVideo');
    const downloadMediaBtn = document.getElementById('downloadMediaBtn');
    const deleteMediaBtn = document.getElementById('deleteMediaBtn');
    const shareMediaBtn = document.getElementById('shareMediaBtn');
    
    const shareModal = document.getElementById('shareModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const sharePlatforms = document.querySelectorAll('.share-platform');
    const shareLinkInput = document.getElementById('shareLinkInput');
    const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
    
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsSections = document.querySelectorAll('.settings-section');
    
    const changePinModal = document.getElementById('changePinModal');
    const closeChangePinModal = document.getElementById('closeChangePinModal');
    const changePinForm = document.getElementById('changePinForm');
    const changePinBtn = document.getElementById('changePinBtn');
    
    const changeQuestionModal = document.getElementById('changeQuestionModal');
    const closeChangeQuestionModal = document.getElementById('closeChangeQuestionModal');
    const changeQuestionForm = document.getElementById('changeQuestionForm');
    const changeSecurityQuestionBtn = document.getElementById('changeSecurityQuestionBtn');
    const currentSecurityQuestion = document.getElementById('currentSecurityQuestion');
    
    // About Sections
    const aboutTabs = document.querySelectorAll('.about-tab');
    const aboutSections = document.querySelectorAll('.about-section');
    
    // State variables
    let currentMedia = null;
    let autoLockTimeout = null;
    let idleTimer = null;
    let mediaItems = [];
    
    // Initialize the app
    initApp();
    
    // Functions
    function initApp() {
        // Check if user has completed setup
        const hasSetup = localStorage.getItem('vaultSetupComplete');
        
        if (!hasSetup) {
            showScreen(setupScreen);
        } else {
            showScreen(loginScreen);
        }
        
        // Initialize event listeners
        initEventListeners();
        
        // Check internet connection
        checkInternetConnection();
        window.addEventListener('online', checkInternetConnection);
        window.addEventListener('offline', checkInternetConnection);
        
        // Initialize idle detection
        initIdleDetection();
    }
    
    function initEventListeners() {
        // Setup form
        setupPinInputs.forEach((input, index) => {
            input.addEventListener('input', () => handlePinInput(input, setupPinInputs, index));
            input.addEventListener('keydown', (e) => handlePinKeyDown(e, input, setupPinInputs, index));
        });
        
        showSetupPin.addEventListener('change', () => togglePinVisibility(setupPinInputs, showSetupPin));
        setupForm.addEventListener('submit', handleSetupSubmit);
        
        // Login form
        loginPinInputs.forEach((input, index) => {
            input.addEventListener('input', () => handlePinInput(input, loginPinInputs, index));
            input.addEventListener('keydown', (e) => handlePinKeyDown(e, input, loginPinInputs, index));
        });
        
        showLoginPin.addEventListener('change', () => togglePinVisibility(loginPinInputs, showLoginPin));
        loginForm.addEventListener('submit', handleLoginSubmit);
        forgotPinBtn.addEventListener('click', handleForgotPin);
        
        // Forgot PIN form
        forgotPinForm.addEventListener('submit', handleForgotPinSubmit);
        backToLoginBtn.addEventListener('click', () => {
            showScreen(loginScreen);
        });
        
        // Reset PIN form
        resetPinInputs.forEach((input, index) => {
            input.addEventListener('input', () => handlePinInput(input, resetPinInputs, index));
            input.addEventListener('keydown', (e) => handlePinKeyDown(e, input, resetPinInputs, index));
        });
        
        showResetPin.addEventListener('change', () => togglePinVisibility(resetPinInputs, showResetPin));
        resetPinForm.addEventListener('submit', handleResetPinSubmit);
        
        // Vault controls
        themeToggleBtn.addEventListener('click', toggleTheme);
        settingsBtn.addEventListener('click', showSettingsModal);
        lockVaultBtn.addEventListener('click', lockVault);
        addMediaBtn.addEventListener('click', () => mediaUploadInput.click());
        mediaUploadInput.addEventListener('change', handleMediaUpload);
        
        // Media viewer
        closeMediaViewer.addEventListener('click', closeModal.bind(null, mediaViewerModal));
        downloadMediaBtn.addEventListener('click', downloadCurrentMedia);
        deleteMediaBtn.addEventListener('click', deleteCurrentMedia);
        shareMediaBtn.addEventListener('click', showShareModal);
        
        // Share modal
        closeShareModal.addEventListener('click', closeModal.bind(null, shareModal));
        sharePlatforms.forEach(platform => {
            platform.addEventListener('click', () => shareOnPlatform(platform.dataset.platform));
        });
        copyShareLinkBtn.addEventListener('click', copyShareLink);
        
        // Settings modal
        closeSettingsModal.addEventListener('click', closeModal.bind(null, settingsModal));
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => switchSettingsTab(tab.dataset.tab));
        });
        
        // Change PIN modal
        closeChangePinModal.addEventListener('click', closeModal.bind(null, changePinModal));
        changePinBtn.addEventListener('click', () => {
            closeModal(settingsModal);
            showModal(changePinModal);
        });
        changePinForm.addEventListener('submit', handleChangePinSubmit);
        
        // Change security question modal
        closeChangeQuestionModal.addEventListener('click', closeModal.bind(null, changeQuestionModal));
        changeSecurityQuestionBtn.addEventListener('click', () => {
            closeModal(settingsModal);
            showModal(changeQuestionModal);
        });
        changeQuestionForm.addEventListener('submit', handleChangeQuestionSubmit);
        
        // About tabs
        aboutTabs.forEach(tab => {
            tab.addEventListener('click', () => switchAboutTab(tab.dataset.tab));
        });
        
        // Auto lock timeout select
        const autoLockTimeoutSelect = document.getElementById('autoLockTimeout');
        const savedTimeout = localStorage.getItem('autoLockTimeout') || '5';
        autoLockTimeoutSelect.value = savedTimeout;
        autoLockTimeoutSelect.addEventListener('change', (e) => {
            localStorage.setItem('autoLockTimeout', e.target.value);
            resetIdleTimer();
        });
        
        // Grid size options
        const gridSizeRadios = document.querySelectorAll('input[name="gridSize"]');
        const savedGridSize = localStorage.getItem('gridSize') || 'small';
        document.querySelector(`input[name="gridSize"][value="${savedGridSize}"]`).checked = true;
        mediaGrid.classList.add(savedGridSize);
        
        gridSizeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                mediaGrid.classList.remove('small', 'medium', 'large');
                mediaGrid.classList.add(e.target.value);
                localStorage.setItem('gridSize', e.target.value);
            });
        });
    }
    
    function checkInternetConnection() {
        if (navigator.onLine) {
            connectionStatus.classList.add('connected');
            connectionStatus.innerHTML = '<i class="fas fa-wifi"></i><span>Connected to internet</span>';
            setTimeout(() => {
                connectionStatus.classList.remove('connected');
                connectionStatus.classList.add('hidden');
            }, 3000);
        } else {
            connectionStatus.classList.remove('hidden', 'connected');
            connectionStatus.innerHTML = '<i class="fas fa-wifi-slash"></i><span>No internet connection</span>';
        }
    }
    
    function initIdleDetection() {
        // Reset idle timer on user activity
        document.addEventListener('mousemove', resetIdleTimer);
        document.addEventListener('keydown', resetIdleTimer);
        document.addEventListener('click', resetIdleTimer);
        document.addEventListener('scroll', resetIdleTimer);
        
        resetIdleTimer();
    }
    
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        
        if (vaultScreen.classList.contains('hidden')) return;
        
        const timeoutMinutes = parseInt(localStorage.getItem('autoLockTimeout') || '5');
        if (timeoutMinutes > 0) {
            idleTimer = setTimeout(() => {
                lockVault();
            }, timeoutMinutes * 60 * 1000);
        }
    }
    
    function handlePinInput(input, inputs, index) {
        // Move to next input if current input has value
        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    }
    
    function handlePinKeyDown(e, input, inputs, index) {
        // Handle backspace to move to previous input
        if (e.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
        }
    }
    
    function togglePinVisibility(inputs, checkbox) {
        inputs.forEach(input => {
            input.type = checkbox.checked ? 'text' : 'password';
        });
    }
    
    function getPinFromInputs(inputs) {
        return Array.from(inputs).map(input => input.value).join('');
    }
    
    function handleSetupSubmit(e) {
        e.preventDefault();
        
        const pin = getPinFromInputs(setupPinInputs);
        const question = securityQuestion.value;
        const answer = securityAnswer.value.trim();
        
        if (pin.length !== 6) {
            alert('Please enter a complete 6-digit PIN');
            return;
        }
        
        if (!question) {
            alert('Please select a security question');
            return;
        }
        
        if (!answer) {
            alert('Please enter an answer for the security question');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('vaultPin', pin);
        localStorage.setItem('securityQuestion', question);
        localStorage.setItem('securityAnswer', answer.toLowerCase());
        localStorage.setItem('vaultSetupComplete', 'true');
        
        // Load media items
        loadMediaItems();
        
        // Show vault
        showScreen(vaultScreen);
    }
    
    function handleLoginSubmit(e) {
        e.preventDefault();
        
        const pin = getPinFromInputs(loginPinInputs);
        const savedPin = localStorage.getItem('vaultPin');
        
        if (pin === savedPin) {
            // Clear PIN inputs
            loginPinInputs.forEach(input => input.value = '');
            
            // Load media items
            loadMediaItems();
            
            // Show vault
            showScreen(vaultScreen);
        } else {
            alert('Incorrect PIN. Please try again.');
            loginPinInputs[0].focus();
        }
    }
    
    function handleForgotPin() {
        const question = localStorage.getItem('securityQuestion');
        
        if (!question) {
            alert('No security question found. Please contact support.');
            return;
        }
        
        securityQuestionDisplay.textContent = question;
        showScreen(forgotPinScreen);
    }
    
    function handleForgotPinSubmit(e) {
        e.preventDefault();
        
        const answer = forgotPinAnswer.value.trim().toLowerCase();
        const savedAnswer = localStorage.getItem('securityAnswer');
        
        if (answer === savedAnswer) {
            forgotPinAnswer.value = '';
            showScreen(resetPinScreen);
        } else {
            alert('Incorrect answer. Please try again.');
        }
    }
    
    function handleResetPinSubmit(e) {
        e.preventDefault();
        
        const newPin = getPinFromInputs(resetPinInputs);
        
        if (newPin.length !== 6) {
            alert('Please enter a complete 6-digit PIN');
            return;
        }
        
        // Update PIN
        localStorage.setItem('vaultPin', newPin);
        
        // Clear inputs
        resetPinInputs.forEach(input => input.value = '');
        
        // Show success message and return to login
        alert('PIN reset successfully!');
        showScreen(loginScreen);
    }
    
    function handleChangePinSubmit(e) {
        e.preventDefault();
        
        const currentPinInputs = changePinForm.querySelectorAll('.pin-input:nth-of-type(1) input');
        const newPinInputs = changePinForm.querySelectorAll('.pin-input:nth-of-type(2) input');
        const confirmPinInputs = changePinForm.querySelectorAll('.pin-input:nth-of-type(3) input');
        
        const currentPin = getPinFromInputs(currentPinInputs);
        const newPin = getPinFromInputs(newPinInputs);
        const confirmPin = getPinFromInputs(confirmPinInputs);
        
        const savedPin = localStorage.getItem('vaultPin');
        
        if (currentPin !== savedPin) {
            alert('Current PIN is incorrect');
            return;
        }
        
        if (newPin.length !== 6) {
            alert('Please enter a complete 6-digit PIN');
            return;
        }
        
        if (newPin !== confirmPin) {
            alert('New PINs do not match');
            return;
        }
        
        // Update PIN
        localStorage.setItem('vaultPin', newPin);
        
        // Clear inputs
        currentPinInputs.forEach(input => input.value = '');
        newPinInputs.forEach(input => input.value = '');
        confirmPinInputs.forEach(input => input.value = '');
        
        // Close modal and show success
        closeModal(changePinModal);
        alert('PIN changed successfully!');
    }
    
    function handleChangeQuestionSubmit(e) {
        e.preventDefault();
        
        const newQuestion = document.getElementById('newSecurityQuestion').value;
        const newAnswer = document.getElementById('newSecurityAnswer').value.trim().toLowerCase();
        const currentPinInputs = changeQuestionForm.querySelectorAll('.pin-input input');
        
        const currentPin = getPinFromInputs(currentPinInputs);
        const savedPin = localStorage.getItem('vaultPin');
        
        if (currentPin !== savedPin) {
            alert('Current PIN is incorrect');
            return;
        }
        
        if (!newQuestion) {
            alert('Please select a security question');
            return;
        }
        
        if (!newAnswer) {
            alert('Please enter an answer for the security question');
            return;
        }
        
        // Update security question and answer
        localStorage.setItem('securityQuestion', newQuestion);
        localStorage.setItem('securityAnswer', newAnswer);
        
        // Update displayed question in settings
        currentSecurityQuestion.textContent = newQuestion;
        
        // Clear inputs
        document.getElementById('newSecurityAnswer').value = '';
        currentPinInputs.forEach(input => input.value = '');
        
        // Close modal and show success
        closeModal(changeQuestionModal);
        alert('Security question updated successfully!');
    }
    
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
        
        // Focus first input if available
        const firstInput = screen.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
        
        // Reset idle timer when showing vault
        if (screen === vaultScreen) {
            resetIdleTimer();
        }
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle button icon
        themeToggleBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    function showSettingsModal() {
        // Update current security question display
        currentSecurityQuestion.textContent = localStorage.getItem('securityQuestion');
        
        showModal(settingsModal);
    }
    
    function switchSettingsTab(tabId) {
        // Update active tab
        settingsTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Show corresponding section
        settingsSections.forEach(section => {
            section.classList.toggle('active', section.id === `${tabId}Settings`);
        });
    }
    
    function switchAboutTab(tabId) {
        // Update active tab
        aboutTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Show corresponding section
        aboutSections.forEach(section => {
            section.classList.toggle('active', section.id === `${tabId}Section`);
        });
    }
    
    function lockVault() {
        showScreen(loginScreen);
    }
    
    function loadMediaItems() {
        mediaItems = JSON.parse(localStorage.getItem('mediaItems') || '[]');
        renderMediaGrid();
    }
    
    function renderMediaGrid() {
        mediaGrid.innerHTML = '';
        
        if (mediaItems.length === 0) {
            mediaGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <p>Your vault is empty</p>
                    <p>Add photos or videos to get started</p>
                </div>
            `;
            return;
        }
        
        mediaItems.forEach((item, index) => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.dataset.index = index;
            
            if (item.type.startsWith('image')) {
                mediaItem.innerHTML = `
                    <img src="${item.url}" alt="Media item ${index}">
                    <span class="media-type">Photo</span>
                `;
            } else {
                mediaItem.innerHTML = `
                    <video>
                        <source src="${item.url}" type="${item.type}">
                    </video>
                    <span class="media-type">Video</span>
                `;
            }
            
            mediaItem.addEventListener('click', () => showMediaItem(index));
            mediaGrid.appendChild(mediaItem);
        });
    }
    
    function handleMediaUpload(e) {
        const files = e.target.files;
        
        if (files.length === 0) return;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                alert(`File ${file.name} is not an image or video. Skipping.`);
                continue;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const mediaItem = {
                    url: event.target.result,
                    type: file.type,
                    name: file.name,
                    size: file.size,
                    lastModified: file.lastModified
                };
                
                mediaItems.push(mediaItem);
                localStorage.setItem('mediaItems', JSON.stringify(mediaItems));
                renderMediaGrid();
            };
            
            reader.readAsDataURL(file);
        }
        
        // Reset input to allow selecting same files again
        e.target.value = '';
    }
    
    function showMediaItem(index) {
        const item = mediaItems[index];
        currentMedia = { index, item };
        
        if (item.type.startsWith('image')) {
            viewerImage.src = item.url;
            viewerImage.classList.remove('hidden');
            viewerVideo.classList.add('hidden');
        } else {
            viewerVideo.src = item.url;
            viewerVideo.classList.remove('hidden');
            viewerImage.classList.add('hidden');
        }
        
        showModal(mediaViewerModal);
    }
    
    function downloadCurrentMedia() {
        const { item } = currentMedia;
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.name || `media_${Date.now()}.${item.type.split('/')[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function deleteCurrentMedia() {
        if (confirm('Are you sure you want to delete this media?')) {
            mediaItems.splice(currentMedia.index, 1);
            localStorage.setItem('mediaItems', JSON.stringify(mediaItems));
            renderMediaGrid();
            closeModal(mediaViewerModal);
        }
    }
    
    function showShareModal() {
        // Generate a fake share link (in a real app, this would upload to a server)
        shareLinkInput.value = `https://securevault.com/share/${Date.now()}`;
        showModal(shareModal);
    }
    
    function shareOnPlatform(platform) {
        const { item } = currentMedia;
        const text = 'Check out this media from my Secure Vault!';
        const url = shareLinkInput.value;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct sharing, just open the app
                shareUrl = 'instagram://app';
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'copy':
                copyShareLink();
                return;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank');
    }
    
    function copyShareLink() {
        shareLinkInput.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyShareLinkBtn.innerHTML;
        copyShareLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            copyShareLinkBtn.innerHTML = originalText;
        }, 2000);
    }
    
    function showModal(modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Pause video if media viewer is being hidden
        if (modal !== mediaViewerModal && !mediaViewerModal.classList.contains('hidden')) {
            viewerVideo.pause();
        }
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Initialize theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update active option
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update theme toggle button icon
            themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
        
        // Set active option based on current theme
        if (option.dataset.theme === (savedTheme || 'light')) {
            option.classList.add('active');
        }
    });
});