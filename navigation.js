// 通用导航栏加载脚本
let currentMenuId = null;

// 获取当前页面，设置对应的菜单高亮
function getCurrentPageId() {
    const path = window.location.pathname;
    if (path.includes('add_sub.html')) {
        return 'math';
    } else if (path.includes('mult.html')) {
        return 'math';
    } else if (path.includes('index.html') || path.endsWith('/')) {
        return null;
    }
    return null;
}

// 加载导航栏
async function loadNavigation() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error('Menu not found');
        
        const data = await response.json();
        renderNavigation(data.menu);
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// 渲染导航栏
function renderNavigation(menuItems) {
    currentMenuId = getCurrentPageId();
    
    const navContainer = document.getElementById('mainNav');
    navContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `nav-item ${item.id === currentMenuId ? 'active' : ''}`;
        menuItem.setAttribute('data-subject', item.id);
        
        // 菜单标题
        menuItem.innerHTML = `
            ${item.name}
            <div class="dropdown"></div>
        `;
        
        // 添加下拉项
        const dropdown = menuItem.querySelector('.dropdown');
        item.items.forEach(subItem => {
            const dropdownItem = document.createElement('div');
            dropdownItem.className = 'dropdown-item';
            dropdownItem.textContent = subItem.name;
            dropdownItem.addEventListener('click', (e) => {
                e.stopPropagation();
                if (subItem.url && subItem.url !== '#') {
                    window.location.href = subItem.url;
                }
            });
            dropdown.appendChild(dropdownItem);
        });
        
        navContainer.appendChild(menuItem);
    });
    
    // 添加导航点击事件（保持原有的激活状态逻辑）
    addNavigationEvents();
}

// 添加导航点击事件
function addNavigationEvents() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('dropdown-item')) {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// 初始化导航
document.addEventListener('DOMContentLoaded', loadNavigation);
