import './mountLightrays.jsx';

// 0. THEME & SIDEBAR TOGGLE
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('theme-icon');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar.classList.contains('w-72')) {
        sidebar.classList.remove('w-72');
        sidebar.classList.add('w-0', 'opacity-0');
    } else {
        sidebar.classList.remove('w-0', 'opacity-0');
        sidebar.classList.add('w-72');
    }
}

// 1. DATA STRUCTURES (Initial Demo Data)
let products = [
    { code: 'SHIRT-01', name: 'Premium Cotton Shirt', size: 'M', stock: 45, cp: 400, sp: 899 },
    { code: 'JEAN-02', name: 'Stretch Denim Jeans', size: '32', stock: 12, cp: 600, sp: 1299 }
];

let customersData = [
    { bill: 'INV-005', name: 'Vignesh M.', amount: 1200, date: '28-Jun-2026', method: 'UPI' },
    { bill: 'INV-004', name: 'Kavitha S.', amount: 4500, date: '28-Jun-2026', method: 'Cash' },
    { bill: 'INV-003', name: 'Murugan K.', amount: 8000, date: '28-Jun-2026', method: 'UPI' },
    { bill: 'INV-002', name: 'Walk-in Customer', amount: 500, date: '28-Jun-2026', method: 'Cash' },
    { bill: 'INV-001', name: 'Divya A.', amount: 1500, date: '28-Jun-2026', method: 'Both' }
]; 

let cart = [];
let invoiceCounter = 6; 

function getInvoiceNumber() {
    return 'INV-' + String(invoiceCounter).padStart(3, '0');
}

// 2. TAB SWITCHING
function switchTab(tabId) {
    const views = document.querySelectorAll('.page-view');
    const navItems = document.querySelectorAll('.nav-item');

    views.forEach(view => { view.classList.remove('block', 'fade-in'); view.classList.add('hidden'); });
    navItems.forEach(item => { item.classList.remove('nav-active'); });

    const targetView = document.getElementById('view-' + tabId);
    targetView.classList.remove('hidden'); targetView.classList.add('block');
    void targetView.offsetWidth; targetView.classList.add('fade-in');

    const activeNav = document.getElementById('nav-' + tabId);
    if(activeNav) activeNav.classList.add('nav-active');

    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('w-72')) {
            sidebar.classList.remove('w-72');
            sidebar.classList.add('w-0', 'opacity-0');
        }
    }

    if(tabId === 'stock') renderStockTable();
    if(tabId === 'new-bill') renderProductDropdown();
    if(tabId === 'customers') renderCustomersTable();
    if(tabId === 'dashboard' || tabId === 'analytics') renderDashboard();
}

// 3. PRODUCT & STOCK
function saveNewProduct() {
    const code = document.getElementById('add-code').value;
    const name = document.getElementById('add-name').value;
    const size = document.getElementById('add-size').value;
    const stock = parseInt(document.getElementById('add-stock').value);
    const cp = parseFloat(document.getElementById('add-cp').value);
    const sp = parseFloat(document.getElementById('add-sp').value);

    if(!code || !name) { alert("Please enter Product Code and Name."); return; }
    products.push({ code, name, size, stock, cp, sp });
    
    document.getElementById('add-code').value = ''; document.getElementById('add-name').value = '';
    alert(`Product ${name} added successfully!`);
    renderDashboard(); 
    switchTab('stock');
}

function renderStockTable() {
    const tbody = document.getElementById('stock-table-body');
    tbody.innerHTML = '';
    products.forEach(p => {
        const stockColor = p.stock < 15 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20';
        tbody.innerHTML += `
            <tr>
                <td class="p-4 font-mono text-slate-300">${p.code}</td>
                <td class="p-4 text-white">${p.name}</td>
                <td class="p-4 text-slate-300">${p.size}</td>
                <td class="p-4 font-bold text-white">₹${p.sp}</td>
                <td class="p-4 text-center"><span class="${stockColor} border px-3 py-1 rounded-full font-bold">${p.stock}</span></td>
            </tr>
        `;
    });
}

// 4. NEW BILL & CART
function renderProductDropdown() {
    const select = document.getElementById('bill-product-select');
    select.innerHTML = '<option value="">-- Select Product --</option>';
    products.forEach((p, index) => { select.innerHTML += `<option value="${index}">${p.name} (${p.size}) - ₹${p.sp}</option>`; });
    document.getElementById('bill-id').value = getInvoiceNumber();
}

function autoFillPrice() {
    const select = document.getElementById('bill-product-select');
    if (select.value === "") { document.getElementById('bill-rate').value = ''; return; }
    document.getElementById('bill-rate').value = products[select.value].sp;
}

function addToCart() {
    const select = document.getElementById('bill-product-select');
    if (select.value === "") return alert("Select a product first.");
    
    const product = products[select.value];
    const qty = parseInt(document.getElementById('bill-qty').value);
    
    if (qty > product.stock) return alert("Not enough stock available!");

    const existing = cart.find(i => i.code === product.code);
    if (existing) { existing.qty += qty; existing.total = existing.qty * existing.rate; } 
    else { cart.push({ code: product.code, name: product.name, rate: product.sp, qty: qty, total: product.sp * qty }); }
    renderCartTable();
}

function renderCartTable() {
    const tbody = document.getElementById('cart-table-body');
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-slate-500">Cart is empty. Select a product above.</td></tr>';
        calculateCartTotals(); return;
    }
    tbody.innerHTML = '';
    cart.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td class="p-3 text-white">${item.name}</td>
                <td class="p-3 text-slate-300">₹${item.rate}</td>
                <td class="p-3 text-white">${item.qty}</td>
                <td class="p-3 text-right font-bold text-white">₹${item.total}</td>
                <td class="p-3 text-center"><button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 font-bold">X</button></td>
            </tr>
        `;
    });
    calculateCartTotals();
}

function removeFromCart(index) { cart.splice(index, 1); renderCartTable(); }

function calculateCartTotals() {
    let subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let gst = document.getElementById('apply-gst').checked ? subtotal * 0.18 : 0;
    document.getElementById('cart-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById('cart-gst').innerText = `₹${gst.toFixed(2)}`;
    document.getElementById('cart-grandtotal').innerText = `₹${(subtotal + gst).toFixed(2)}`;
}

function saveInvoice() {
    if (cart.length === 0) return alert("Cannot save empty invoice.");
    
    const customerName = document.getElementById('bill-customer').value || "Walk-in Customer";
    const method = document.querySelector('input[name="payment"]:checked').value;
    let subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let grandTotal = document.getElementById('apply-gst').checked ? subtotal * 1.18 : subtotal;

    cart.forEach(cartItem => {
        let p = products.find(prod => prod.code === cartItem.code);
        if(p) p.stock -= cartItem.qty;
    });

    customersData.unshift({ bill: getInvoiceNumber(), name: customerName, amount: grandTotal.toFixed(2), date: new Date().toLocaleDateString('en-GB'), method: method });

    alert(`${getInvoiceNumber()} saved successfully!`);
    
    invoiceCounter++; cart = [];
    document.getElementById('bill-customer').value = ''; document.getElementById('apply-gst').checked = false;
    renderCartTable(); renderProductDropdown();
    switchTab('dashboard'); 
}

// 5. CUSTOMERS & DASHBOARD LOGIC
function renderCustomersTable() {
    const tbody = document.getElementById('customers-table-body');
    tbody.innerHTML = '';
    customersData.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td class="p-4 font-mono text-slate-300">${c.bill}</td>
                <td class="p-4 font-bold text-white">${c.name}</td>
                <td class="p-4 text-slate-400">${c.date}</td>
                <td class="p-4 text-white">${c.method}</td>
                <td class="p-4 text-right font-bold text-white">₹${c.amount}</td>
            </tr>
        `;
    });
}

function renderDashboard() {
    let todaySales = 0, cashTotal = 0, cashCount = 0, upiTotal = 0, upiCount = 0, splitTotal = 0, splitCount = 0;

    customersData.forEach(c => {
        let amt = parseFloat(c.amount);
        todaySales += amt;
        if(c.method === 'Cash') { cashTotal += amt; cashCount++; }
        else if(c.method === 'UPI') { upiTotal += amt; upiCount++; }
        else { splitTotal += amt; splitCount++; }
    });

    document.getElementById('dash-sales').innerText = `₹${todaySales.toFixed(0)}`;
    document.getElementById('dash-invoices').innerText = customersData.length;
    
    document.getElementById('dash-cash-amount').innerText = `₹${cashTotal.toFixed(0)}`;
    document.getElementById('dash-cash-count').innerText = `(${cashCount} bills)`;

    document.getElementById('dash-upi-amount').innerText = `₹${upiTotal.toFixed(0)}`;
    document.getElementById('dash-upi-count').innerText = `(${upiCount} bills)`;

    document.getElementById('dash-split-amount').innerText = `₹${splitTotal.toFixed(0)}`;
    document.getElementById('dash-split-count').innerText = `(${splitCount} bills)`;

    let lowStockCount = products.filter(p => p.stock < 15).length;
    document.getElementById('dash-low-stock').innerText = lowStockCount;
    document.getElementById('stock-alert-badge').innerText = lowStockCount;

    const tbody = document.getElementById('recent-transactions-body');
    tbody.innerHTML = '';
    
    if(customersData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-slate-500">No transactions yet today.</td></tr>';
        return;
    }

    customersData.slice(0, 5).forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td class="p-4 font-mono text-slate-300">${c.bill}</td>
                <td class="p-4 font-bold text-white">${c.name}</td>
                <td class="p-4 text-slate-400">${c.date}</td>
                <td class="p-4 text-white">${c.method}</td>
                <td class="p-4 text-right font-bold text-green-400">₹${c.amount}</td>
            </tr>
        `;
    });
}

// 6. EXPORT DATABASE (CSV)
function exportDatabaseCSV() {
    if (customersData.length === 0 && products.length === 0) {
        alert("No data available to export."); return;
    }

    let csvContent = "=== STORE DATABASE EXPORT ===\n\n--- RECENT TRANSACTIONS ---\nBill Number,Customer Name,Date,Payment Method,Amount Paid\n";
    customersData.forEach(c => { csvContent += `"${c.bill}","${c.name}","${c.date}","${c.method}","${c.amount}"\n`; });

    csvContent += "\n--- INVENTORY STOCK ---\nItem Code,Item Name,Size,Purchase Price,Selling Price,Current Stock\n";
    products.forEach(p => { csvContent += `"${p.code}","${p.name}","${p.size}","${p.cp}","${p.sp}","${p.stock}"\n`; });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Store_Database_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Expose functions to global scope for inline event handlers
window.toggleTheme = toggleTheme;
window.toggleSidebar = toggleSidebar;
window.switchTab = switchTab;
window.saveNewProduct = saveNewProduct;
window.renderStockTable = renderStockTable;
window.renderProductDropdown = renderProductDropdown;
window.autoFillPrice = autoFillPrice;
window.addToCart = addToCart;
window.renderCartTable = renderCartTable;
window.removeFromCart = removeFromCart;
window.calculateCartTotals = calculateCartTotals;
window.saveInvoice = saveInvoice;
window.renderCustomersTable = renderCustomersTable;
window.renderDashboard = renderDashboard;
window.exportDatabaseCSV = exportDatabaseCSV;

function initApp() {
    // Start in light theme by default
    document.body.classList.add('light-mode');
    const icon = document.getElementById('theme-icon');
    if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }

    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('w-72');
            sidebar.classList.add('w-0', 'opacity-0');
        }
    }

    switchTab('dashboard');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}