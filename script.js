const pixelGrid = document.getElementById('pixelGrid');
const artsList = document.getElementById('artsList');
const saveBtn = document.getElementById('saveBtn');
const clrBtn = document.getElementById('clrBtn');
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
            li.textContent = `Рисунок ${index + 1} (${new Date(art.id).toLocaleString()})`;
            li.addEventListener('click', () => this.loadArt(art.data));
            artsList.appendChild(li);
        });
    },
    
    loadArt: function(artData) {
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

saveBtn.addEventListener('click', () => {
    gridState.save();
});

clrBtn.addEventListener('click', () => {
    gridState.clear();
});

function getPastelColor() {
    const r = Math.floor(Math.random() * 128 + 128);
    const g = Math.floor(Math.random() * 128 + 128);
    const b = Math.floor(Math.random() * 128 + 128);
    return `rgb(${r}, ${g}, ${b})`;
}

initGrid();
gridState.loadArts();