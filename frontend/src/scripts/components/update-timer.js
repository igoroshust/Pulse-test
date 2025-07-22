window.onload = () => {

  function updateTimer() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`
  }

  setInterval(updateTimer, 1000)

  updateTimer();
};

