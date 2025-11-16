// Dashboard JavaScript for Library Management System
// Author: Perpustakaan Digital
// Version: 1.0

let borrowChart = null;
let currentDate = new Date();

// Load dashboard statistics
function loadDashboardStats() {
    // Calculate statistics
    const totalBooksCount = books.length;
    const borrowedBooksCount = books.filter(book => !book.available).length;
    const totalUsersCount = users.length;
    const overdueBooksCount = calculateOverdueBooks();
    
    // Update UI
    updateElementText('totalBooks', totalBooksCount);
    updateElementText('borrowedBooks', borrowedBooksCount);
    updateElementText('totalUsers', totalUsersCount);
    updateElementText('overdueBooks', overdueBooksCount);
}

// Calculate overdue books
function calculateOverdueBooks() {
    const today = new Date();
    return books.filter(book => {
        if (!book.available && book.due_date) {
            const dueDate = new Date(book.due_date);
            return dueDate < today;
        }
        return false;
    }).length;
}

// Load recent activity
function loadRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    // Generate mock recent activities
    const activities = generateRecentActivities();
    
    activityContainer.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityContainer.appendChild(activityItem);
    });
}

// Generate recent activities
function generateRecentActivities() {
    const activities = [];
    const today = new Date();
    
    // Get recent borrowed books
    const recentBorrows = books.filter(book => 
        !book.available && book.borrow_date
    ).slice(0, 5);
    
    recentBorrows.forEach(book => {
        const user = users.find(u => u.id === book.borrowed_by);
        activities.push({
            type: 'borrow',
            title: `${user?.full_name || 'Pengguna'} meminjam "${book.title}"`,
            time: formatTimeAgo(new Date(book.borrow_date))
        });
    });
    
    // Add some mock return activities
    activities.push({
        type: 'return',
        title: 'Buku "Atomic Habits" telah dikembalikan',
        time: '2 jam yang lalu'
    });
    
    activities.push({
        type: 'overdue',
        title: 'Buku "The Silent Patient" terlambat dikembalikan',
        time: '1 hari yang lalu'
    });
    
    return activities.slice(0, 8);
}

// Create activity item
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const iconClass = getActivityIconClass(activity.type);
    
    item.innerHTML = `
        <div class="activity-icon ${activity.type}">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `;
    
    return item;
}

// Get activity icon class
function getActivityIconClass(type) {
    switch (type) {
        case 'borrow': return 'fa-hand-holding-heart';
        case 'return': return 'fa-undo';
        case 'overdue': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('borrowChart');
    if (!ctx) return;
    
    // Generate monthly data
    const monthlyData = generateMonthlyData();
    
    borrowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Peminjaman',
                data: monthlyData.borrowData,
                borderColor: '#1e3a8a',
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Pengembalian',
                data: monthlyData.returnData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Generate monthly data
function generateMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const labels = [];
    const borrowData = [];
    const returnData = [];
    
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
        
        // Generate random data for demo
        borrowData.push(Math.floor(Math.random() * 10) + 5);
        returnData.push(Math.floor(Math.random() * 8) + 3);
    }
    
    return { labels, borrowData, returnData };
}

// Generate calendar
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonth = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonth) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    currentMonth.textContent = `${monthNames[month]} ${year}`;
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add weekdays
    const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-weekday';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if it's today
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add mock events
        if ([5, 12, 20, 25].includes(day)) {
            dayElement.classList.add('has-event');
            dayElement.title = 'Ada jadwal peminjaman';
        }
        
        dayElement.onclick = () => selectCalendarDay(year, month, day);
        calendarGrid.appendChild(dayElement);
    }
}

// Previous month
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

// Next month
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

// Select calendar day
function selectCalendarDay(year, month, day) {
    const selectedDate = new Date(year, month, day);
    showNotification(`Tanggal ${selectedDate.toLocaleDateString('id-ID')} dipilih`, 'success');
}

// Utility function to update element text
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return 'Baru saja';
    } else if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} hari yang lalu`;
    }
}

// Refresh dashboard data
function refreshDashboard() {
    loadDashboardStats();
    loadRecentActivity();
    if (borrowChart) {
        borrowChart.destroy();
        initializeChart();
    }
    generateCalendar();
    showNotification('Dashboard berhasil diperbarui!', 'success');
}

// Auto refresh dashboard every 5 minutes
setInterval(refreshDashboard, 5 * 60 * 1000);