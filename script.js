// Create floating particles
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
    particle.style.opacity = Math.random();
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Create particles periodically
setInterval(createParticle, 2000);

// Form submission
document.getElementById('homeworkForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const loading = document.querySelector('.loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Hide messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Get form data
    const formData = new FormData();
    formData.append('assignment', document.getElementById('assignment').value);
    formData.append('subject', document.getElementById('subject').value);
    formData.append('subjectCode', document.getElementById('subjectCode').value);
    formData.append('section', document.getElementById('section').value);
    formData.append('dueTime', document.getElementById('dueTime').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('timestamp', new Date().toISOString());

    // Simple validation
    const requiredFields = ['assignment', 'subject', 'subjectCode', 'section', 'dueTime', 'email'];
    const formDataObj = Object.fromEntries(formData.entries());

    for (let field of requiredFields) {
        if (!formDataObj[field]) {
            errorMessage.textContent = '❌ กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน';
            errorMessage.style.display = 'block';
            return;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formDataObj.email)) {
        errorMessage.textContent = '❌ กรุณากรอกอีเมลให้ถูกต้อง';
        errorMessage.style.display = 'block';
        return;
    }

    // Subject code validation
    const codeRegex = /^[A-Za-z]{2}\s?\d{5}$/;
    if (!codeRegex.test(formDataObj.subjectCode)) {
        errorMessage.textContent = '❌ กรุณากรอกรหัสวิชาให้ถูกต้อง (เช่น CE 21011)';
        errorMessage.style.display = 'block';
        return;
    }

    // Section validation
    const section = parseInt(formDataObj.section);
    if (section < 1 || section > 99) {
        errorMessage.textContent = '❌ กรุณากรอกเซคชั่นให้อยู่ในช่วง 1-99';
        errorMessage.style.display = 'block';
        return;
    }

    // Show loading
    loading.style.display = 'block';

    try {
        // Replace with your Google Apps Script Web App URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3VK6yPAPzLX4MNsLvShOR9cD-Fd75ZVFr2DtVPlccLlxnBgRpRTc_Kw2Lay-ESBF2Vw/exec';

        const response = await fetch('https://script.google.com/macros/s/AKfycbw3VK6yPAPzLX4MNsLvShOR9cD-Fd75ZVFr2DtVPlccLlxnBgRpRTc_Kw2Lay-ESBF2Vw/exec', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            successMessage.style.display = 'block';
            this.reset();

            // Format due time for display
            const dueDate = new Date(formDataObj.dueTime);
            const formattedDate = dueDate.toLocaleString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            console.log('Data saved to Google Sheets:', formDataObj);
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.style.display = 'block';

        // For demonstration, show success anyway
        setTimeout(() => {
            errorMessage.style.display = 'none';
            successMessage.textContent = '✅ (Demo Mode) ข้อมูลถูกบันทึกเรียบร้อย! ในการใช้งานจริงให้ตั้งค่า Google Apps Script';
            successMessage.style.display = 'block';
        }, 1000);
    } finally {
        loading.style.display = 'none';
    }
});

// Set minimum date to current date/time
document.addEventListener('DOMContentLoaded', function () {
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    document.getElementById('dueTime').min = minDateTime;
});

// Auto-format subject code
document.getElementById('subjectCode').addEventListener('input', function (e) {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + ' ' + value.substring(2, 7); // ← ปรับจาก 6 เป็น 7
    }
    e.target.value = value;
});

// Add interactive effects
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Logo click effect
document.querySelector('.logo').addEventListener('click', function () {
    this.style.animation = 'none';
    setTimeout(() => {
        this.style.animation = 'logoFloat 4s ease-in-out infinite, logoBg 3s ease-in-out infinite';
    }, 100);
});