// 通用导航栏加载脚本
let currentMenuId = null;

function getCurrentPageId() {
    const path = window.location.pathname;
    if (path.includes('/math/')) {
        return 'math';
    } else if (path.includes('index.html') || path.endsWith('/')) {
        return null;
    }
    return null;
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/math/')) {
        return '';  // 已经在 math 目录下，直接使用相对路径
    }
    return 'math/';  // 在根目录，需要加上 math/
}

const defaultMenu = [
    {
        id: 'chinese',
        name: '语文',
        items: [
            { name: '看拼音写汉字', url: '#' },
            { name: '阅读理解', url: '#' },
            { name: '作文素材', url: '#' }
        ]
    },
    {
        id: 'math',
        name: '数学',
        items: [
            { name: '凑十法练习题', url: getBasePath() + 'complement_ten.html' },
            { name: '破十法练习题', url: getBasePath() + 'break_ten.html' },
            { name: '平十法练习题', url: getBasePath() + 'flatten_ten.html' },
            { name: '借十法练习题', url: getBasePath() + 'borrow_ten.html' },
            { name: '加减法练习题', url: getBasePath() + 'add_sub.html' },
            { name: '乘法练习题', url: getBasePath() + 'mult.html' },
            { name: '除法练习题', url: getBasePath() + 'div.html' },
            { name: '综合运算练习题', url: getBasePath() + 'mixed_operations.html' }
        ]
    },
    {
        id: 'english',
        name: '英语',
        items: [
            { name: '单词默写', url: '#' },
            { name: '短文填空', url: '#' },
            { name: '翻译练习', url: '#' }
        ]
    }
];

async function loadNavigation() {
    try {
        const menuPath = window.location.pathname.includes('/math/') ? '../js/menu.json' : 'js/menu.json';
        const response = await fetch(menuPath);
        if (!response.ok) throw new Error('Menu not found');
        
        const data = await response.json();
        const basePath = getBasePath();
        // 动态调整 JSON 中的链接路径
        data.menu.forEach(subject => {
            subject.items.forEach(item => {
                if (item.url && item.url.startsWith('math/')) {
                    item.url = basePath + item.url.replace('math/', '');
                }
            });
        });
        renderNavigation(data.menu);
    } catch (error) {
        console.error('JSON加载失败，使用降级方案:', error);
        renderNavigation(defaultMenu);
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
        
        menuItem.innerHTML = `
            ${item.name}
            <div class="dropdown"></div>
        `;
        
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
