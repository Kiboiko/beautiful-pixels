const pixelGrid = document.getElementById('pixelGrid');
const artsList = document.getElementById('artsList');
const saveBtn = document.getElementById('saveBtn');
const clrBtn = document.getElementById('clrBtn');
const palette = document.getElementById('palette');
let selectedColor = '#111';
const gridSize = 40;
const pixelCount = gridSize * gridSize;
const defaultColor = '#222';
let isMouseDown = false;
let isErasing = false;

const gridState = {
    pixels: Array(gridSize).fill().map(() => Array(gridSize).fill(defaultColor)),
    
    save: function() {
        const currentArt = this.pixels.map(row => [...row]);
        const isEmpty = currentArt.every(row => 
            row.every(pixel => pixel === defaultColor)
        );
        
        if (isEmpty) {
            alert('Нельзя сохранить пустой рисунок!');
            return;
        }
        
        const timestamp = new Date().toISOString();
        const savedArts = JSON.parse(localStorage.getItem('pixelArts') || '[]');
        savedArts.unshift({
            id: timestamp,
            data: currentArt
        });
        
        localStorage.setItem('pixelArts', JSON.stringify(savedArts));
        this.loadArts();
        alert('Рисунок сохранен!');
    },
    
    loadArts: function() {
        artsList.innerHTML = '';
        const savedArts = JSON.parse(localStorage.getItem('pixelArts') || '[]');
        
        if (savedArts.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Нет сохраненных рисунков';
            artsList.appendChild(li);
            return;
        }
        
        savedArts.forEach((art, index) => {
            const li = document.createElement('li');
            
            const artInfo = document.createElement('span');
            artInfo.textContent = `Рисунок ${index + 1} (${new Date(art.id).toLocaleString()})`;
            artInfo.addEventListener('click', () => this.loadArt(art.data));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteArt(art.id);
            });
            
            li.appendChild(artInfo);
            li.appendChild(deleteBtn);
            artsList.appendChild(li);
        });
    },
    
    deleteArt: function(id) {
        
        
        const savedArts = JSON.parse(localStorage.getItem('pixelArts') || '[]');
        const updatedArts = savedArts.filter(art => art.id !== id);
        
        localStorage.setItem('pixelArts', JSON.stringify(updatedArts));
        this.loadArts();
    },
    
    loadArt: function(artData) {
        this.clear(false);
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                this.pixels[y][x] = artData[y][x];
                const index = y * gridSize + x;
                const pixel = pixelGrid.children[index];
                pixel.style.backgroundColor = artData[y][x];
                pixel.dataset.locked = artData[y][x] !== defaultColor ? 'true' : 'false';
            }
        }
    },
    
    clear: function(confirmClear = true) {
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                this.pixels[y][x] = defaultColor;
                const index = y * gridSize + x;
                const pixel = pixelGrid.children[index];
                pixel.style.backgroundColor = defaultColor;
                pixel.dataset.locked = 'false';
            }
        }
    }
};

// Остальной код остается без изменений
function initGrid() {
    pixelGrid.innerHTML = '';
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.dataset.locked = 'false';
            pixel.style.backgroundColor = gridState.pixels[y][x];
            pixelGrid.appendChild(pixel);

            pixel.addEventListener('mouseenter', () => {
                if (isErasing) {
                    pixel.style.backgroundColor = defaultColor;
                    pixel.dataset.locked = 'false';
                    gridState.pixels[y][x] = defaultColor;
                } else if (isMouseDown && pixel.dataset.locked === 'false') {
                    const color = getPastelColor();
                    pixel.style.backgroundColor = color;
                    pixel.dataset.locked = 'true';
                    gridState.pixels[y][x] = color;
                } else if (pixel.dataset.locked === 'false') {
                    pixel.style.backgroundColor = getPastelColor();
                }
            });

            pixel.addEventListener('mouseleave', () => {
                if (pixel.dataset.locked === 'false' && !isErasing) {
                    pixel.style.backgroundColor = defaultColor;
                }
            });

            pixel.addEventListener('mousedown', (e) => {
                const color = e.button === 0 ? getPastelColor() : defaultColor;
                pixel.style.backgroundColor = color;
                pixel.dataset.locked = e.button === 0 ? 'true' : 'false';
                gridState.pixels[y][x] = color;
            });
        }
    }
}

document.addEventListener('mousedown', (e) => {
    if (e.button === 0) { 
        isMouseDown = true;
        isErasing = false;
    } else if (e.button === 2) {
        isErasing = true;
    }
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
    isErasing = false;
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

saveBtn.addEventListener('click', () => gridState.save());
clrBtn.addEventListener('click', () => gridState.clear());

function generateColorPalette() {
    const colors = [
        '#FF0000', '#00FF00', '#0000FF', 
        '#FFFF00', '#FF00FF', '#00FFFF',

        '#FFB6C1', '#FFD700', '#98FB98',
        '#ADD8E6', '#DDA0DD', '#FFA07A',

        '#FFFFFF', '#C0C0C0', '#808080',
        '#000000'
    ];
    palette.innerHTML = '';

    colors.forEach(color =>{
        const li = document.createElement('li');
        li.className = 'color-item';

        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = 'color';
        radio.className = 'color-radio';
        radio.value = color;

        radio.addEventListener('change', () => {
            selectedColor = color;
        });

        if (color === colors[0]) {
            radio.checked = true;
            selectedColor = color;
        }
        
        const preview = document.createElement('div');
        preview.className = 'color-preview';
        preview.style.backgroundColor = color;
        
        const label = document.createElement('span');
        label.className = 'color-label';
        label.textContent = color;
        
        li.appendChild(radio);
        li.appendChild(preview);
        li.appendChild(label);
        palette.appendChild(li);
    });
}



function getPastelColor() {
    // const r = Math.floor(Math.random() * 128 + 128);
    // const g = Math.floor(Math.random() * 128 + 128);
    // const b = Math.floor(Math.random() * 128 + 128);
    // return `rgb(${r}, ${g}, ${b})`;
    return selectedColor;
}


generateColorPalette();
initGrid();
gridState.loadArts();