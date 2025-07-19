const pixelGrid = document.getElementById('pixelGrid');
const gridSize = 40;
const pixelCount = gridSize * gridSize;
const defaultColor = '#222';
let isMouseDown = false;
let isErasing = false

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

for (let i = 0; i < pixelCount; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.dataset.locked = 'false';
    pixelGrid.appendChild(pixel);

    pixel.addEventListener('mouseenter', () => {
        if (isErasing) {
            pixel.style.backgroundColor = defaultColor;
            pixel.dataset.locked = 'false';
        } else if (isMouseDown && pixel.dataset.locked === 'false') {
            pixel.style.backgroundColor = getPastelColor();
            pixel.dataset.locked = 'true';
        } else if (pixel.dataset.locked === 'false') {
            pixel.style.backgroundColor = getPastelColor();
        }
    });

    pixel.addEventListener('mouseleave', () => {
        if (pixel.dataset.locked === 'false' && !isErasing) {
            pixel.style.backgroundColor = defaultColor;
        }
    });

    pixel.addEventListener('click', (e) => {
        if (e.button === 0) {
            pixel.dataset.locked = 'true';
        }
    });
}

function getPastelColor() {
    const r = Math.floor(Math.random() * 128 + 128);
    const g = Math.floor(Math.random() * 128 + 128);
    const b = Math.floor(Math.random() * 128 + 128);
    return `rgb(${r}, ${g}, ${b})`;
}