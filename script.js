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
            alert('❌ กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formDataObj.email)) {
        alert('❌ กรุณากรอกอีเมลให้ถูกต้อง');
        return;
    }

    // Subject code validation
    const codeRegex = /^[A-Za-z]{2}\s?\d{5}$/;
    if (!codeRegex.test(formDataObj.subjectCode)) {
        alert('❌ กรุณากรอกรหัสวิชาให้ถูกต้อง (เช่น CE 21011)');
        return;
    }

    // Section validation
    const section = parseInt(formDataObj.section);
    if (section < 1 || section > 99) {
        alert('❌ กรุณากรอกเซคชั่นให้อยู่ในช่วง 1-99');
        return;
    }

    // Show loading
    loading.style.display = 'flex';
    loading.classList.add('show');
    // hide loading
    loading.style.display = 'none';
    loading.classList.remove('show');

    try {
        // Replace with your Google Apps Script Web App URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3VK6yPAPzLX4MNsLvShOR9cD-Fd75ZVFr2DtVPlccLlxnBgRpRTc_Kw2Lay-ESBF2Vw/exec';

        const response = await fetch('https://script.google.com/macros/s/AKfycbw3VK6yPAPzLX4MNsLvShOR9cD-Fd75ZVFr2DtVPlccLlxnBgRpRTc_Kw2Lay-ESBF2Vw/exec', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Data saved to Google Sheets:', formDataObj);
            
            // สร้าง URL สำหรับหน้า success พร้อมข้อมูล
            const successUrl = new URL('success.html', window.location.origin);
            successUrl.searchParams.set('assignment', formDataObj.assignment);
            successUrl.searchParams.set('subject', formDataObj.subject);
            successUrl.searchParams.set('subjectCode', formDataObj.subjectCode);
            successUrl.searchParams.set('section', formDataObj.section);
            successUrl.searchParams.set('dueTime', formDataObj.dueTime);
            successUrl.searchParams.set('email', formDataObj.email);
            successUrl.searchParams.set('description', formDataObj.description);
            
            // Redirect ไปหน้า success
            window.location.href = successUrl.toString();
            
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // ถ้าเกิดข้อผิดพลาด ยังคง redirect ไปหน้า success (สำหรับ demo)
        alert('⚠️ เกิดข้อผิดพลาดในการส่งข้อมูล แต่จะแสดงหน้า success เพื่อการสาธิต');
        
        setTimeout(() => {
            const successUrl = new URL('success.html', window.location.origin);
            successUrl.searchParams.set('assignment', formDataObj.assignment);
            successUrl.searchParams.set('subject', formDataObj.subject);
            successUrl.searchParams.set('subjectCode', formDataObj.subjectCode);
            successUrl.searchParams.set('section', formDataObj.section);
            successUrl.searchParams.set('dueTime', formDataObj.dueTime);
            successUrl.searchParams.set('email', formDataObj.email);
            successUrl.searchParams.set('description', formDataObj.description);
            
            window.location.href = successUrl.toString();
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
        value = value.substring(0, 2) + ' ' + value.substring(2, 7);
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