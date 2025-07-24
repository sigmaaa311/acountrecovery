document.addEventListener('DOMContentLoaded', function () {
  const usernameInput = document.getElementById('username');
  const recoverBtn = document.getElementById('recoverBtn');
  const inputSection = document.getElementById('inputSection');
  const recoverySection = document.getElementById('recoverySection');
  const successMessage = document.getElementById('successMessage');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const currentStatus = document.getElementById('currentStatus');
  const resetBtn = document.getElementById('resetBtn');

  const steps = [
    "Connecting to Roblox servers...",
    "Validating username...",
    "Checking account integrity...",
    "Analyzing data corruption...",
    "Bypassing rate limits...",
    "Downloading encrypted data...",
    "Decrypting credentials...",
    "Rebuilding token tables...",
    "Injecting session keys...",
    "Finalizing recovery process..."
  ];

  recoverBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) return alert("Please enter a Roblox username.");
    
    inputSection.style.display = 'none';
    recoverySection.style.display = 'block';

    simulateRecovery();
  });

  function simulateRecovery() {
    let progress = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 3; // slow progression
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          recoverySection.style.display = 'none';
          successMessage.style.display = 'block';
        }, 1000);
      }

      progressBar.style.width = `${progress}%`;
      progressPercent.textContent = `${Math.floor(progress)}%`;

      if (progress > ((stepIndex + 1) * (100 / steps.length)) && stepIndex < steps.length) {
        currentStatus.textContent = steps[stepIndex];
        stepIndex++;
      }
    }, 500);
  }

  resetBtn.addEventListener('click', () => {
    usernameInput.value = "";
    progressBar.style.width = "0%";
    progressPercent.textContent = "0%";
    currentStatus.textContent = steps[0];
    inputSection.style.display = "block";
    recoverySection.style.display = "none";
    successMessage.style.display = "none";
  });
});
