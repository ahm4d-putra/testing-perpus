// Admin JavaScript for Library Management System
// Author: Perpustakaan Digital
// Version: 1.0

// Admin authentication
function handleAdminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Check admin credentials (in real app, this should be server-side)
    if (username === 'admin' && password === 'admin123') {
        showNotification('Login berhasil!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification('Username atau password salah!', 'error');
    }
}

// Load admin books
function loadAdminBooks() {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        const statusBadge = book.available ? 
            '<span class="badge badge-success">Tersedia</span>' : 
            '<span class="badge badge-danger">Dipinjam</span>';
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>
                <img src="../../public/img/cover/${book.cover}" alt="${book.title}" 
                     style="width: 50px; height: 60px; object-fit: cover; border-radius: 4px;"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdmVyPC90ZXh0Pjwvc3ZnPg=='">
            </td>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${statusBadge}</td>
            <td>${book.year}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-view" onclick="editBook(${book.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteBook(${book.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateAdminBookCount();
}

// Load categories for select dropdowns
function loadCategoriesForSelect() {
    const selects = [
        document.getElementById('categoryFilter'),
        document.getElementById('bookCategory')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        
        select.innerHTML = select.id === 'categoryFilter' ? 
            '<option value="">Semua Kategori</option>' : 
            '<option value="">Pilih Kategori</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            select.appendChild(option);
        });
    });
}

// Filter admin books
function filterAdminBooks() {
    const searchTerm = document.getElementById('searchBooks')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
    let filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredAdminBooks(filteredBooks);
}

// Display filtered admin books
function displayFilteredAdminBooks(filteredBooks) {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const row = document.createElement('tr');
        const statusBadge = book.available ? 
            '<span class="badge badge-success">Tersedia</span>' : 
            '<span class="badge badge-danger">Dipinjam</span>';
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>
                <img src="../../public/img/cover/${book.cover}" alt="${book.title}" 
                     style="width: 50px; height: 60px; object-fit: cover; border-radius: 4px;"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdmVyPC90ZXh0Pjwvc3ZnPg=='">
            </td>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${statusBadge}</td>
            <td>${book.year}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-view" onclick="editBook(${book.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteBook(${book.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateAdminBookCount(filteredBooks.length);
}

// Reset book filters
function resetBookFilters() {
    const searchInput = document.getElementById('searchBooks');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    
    loadAdminBooks();
}

// Update admin book count
function updateAdminBookCount(count = null) {
    const bookCount = document.getElementById('bookCount');
    if (bookCount) {
        const total = count !== null ? count : books.length;
        bookCount.textContent = `Menampilkan ${total} buku`;
    }
}

// Open add book modal
function openAddBookModal() {
    const modal = document.getElementById('bookModal');
    const form = document.getElementById('bookForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal || !form || !modalTitle) return;
    
    // Reset form
    form.reset();
    document.getElementById('bookId').value = '';
    modalTitle.textContent = 'Tambah Buku Baru';
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Edit book
function editBook(bookId) {
    const book = books.find(b => b.id == bookId);
    const modal = document.getElementById('bookModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!book || !modal || !modalTitle) return;
    
    // Fill form with book data
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookCategory').value = book.category;
    document.getElementById('bookIsbn').value = book.isbn;
    document.getElementById('bookPublisher').value = book.publisher;
    document.getElementById('bookYear').value = book.year;
    document.getElementById('bookPages').value = book.pages;
    document.getElementById('bookDescription').value = book.description;
    document.getElementById('bookCover').value = book.cover;
    
    modalTitle.textContent = 'Edit Buku';
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Delete book
function deleteBook(bookId) {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
        const bookIndex = books.findIndex(b => b.id == bookId);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            loadAdminBooks();
            showNotification('Buku berhasil dihapus!', 'success');
        }
    }
}

// Close book modal
function closeBookModal() {
    const modal = document.getElementById('bookModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Save book
function saveBook() {
    const bookId = document.getElementById('bookId').value;
    const bookData = {
        id: bookId ? parseInt(bookId) : Math.max(...books.map(b => b.id)) + 1,
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        isbn: document.getElementById('bookIsbn').value,
        publisher: document.getElementById('bookPublisher').value,
        year: parseInt(document.getElementById('bookYear').value),
        pages: parseInt(document.getElementById('bookPages').value),
        description: document.getElementById('bookDescription').value,
        cover: document.getElementById('bookCover').value || 'default-cover.jpg',
        available: true,
        borrowed_by: null,
        borrow_date: null,
        due_date: null
    };
    
    if (bookId) {
        // Update existing book
        const bookIndex = books.findIndex(b => b.id == bookId);
        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], ...bookData };
        }
        showNotification('Buku berhasil diperbarui!', 'success');
    } else {
        // Add new book
        books.push(bookData);
        showNotification('Buku berhasil ditambahkan!', 'success');
    }
    
    closeBookModal();
    loadAdminBooks();
}

// Load admin categories
function loadAdminCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        grid.appendChild(categoryCard);
    });
}

// Create category card
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'admin-form';
    card.style.cursor = 'pointer';
    card.style.transition = 'all 0.3s ease';
    card.onmouseover = () => card.style.transform = 'translateY(-4px)';
    card.onmouseout = () => card.style.transform = 'translateY(0)';
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">${category.name}</h4>
                <p style="color: var(--text-light); font-size: 0.875rem;">${category.description}</p>
            </div>
            <span class="badge badge-primary" style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem;">
                ${category.book_count} buku
            </span>
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-sm btn-view" onclick="editCategory(${category.id})" title="Edit">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-delete" onclick="deleteCategory(${category.id})" title="Hapus">
                <i class="fas fa-trash"></i> Hapus
            </button>
        </div>
    `;
    
    return card;
}

// Open category modal
function openCategoryModal() {
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal || !form || !modalTitle) return;
    
    // Reset form
    form.reset();
    document.getElementById('categoryId').value = '';
    modalTitle.textContent = 'Tambah Kategori Baru';
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Edit category
function editCategory(categoryId) {
    const category = categories.find(c => c.id == categoryId);
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!category || !modal || !modalTitle) return;
    
    // Fill form with category data
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description;
    
    modalTitle.textContent = 'Edit Kategori';
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Delete category
function deleteCategory(categoryId) {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        const categoryIndex = categories.findIndex(c => c.id == categoryId);
        if (categoryIndex !== -1) {
            // Check if category is used by books
            const booksInCategory = books.filter(b => b.category === categories[categoryIndex].name);
            if (booksInCategory.length > 0) {
                showNotification('Kategori tidak dapat dihapus karena masih digunakan oleh buku!', 'error');
                return;
            }
            
            categories.splice(categoryIndex, 1);
            loadAdminCategories();
            showNotification('Kategori berhasil dihapus!', 'success');
        }
    }
}

// Close category modal
function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Save category
function saveCategory() {
    const categoryId = document.getElementById('categoryId').value;
    const categoryData = {
        id: categoryId ? parseInt(categoryId) : Math.max(...categories.map(c => c.id)) + 1,
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        book_count: 0
    };
    
    if (categoryId) {
        // Update existing category
        const categoryIndex = categories.findIndex(c => c.id == categoryId);
        if (categoryIndex !== -1) {
            categories[categoryIndex] = { ...categories[categoryIndex], ...categoryData };
        }
        showNotification('Kategori berhasil diperbarui!', 'success');
    } else {
        // Add new category
        categories.push(categoryData);
        showNotification('Kategori berhasil ditambahkan!', 'success');
    }
    
    closeCategoryModal();
    loadAdminCategories();
}

// Show notification (reuse from main.js)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle click outside modal to close
document.addEventListener('click', function(e) {
    const bookModal = document.getElementById('bookModal');
    const categoryModal = document.getElementById('categoryModal');
    
    if (bookModal && e.target === bookModal) {
        closeBookModal();
    }
    if (categoryModal && e.target === categoryModal) {
        closeCategoryModal();
    }
});

// Handle escape key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBookModal();
        closeCategoryModal();
    }
});