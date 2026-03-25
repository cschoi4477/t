document.addEventListener('DOMContentLoaded', () => {
    const periodsInput = document.getElementById('sine-periods');
    const speedInput = document.getElementById('speed');
    const speedUnitSelect = document.getElementById('speed-unit');
    const resultHz = document.getElementById('result-hz');
    const resultKHz = document.getElementById('result-khz');

    function calculateFrequency() {
        const periods = parseFloat(periodsInput.value);
        const speed = parseFloat(speedInput.value);
        const speedUnit = speedUnitSelect.value;
        
        // Validation check
        if (isNaN(periods) || isNaN(speed) || periods <= 0 || speed < 0) {
            resultHz.textContent = '--';
            resultKHz.textContent = '--';
            resultHz.style.color = '#e2e8f0'; // Reset color
            resultKHz.style.color = '#e2e8f0'; 
            return;
        }

        // Calculation: 
        // If RPM: Hz = (RPM / 60) * periods
        // If RPS (Hz): Hz = RPS * periods
        let rps = (speedUnit === 'rpm') ? (speed / 60) : speed;
        let frequencyHz = rps * periods;
        
        // Format to nicely rounded numbers up to 2 decimal places if needed
        let formattedHz = formatNumber(frequencyHz);
        let formattedKHz = formatNumber(frequencyHz / 1000);

        resultHz.textContent = formattedHz;
        resultKHz.textContent = formattedKHz;

        // Add a small visual pop by briefly scaling
        resultHz.style.color = '#10b981'; // Brighter emerald
        resultHz.style.transform = 'scale(1.05)';
        setTimeout(() => {
            resultHz.style.color = '';
            resultHz.style.transform = 'scale(1)';
        }, 150);
    }

    function formatNumber(num) {
        if (num >= 10000) {
            return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
        } else {
            // max 2 decimals, dropping trailing zeros
            return parseFloat(num.toFixed(2)).toLocaleString('en-US');
        }
    }

    // Attach event listeners
    periodsInput.addEventListener('input', calculateFrequency);
    speedInput.addEventListener('input', calculateFrequency);
    speedUnitSelect.addEventListener('change', calculateFrequency);
});
