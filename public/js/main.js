// Main JavaScript for Library Management System
// Author: Perpustakaan Digital
// Version: 1.0

// Global variables
let books = [];
let categories = [];
let users = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load data from JSON files
async function loadData() {
    try {
        const [booksResponse, categoriesResponse, usersResponse] = await Promise.all([
            fetch('../../data/books.json'),
            fetch('../../data/categories.json'),
            fetch('../../data/users.json')
        ]);
        
        books = await booksResponse.json();
        categories = await categoriesResponse.json();
        users = await usersResponse.json();
        
        console.log('Data loaded successfully:', { books: books.length, categories: categories.length, users: users.length });
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Gagal memuat data dari server', 'error');
    }
}

// Load popular books for homepage
function loadPopularBooks() {
    const popularBooks = books.slice(0, 6); // Show first 6 books as popular
    const grid = document.getElementById('popular-books-grid');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    popularBooks.forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
    });
}

// Create book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => viewBookDetail(book.id);
    
    const statusClass = book.available ? 'status-available' : 'status-borrowed';
    const statusText = book.available ? 'Tersedia' : 'Dipinjam';
    const statusIcon = book.available ? 'fa-check-circle' : 'fa-times-circle';
    
    card.innerHTML = `
        <img src="../../public/img/cover/${book.cover}" alt="${book.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJ1a3UgVGVtcGVsPC90ZXh0Pjwvc3ZnPg=='">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">oleh ${book.author}</p>
            <span class="book-category">${book.category}</span>
            <div class="book-status ${statusClass}">
                <i class="fas ${statusIcon}"></i>
                <span>${statusText}</span>
            </div>
        </div>
    `;
    
    return card;
}

// View book detail
function viewBookDetail(bookId) {
    window.location.href = `../user/detail.html?id=${bookId}`;
}

// Load books for books page
function loadBooks() {
    const grid = document.getElementById('booksGrid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    // Show loading
    if (loading) loading.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        
        if (books.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        grid.innerHTML = '';
        books.forEach(book => {
            const bookCard = createBookCard(book);
            grid.appendChild(bookCard);
        });
        
        updateBookCount(books.length);
    }, 500);
}

// Load categories filter
function loadCategoriesFilter() {
    const select = document.getElementById('categoryFilter');
    if (!select) return;
    
    select.innerHTML = '<option value="">Semua Kategori</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Filter books
function filterBooks() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    let filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm) ||
                             book.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        
        const matchesStatus = !statusFilter || 
                             (statusFilter === 'available' && book.available) ||
                             (statusFilter === 'borrowed' && !book.available);
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    displayFilteredBooks(filteredBooks);
}

// Display filtered books
function displayFilteredBooks(filteredBooks) {
    const grid = document.getElementById('booksGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (filteredBooks.length === 0) {
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        grid.appendChild(bookCard);
    });
    
    updateBookCount(filteredBooks.length);
}

// Sort books
function sortBooks() {
    const sortBy = document.getElementById('sortBy')?.value || 'title';
    let sortedBooks = [...books];
    
    switch (sortBy) {
        case 'title':
            sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'year':
            sortedBooks.sort((a, b) => b.year - a.year);
            break;
        case 'category':
            sortedBooks.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    displayFilteredBooks(sortedBooks);
}

// Reset filters
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (sortBy) sortBy.value = 'title';
    
    loadBooks();
}

// Update book count display
function updateBookCount(count) {
    const bookCount = document.getElementById('bookCount');
    if (bookCount) {
        bookCount.textContent = `Menampilkan ${count} buku`;
    }
}

// Load book detail
async function loadBookDetail(bookId) {
    const book = books.find(b => b.id == bookId);
    const loading = document.getElementById('loading');
    const notFound = document.getElementById('notFound');
    const detail = document.getElementById('bookDetail');
    
    if (loading) loading.style.display = 'none';
    
    if (!book) {
        if (notFound) notFound.style.display = 'block';
        if (detail) detail.style.display = 'none';
        return;
    }
    
    if (detail) {
        detail.style.display = 'block';
        detail.innerHTML = createBookDetailHTML(book);
    }
    
    if (notFound) notFound.style.display = 'none';
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumbTitle');
    if (breadcrumb) breadcrumb.textContent = book.title;
    
    // Load related books
    loadRelatedBooks(book);
}

// Create book detail HTML
function createBookDetailHTML(book) {
    const statusClass = book.available ? 'status-available' : 'status-borrowed';
    const statusText = book.available ? 'Tersedia' : 'Dipinjam';
    const statusIcon = book.available ? 'fa-check-circle' : 'fa-times-circle';
    
    return `
        <div class="book-detail-header">
            <div>
                <img src="../../public/img/cover/${book.cover}" alt="${book.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJ1a3UgVGVtcGVsPC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="book-detail-info">
                <h1>${book.title}</h1>
                <p style="font-size: 1.125rem; color: var(--text-light); margin-bottom: 1rem;">oleh ${book.author}</p>
                
                <div class="book-meta">
                    <div>
                        <strong>ISBN:</strong> ${book.isbn}
                    </div>
                    <div>
                        <strong>Penerbit:</strong> ${book.publisher}
                    </div>
                    <div>
                        <strong>Tahun:</strong> ${book.year}
                    </div>
                    <div>
                        <strong>Halaman:</strong> ${book.pages}
                    </div>
                    <div>
                        <strong>Kategori:</strong> ${book.category}
                    </div>
                    <div>
                        <strong>Status:</strong> 
                        <span class="${statusClass}" style="margin-left: 0.5rem;">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </span>
                    </div>
                </div>
                
                <div class="book-description">
                    <h3 style="margin-bottom: 1rem;">Deskripsi</h3>
                    <p>${book.description}</p>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    ${book.available ? 
                        `<button class="btn btn-primary" onclick="openBorrowModal(${book.id})">
                            <i class="fas fa-hand-holding-heart"></i> Pinjam Buku
                        </button>` :
                        `<button class="btn btn-secondary" disabled>
                            <i class="fas fa-times-circle"></i> Tidak Tersedia
                        </button>`
                    }
                    <button class="btn btn-outline" onclick="window.history.back()">
                        <i class="fas fa-arrow-left"></i> Kembali
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load related books
function loadRelatedBooks(currentBook) {
    const relatedBooks = books.filter(book => 
        book.id !== currentBook.id && 
        (book.category === currentBook.category || book.author === currentBook.author)
    ).slice(0, 4);
    
    const container = document.getElementById('relatedBooks');
    if (!container) return;
    
    container.innerHTML = '';
    
    relatedBooks.forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

// Open borrow modal
function openBorrowModal(bookId) {
    const modal = document.getElementById('borrowModal');
    const book = books.find(b => b.id == bookId);
    
    if (!book || !modal) return;
    
    // Set default dates
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    
    document.getElementById('borrowDate').value = today.toISOString().split('T')[0];
    document.getElementById('returnDate').value = twoWeeksLater.toISOString().split('T')[0];
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Close borrow modal
function closeBorrowModal() {
    const modal = document.getElementById('borrowModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Handle borrow book
function handleBorrowBook() {
    const name = document.getElementById('borrowerName').value;
    const email = document.getElementById('borrowerEmail').value;
    const borrowDate = document.getElementById('borrowDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    if (!name || !email || !borrowDate || !returnDate) {
        showNotification('Mohon lengkapi semua field', 'error');
        return;
    }
    
    // Get book ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (!bookId) {
        showNotification('Buku tidak ditemukan', 'error');
        return;
    }
    
    // Find and update book
    const bookIndex = books.findIndex(b => b.id == bookId);
    if (bookIndex !== -1) {
        books[bookIndex].available = false;
        books[bookIndex].borrowed_by = email;
        books[bookIndex].borrow_date = borrowDate;
        books[bookIndex].due_date = returnDate;
        
        showNotification('Buku berhasil dipinjam!', 'success');
        closeBorrowModal();
        
        // Reload book detail
        loadBookDetail(bookId);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Utility function to show coming soon message
function showComingSoon() {
    showNotification('Fitur ini akan segera hadir!', 'success');
}

// Handle click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('borrowModal');
    if (modal && e.target === modal) {
        closeBorrowModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBorrowModal();
    }
});