// --- DOM Elements ---
const fractalTypeSelect = document.getElementById('fractal-type');
const depthInput = document.getElementById('depth');
const depthValueSpan = document.getElementById('depth-value');
const hueInput = document.getElementById('hue');
const hueValueSpan = document.getElementById('hue-value');
const strokeCheckbox = document.getElementById('stroke');
const generateBtn = document.getElementById('generate-btn');

// Control Groups
const vectorControls = document.getElementById('vector-controls');
const treeControls = document.getElementById('tree-controls');
const mandelbrotControls = document.getElementById('mandelbrot-controls');

// Tree Specific Controls
const treeAngleInput = document.getElementById('tree-angle');
const treeAngleValueSpan = document.getElementById('tree-angle-value');
const treeScaleInput = document.getElementById('tree-scale');
const treeScaleValueSpan = document.getElementById('tree-scale-value');

// Mandelbrot Specific Controls
const mandelbrotIterationsInput = document.getElementById('mandelbrot-iterations');
const mandelbrotIterationsValueSpan = document.getElementById('mandelbrot-iterations-value');

// Display Containers & Elements
const svgContainer = document.getElementById('svg-container');
const canvasContainer = document.getElementById('canvas-container');
const fractalSvg = document.getElementById('fractal-svg');
const fractalCanvas = document.getElementById('fractal-canvas');
const canvasCtx = fractalCanvas.getContext('2d');

const noteElement = document.getElementById('note');

const SVG_NS = "http://www.w3.org/2000/svg";
const CANVAS_WIDTH = fractalCanvas.width;
const CANVAS_HEIGHT = fractalCanvas.height;

// --- Helper Functions ---

function midpoint(p1, p2) { return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }; }
function distance(p1, p2) { return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2); }
function degreesToRadians(degrees) { return degrees * Math.PI / 180; }

// Simple HSL color function
function getColor(hue, saturation, lightness) {
    return `hsl(${hue % 360}, ${saturation}%, ${lightness}%)`;
}

// Map value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// --- SVG Element Creation ---
function createSvgElement(type, attributes) {
    const el = document.createElementNS(SVG_NS, type);
    for (const key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
    el.classList.add('fractal-shape');
    return el;
}

function createPolygon(points, fillColor, strokeColor) {
    const pointsString = points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    return createSvgElement('polygon', {
        points: pointsString,
        fill: fillColor,
        stroke: strokeColor || 'none',
    });
}

function createRect(x, y, width, height, fillColor, strokeColor) {
     return createSvgElement('rect', {
        x: x.toFixed(2), y: y.toFixed(2),
        width: width.toFixed(2), height: height.toFixed(2),
        fill: fillColor,
        stroke: strokeColor || 'none',
    });
}

function createLine(p1, p2, strokeColor, strokeWidth = 0.5) {
     return createSvgElement('line', {
        x1: p1.x.toFixed(2), y1: p1.y.toFixed(2),
        x2: p2.x.toFixed(2), y2: p2.y.toFixed(2),
        stroke: strokeColor || 'black',
        'stroke-width': strokeWidth,
    });
}


// --- Fractal Drawing Functions ---

// --- 1. Sierpinski Triangle ---
function drawSierpinskiTriangle(p1, p2, p3, depth, maxDepth, baseHue, applyStroke) {
    if (depth <= 0) {
        const hue = (baseHue + (maxDepth - depth) * 20) % 360;
        const lightness = 45 + depth * 5;
        const saturation = 75 - depth * 4;
        const fillColor = getColor(hue, saturation, lightness);
        const strokeColor = applyStroke ? getColor(hue, saturation, lightness - 15) : null;
        fractalSvg.appendChild(createPolygon([p1, p2, p3], fillColor, strokeColor));
        return;
    }
    const m12 = midpoint(p1, p2);
    const m23 = midpoint(p2, p3);
    const m31 = midpoint(p3, p1);
    drawSierpinskiTriangle(p1, m12, m31, depth - 1, maxDepth, baseHue, applyStroke);
    drawSierpinskiTriangle(m12, p2, m23, depth - 1, maxDepth, baseHue, applyStroke);
    drawSierpinskiTriangle(m31, m23, p3, depth - 1, maxDepth, baseHue, applyStroke);
}

// --- 2. Sierpinski Carpet ---
function drawSierpinskiCarpet(x, y, size, depth, maxDepth, baseHue, applyStroke) {
    if (depth <= 0) return; // Don't draw the base case squares, only the 'holes' are implied

    const subSize = size / 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i === 1 && j === 1) { // Center square - draw it as the 'hole'
                const hue = (baseHue + (maxDepth - depth) * 25) % 360;
                const lightness = 40 + depth * 6;
                const saturation = 80 - depth * 5;
                const fillColor = getColor(hue, saturation, lightness);
                 const strokeColor = applyStroke ? getColor(hue, saturation, lightness - 15) : null;
                fractalSvg.appendChild(createRect(x + subSize, y + subSize, subSize, subSize, fillColor, strokeColor));
            } else {
                 // Recurse for the outer squares
                drawSierpinskiCarpet(x + i * subSize, y + j * subSize, subSize, depth - 1, maxDepth, baseHue, applyStroke);
            }
        }
    }
}

// --- 3. Koch Snowflake ---
function drawKochSegment(p1, p2, depth, maxDepth, baseHue, applyStroke) {
    if (depth <= 0) {
         const hue = (baseHue + depth * 15) % 360;
         const lightness = 50 - depth * 4;
         const saturation = 90;
         const strokeColor = getColor(hue, saturation, lightness);
         fractalSvg.appendChild(createLine(p1, p2, strokeColor, 0.7)); // Thicker line maybe
        return;
    }

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const pA = { x: p1.x + dx / 3, y: p1.y + dy / 3 };
    const pB = { x: p1.x + 2 * dx / 3, y: p1.y + 2 * dy / 3 };

    // Tip of the Koch spike (rotate 60 degrees)
    const angle = Math.atan2(dy, dx);
    const length = distance(p1,p2) / 3;
    const pTip = {
        x: pA.x + Math.cos(angle - Math.PI / 3) * length,
        y: pA.y + Math.sin(angle - Math.PI / 3) * length
    };

    drawKochSegment(p1, pA, depth - 1, maxDepth, baseHue, applyStroke);
    drawKochSegment(pA, pTip, depth - 1, maxDepth, baseHue, applyStroke);
    drawKochSegment(pTip, pB, depth - 1, maxDepth, baseHue, applyStroke);
    drawKochSegment(pB, p2, depth - 1, maxDepth, baseHue, applyStroke);
}

function drawKochSnowflake(cx, cy, size, depth, baseHue, applyStroke) {
    // Initial equilateral triangle points centered around (cx, cy)
    const height = size * Math.sqrt(3) / 2;
    const p1 = { x: cx, y: cy - (2/3) * height };
    const p2 = { x: cx - size / 2, y: cy + (1/3) * height };
    const p3 = { x: cx + size / 2, y: cy + (1/3) * height };

    drawKochSegment(p1, p2, depth, depth, baseHue, applyStroke);
    drawKochSegment(p2, p3, depth, depth, baseHue, applyStroke);
    drawKochSegment(p3, p1, depth, depth, baseHue, applyStroke);
}

// --- 4. Fractal Tree ---
function drawFractalTree(x, y, angle, length, depth, maxDepth, baseHue, branchAngle, scaleFactor) {
    if (depth <= 0) return;

    const x2 = x + Math.cos(degreesToRadians(angle)) * length;
    const y2 = y + Math.sin(degreesToRadians(angle)) * length;

    const hue = (baseHue + (maxDepth - depth) * 15) % 360; // Color varies with depth
    const lightness = 60 - (maxDepth - depth) * 4; // Thinner branches darker/lighter?
    const saturation = 85;
    const strokeColor = getColor(hue, saturation, lightness);
    const strokeWidth = Math.max(0.2, depth * 0.5); // Thicker base, thinner tips

    fractalSvg.appendChild(createLine({x, y}, {x: x2, y: y2}, strokeColor, strokeWidth));

    // Recurse for two branches
    drawFractalTree(x2, y2, angle - branchAngle, length * scaleFactor, depth - 1, maxDepth, baseHue, branchAngle, scaleFactor);
    drawFractalTree(x2, y2, angle + branchAngle, length * scaleFactor, depth - 1, maxDepth, baseHue, branchAngle, scaleFactor);
}

// --- 5. Mandelbrot Set ---
function drawMandelbrotSet(maxIterations, baseHue) {
    const maxIter = parseInt(maxIterations, 10);
    const imgData = canvasCtx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imgData.data;

    // Define the complex plane area to plot
    const minRe = -2.0;
    const maxRe = 1.0;
    const minIm = -1.2;
    const maxIm = minIm + (maxRe - minRe) * CANVAS_HEIGHT / CANVAS_WIDTH; // Adjust Im range based on aspect ratio

    for (let px = 0; px < CANVAS_WIDTH; px++) {
        for (let py = 0; py < CANVAS_HEIGHT; py++) {
            // Map pixel coordinate to complex number (c)
            const cRe = mapRange(px, 0, CANVAS_WIDTH, minRe, maxRe);
            const cIm = mapRange(py, 0, CANVAS_HEIGHT, minIm, maxIm);

            let zRe = 0, zIm = 0;
            let n = 0; // Iteration count

            // Iterate z = z^2 + c
            while (n < maxIter) {
                const zRe2 = zRe * zRe;
                const zIm2 = zIm * zIm;

                // Check if magnitude squared > 4 (escaped)
                if (zRe2 + zIm2 > 4) break;

                // Calculate next z:
                // zRe = zRe^2 - zIm^2 + cRe
                // zIm = 2 * zRe * zIm + cIm
                const nextZRe = zRe2 - zIm2 + cRe;
                const nextZIm = 2 * zRe * zIm + cIm;
                zRe = nextZRe;
                zIm = nextZIm;
                n++;
            }

            // Color the pixel based on iteration count
            const pixelIndex = (py * CANVAS_WIDTH + px) * 4;
            let r = 0, g = 0, b = 0;

            if (n < maxIter) { // Escaped - Color based on escape speed
                const hue = (baseHue + n * 10) % 360; // Cycle hue based on iteration
                const saturation = 90; // Vivid colors
                const lightness = mapRange(Math.sqrt(n / maxIter), 0, 1, 20, 70); // Brighter for faster escape (sqrt makes it non-linear)

                // Convert HSL to RGB (simple approximation)
                const C = (1 - Math.abs(2 * (lightness/100) - 1)) * (saturation/100);
                const Hprime = hue / 60;
                const X = C * (1 - Math.abs(Hprime % 2 - 1));
                let R1=0, G1=0, B1=0;
                if (Hprime >= 0 && Hprime < 1) { R1 = C; G1 = X; }
                else if (Hprime >= 1 && Hprime < 2) { R1 = X; G1 = C; }
                else if (Hprime >= 2 && Hprime < 3) { G1 = C; B1 = X; }
                else if (Hprime >= 3 && Hprime < 4) { G1 = X; B1 = C; }
                else if (Hprime >= 4 && Hprime < 5) { R1 = X; B1 = C; }
                else if (Hprime >= 5 && Hprime < 6) { R1 = C; B1 = X; }
                const m = (lightness/100) - C/2;
                r = Math.round((R1+m)*255);
                g = Math.round((G1+m)*255);
                b = Math.round((B1+m)*255);

            } // Else: Inside the set, remains black (r=0, g=0, b=0)

            data[pixelIndex] = r;     // Red
            data[pixelIndex + 1] = g; // Green
            data[pixelIndex + 2] = b; // Blue
            data[pixelIndex + 3] = 255; // Alpha (fully opaque)
        }
    }
    canvasCtx.putImageData(imgData, 0, 0);
}


// --- UI Update and Generation Logic ---

function updateUI() {
    const selectedType = fractalTypeSelect.value;

    // Hide all specific control groups first
    vectorControls.style.display = 'none';
    treeControls.style.display = 'none';
    mandelbrotControls.style.display = 'none';

     // Hide/Show display containers
    svgContainer.style.display = 'none';
    canvasContainer.style.display = 'none';

    // Reset depth limits and default values based on type
    let maxDepth = 8;
    let defaultDepth = 5;
    let showDepth = true;
    let showHue = true;
    let showStroke = false; // Only relevant for SVG vector types
    noteElement.textContent = "Note: High recursion depths or iterations can be slow.";


    if (selectedType === 'sierpinski-triangle') {
        vectorControls.style.display = 'contents'; // Use 'contents' for grid layout
        svgContainer.style.display = 'block';
        maxDepth = 8; defaultDepth = 5; showStroke = true;
    } else if (selectedType === 'sierpinski-carpet') {
        vectorControls.style.display = 'contents';
        svgContainer.style.display = 'block';
        maxDepth = 5; defaultDepth = 4; showStroke = true; // Carpet gets complex faster
        noteElement.textContent = "Note: Carpet depth > 4 can be very slow.";
    } else if (selectedType === 'koch-snowflake') {
        vectorControls.style.display = 'contents';
        svgContainer.style.display = 'block';
        maxDepth = 6; defaultDepth = 4; showStroke = false; // Stroke is inherent
        strokeCheckbox.parentElement.style.display = 'none'; // Hide stroke option itself for Koch
        strokeCheckbox.previousElementSibling.style.display = 'none';
    } else if (selectedType === 'fractal-tree') {
        treeControls.style.display = 'contents';
        svgContainer.style.display = 'block';
        maxDepth = 10; defaultDepth = 8; showStroke = false; // Stroke is inherent
    } else if (selectedType === 'mandelbrot') {
        mandelbrotControls.style.display = 'contents';
        canvasContainer.style.display = 'block';
        showDepth = false; // Mandelbrot uses iterations, not depth
        showStroke = false;
        noteElement.textContent = "Note: High iterations can take significant time to render.";
    }

    // Show/hide common controls based on flags
    depthInput.parentElement.style.display = showDepth ? 'contents' : 'none';
    hueInput.parentElement.style.display = showHue ? 'contents' : 'none';
    // Hide/Show stroke control specifically (check parent element for visibility)
    const strokeLabel = document.querySelector('label[for="stroke"]');
    const strokeSpan = strokeCheckbox.nextElementSibling;
    if (strokeLabel) strokeLabel.style.display = showStroke ? '' : 'none';
    strokeCheckbox.style.display = showStroke ? '' : 'none';
    if(strokeSpan) strokeSpan.style.display = showStroke ? '' : 'none';


    // Update depth slider max and value if changed
    if (showDepth) {
        const currentDepth = parseInt(depthInput.value, 10);
        depthInput.max = maxDepth;
        if (currentDepth > maxDepth) {
            depthInput.value = defaultDepth; // Reset if current exceeds new max
        }
         depthValueSpan.textContent = depthInput.value; // Update display
    }

    // Update other values shown in spans
    hueValueSpan.textContent = hueInput.value;
    treeAngleValueSpan.textContent = treeAngleInput.value;
    treeScaleValueSpan.textContent = parseFloat(treeScaleInput.value).toFixed(2);
    mandelbrotIterationsValueSpan.textContent = mandelbrotIterationsInput.value;
}


function generateFractal() {
    const type = fractalTypeSelect.value;
    const depth = parseInt(depthInput.value, 10);
    const baseHue = parseInt(hueInput.value, 10);
    const applyStroke = strokeCheckbox.checked;

    // Clear previous fractal
    fractalSvg.innerHTML = '';
    canvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear canvas too

    // Set ViewBox for SVG - use 500x500 generally
    const viewboxSize = 500;
    const margin = 10; // Margin for SVG fractals
    fractalSvg.setAttribute('viewBox', `0 0 ${viewboxSize} ${viewboxSize}`);


    // Disable button during generation
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Use setTimeout to allow UI to update before potentially blocking generation
    setTimeout(() => {
        try {
             switch (type) {
                case 'sierpinski-triangle':
                    const triHeight = (viewboxSize - 2 * margin) * Math.sqrt(3) / 2;
                    const topPoint = { x: viewboxSize / 2, y: margin };
                    const leftPoint = { x: margin, y: margin + triHeight };
                    const rightPoint = { x: viewboxSize - margin, y: margin + triHeight };
                    fractalSvg.setAttribute('viewBox', `0 0 ${viewboxSize} ${Math.ceil(triHeight + 2 * margin)}`); // Adjust height
                    drawSierpinskiTriangle(topPoint, leftPoint, rightPoint, depth, depth, baseHue, applyStroke);
                    break;

                case 'sierpinski-carpet':
                    const initialSize = viewboxSize - 2 * margin;
                    // Need an initial 'background' rectangle if stroke is off, otherwise it looks empty
                     if (!applyStroke) {
                        fractalSvg.appendChild(createRect(margin, margin, initialSize, initialSize, '#ddd', null));
                     }
                    drawSierpinskiCarpet(margin, margin, initialSize, depth, depth, baseHue, applyStroke);
                    break;

                case 'koch-snowflake':
                     const snowflakeSize = viewboxSize * 0.6; // Scale it down a bit
                     const cx = viewboxSize / 2;
                     const cy = viewboxSize / 2 + snowflakeSize * 0.1; // Adjust vertical centering
                    drawKochSnowflake(cx, cy, snowflakeSize, depth, baseHue, applyStroke);
                    break;

                case 'fractal-tree':
                    const angle = parseFloat(treeAngleInput.value);
                    const scale = parseFloat(treeScaleInput.value);
                    const initialLength = viewboxSize * 0.25; // Initial trunk length
                    const startX = viewboxSize / 2;
                    const startY = viewboxSize - margin; // Start at the bottom middle
                    drawFractalTree(startX, startY, -90, initialLength, depth, depth, baseHue, angle, scale); // -90 degrees is upward
                    break;

                case 'mandelbrot':
                    const iterations = parseInt(mandelbrotIterationsInput.value, 10);
                    drawMandelbrotSet(iterations, baseHue);
                    break;
            }
        } catch (error) {
            console.error("Error generating fractal:", error);
            noteElement.textContent = "An error occurred during generation. Check console.";
        } finally {
             // Re-enable button
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate';
        }
    }, 10); // Small delay (10ms)


}

// --- Event Listeners ---

// Update span values when sliders change
depthInput.addEventListener('input', e => depthValueSpan.textContent = e.target.value);
hueInput.addEventListener('input', e => hueValueSpan.textContent = e.target.value);
treeAngleInput.addEventListener('input', e => treeAngleValueSpan.textContent = e.target.value);
treeScaleInput.addEventListener('input', e => treeScaleValueSpan.textContent = parseFloat(e.target.value).toFixed(2));
mandelbrotIterationsInput.addEventListener('input', e => mandelbrotIterationsValueSpan.textContent = e.target.value);

// Update UI when fractal type changes
fractalTypeSelect.addEventListener('change', updateUI);

// Regenerate fractal on button click
generateBtn.addEventListener('click', generateFractal);

// --- Initial Setup ---
updateUI(); // Set initial UI state based on default selection
generateFractal(); // Draw the initial fractal