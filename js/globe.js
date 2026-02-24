/**
 * Interactive Global Map Visualization (2D fallback-first)
 * Reliable drag/pan interaction with location markers and tooltips
 */

class GlobeVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.width = 0;
        this.height = 0;
        this.mapRect = { x: 0, y: 0, width: 0, height: 0 };

        this.locations = careerData?.locations || [];
        this.markerPoints = [];
        this.hoveredLocation = null;

        this.offsetX = 0;
        this.velocityX = 0;
        this.dragState = {
            active: false,
            pointerId: null,
            lastX: 0,
            lastMoveTs: 0,
            lastDelta: 0
        };

        this.tooltip = null;
        this.mapImage = null;
        this.mapReady = false;
        this.continentPolygons = this.getContinentPolygons();

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupTooltip();
        this.setupEventListeners();
        this.loadMapTexture();
        this.resize();

        if (this.prefersReducedMotion) {
            this.render();
            return;
        }

        this.animate();
    }

    setupCanvas() {
        this.canvas.className = 'global-map-canvas';
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.cursor = 'grab';
        this.canvas.style.touchAction = 'none';
        this.canvas.style.pointerEvents = 'auto';
        this.canvas.style.position = 'relative';
        this.canvas.style.zIndex = '10';

        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
    }

    setupTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'globe-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(99, 102, 241, 0.5);
            border-radius: 8px;
            padding: 12px 16px;
            color: white;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            transform: translateX(-50%);
            transition: opacity 0.2s ease;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 250px;
        `;
        this.container.appendChild(this.tooltip);
    }

    loadMapTexture() {
        const candidates = [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2048px-World_map_-_low_resolution.svg.png',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/World_Map_Blank_-_with_blue_sea.svg/2048px-World_Map_Blank_-_with_blue_sea.svg.png'
        ];

        const tryLoad = (index = 0) => {
            if (index >= candidates.length) {
                this.mapReady = false;
                return;
            }

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.mapImage = img;
                this.mapReady = true;
            };
            img.onerror = () => tryLoad(index + 1);
            img.src = candidates[index];
        };

        tryLoad();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 550;

        this.canvas.width = Math.floor(this.width * dpr);
        this.canvas.height = Math.floor(this.height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const idealHeight = Math.min(this.height, this.width / 2);
        const mapHeight = Math.max(220, idealHeight);
        const mapWidth = mapHeight * 2;

        this.mapRect = {
            width: mapWidth,
            height: mapHeight,
            x: (this.width - mapWidth) / 2,
            y: (this.height - mapHeight) / 2
        };
    }

    setupEventListeners() {
        const onPointerDown = (e) => {
            this.dragState.active = true;
            this.dragState.pointerId = e.pointerId ?? null;
            this.dragState.lastX = e.clientX;
            this.dragState.lastMoveTs = performance.now();
            this.dragState.lastDelta = 0;
            this.canvas.style.cursor = 'grabbing';

            if (typeof e.pointerId === 'number' && this.canvas.setPointerCapture) {
                try {
                    this.canvas.setPointerCapture(e.pointerId);
                } catch (_) {
                    // Ignore pointer capture failure
                }
            }

            e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (this.dragState.active && (this.dragState.pointerId === null || this.dragState.pointerId === e.pointerId)) {
                const now = performance.now();
                const dx = e.clientX - this.dragState.lastX;

                this.offsetX += dx;

                const dt = Math.max(8, now - this.dragState.lastMoveTs);
                this.velocityX = (dx / dt) * 16;
                this.dragState.lastDelta = dx;
                this.dragState.lastX = e.clientX;
                this.dragState.lastMoveTs = now;
            }

            this.updateHover(e.clientX, e.clientY);
        };

        const onPointerUp = (e) => {
            if (!this.dragState.active) return;
            if (this.dragState.pointerId !== null && this.dragState.pointerId !== e.pointerId) return;

            this.dragState.active = false;
            this.dragState.pointerId = null;
            this.canvas.style.cursor = 'grab';

            if (typeof e.pointerId === 'number' && this.canvas.releasePointerCapture && this.canvas.hasPointerCapture?.(e.pointerId)) {
                try {
                    this.canvas.releasePointerCapture(e.pointerId);
                } catch (_) {
                    // Ignore release failures
                }
            }
        };

        const onTouchStart = (e) => {
            if (!e.touches?.length) return;
            const touch = e.touches[0];
            onPointerDown({ clientX: touch.clientX, pointerId: null, preventDefault: () => e.preventDefault() });
            e.preventDefault();
        };

        const onTouchMove = (e) => {
            if (!e.touches?.length) return;
            const touch = e.touches[0];
            onPointerMove({ clientX: touch.clientX, clientY: touch.clientY, pointerId: null });
            e.preventDefault();
        };

        const onTouchEnd = () => {
            onPointerUp({ pointerId: null });
        };

        this.canvas.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        this.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchEnd);

        this.canvas.addEventListener('mouseleave', () => {
            this.hoveredLocation = null;
            this.tooltip.style.opacity = '0';
        });

        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('resize', () => this.resize());
    }

    normalizeOffset() {
        const period = this.mapRect.width;
        if (!period) return;
        this.offsetX = ((this.offsetX % period) + period) % period;
    }

    updateHover(clientX, clientY) {
        const rect = this.container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        let closest = null;
        let closestDist = 16;

        for (const point of this.markerPoints) {
            const dx = point.x - x;
            const dy = point.y - y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < closestDist) {
                closestDist = d;
                closest = point.location;
            }
        }

        if (closest) {
            this.hoveredLocation = closest;
            this.showTooltip(closest, x, y);
        } else {
            this.hoveredLocation = null;
            this.tooltip.style.opacity = '0';
        }
    }

    locationToMapX(lng) {
        return ((lng + 180) / 360) * this.mapRect.width;
    }

    locationToMapY(lat) {
        return ((90 - lat) / 180) * this.mapRect.height;
    }

    getContinentPolygons() {
        return [
            {
                name: 'North America',
                points: [
                    [-168, 71], [-145, 60], [-130, 52], [-125, 48], [-124, 40], [-117, 32], [-105, 25],
                    [-97, 26], [-83, 29], [-80, 25], [-75, 35], [-67, 45], [-57, 47], [-55, 50],
                    [-65, 55], [-75, 58], [-95, 62], [-120, 55], [-145, 60], [-168, 71]
                ]
            },
            {
                name: 'South America',
                points: [
                    [-81, 12], [-75, 5], [-70, -5], [-75, -15], [-70, -25], [-65, -35], [-63, -50],
                    [-70, -55], [-75, -50], [-72, -40], [-75, -30], [-80, -20], [-81, 12]
                ]
            },
            {
                name: 'Europe',
                points: [
                    [-10, 36], [0, 36], [10, 45], [20, 40], [30, 45], [40, 42], [30, 55],
                    [20, 60], [10, 65], [0, 60], [-8, 52], [-10, 36]
                ]
            },
            {
                name: 'Africa',
                points: [
                    [-17, 35], [5, 37], [30, 32], [35, 28], [40, 10], [45, 0], [40, -10], [35, -25],
                    [25, -34], [15, -30], [10, -15], [5, 5], [-5, 5], [-15, 15], [-18, 25], [-17, 35]
                ]
            },
            {
                name: 'Asia',
                points: [
                    [30, 45], [50, 40], [60, 45], [70, 40], [80, 30], [90, 25], [100, 22], [110, 20],
                    [120, 25], [130, 35], [145, 45], [160, 60], [170, 65], [180, 68], [120, 75], [80, 70],
                    [60, 65], [50, 55], [40, 50], [30, 45]
                ]
            },
            {
                name: 'Australia',
                points: [
                    [112, -20], [120, -18], [135, -12], [145, -15], [150, -25], [151, -34], [145, -40],
                    [135, -35], [125, -35], [115, -30], [112, -20]
                ]
            }
        ];
    }

    renderMapBackground() {
        const { x, y, width, height } = this.mapRect;

        const oceanGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        oceanGradient.addColorStop(0, '#0b1220');
        oceanGradient.addColorStop(0.55, '#0f172a');
        oceanGradient.addColorStop(1, '#111827');
        this.ctx.fillStyle = oceanGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        const mapGradient = this.ctx.createLinearGradient(x, y, x, y + height);
        mapGradient.addColorStop(0, 'rgba(30, 64, 175, 0.22)');
        mapGradient.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
        this.ctx.fillStyle = mapGradient;
        this.ctx.fillRect(x, y, width, height);

        const shifted = this.offsetX;
        const startX = x - shifted - width;

        if (this.mapReady && this.mapImage) {
            for (let drawX = startX; drawX < x + width + width; drawX += width) {
                this.ctx.drawImage(this.mapImage, drawX, y, width, height);
            }
        } else {
            this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
            this.ctx.lineWidth = 1;

            for (let lon = -180; lon <= 180; lon += 30) {
                const mapX = x + ((lon + 180) / 360) * width - shifted;
                for (let drawX = mapX - width; drawX <= mapX + width; drawX += width) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(drawX, y);
                    this.ctx.lineTo(drawX, y + height);
                    this.ctx.stroke();
                }
            }

            for (let lat = -60; lat <= 60; lat += 30) {
                const mapY = y + ((90 - lat) / 180) * height;
                this.ctx.beginPath();
                this.ctx.moveTo(x, mapY);
                this.ctx.lineTo(x + width, mapY);
                this.ctx.stroke();
            }
        }

        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
        this.ctx.lineWidth = 1;
        for (let lon = -180; lon <= 180; lon += 30) {
            const mapX = x + ((lon + 180) / 360) * width - shifted;
            for (let drawX = mapX - width; drawX <= mapX + width; drawX += width) {
                this.ctx.beginPath();
                this.ctx.moveTo(drawX, y);
                this.ctx.lineTo(drawX, y + height);
                this.ctx.stroke();
            }
        }

        for (let lat = -60; lat <= 60; lat += 30) {
            const mapY = y + ((90 - lat) / 180) * height;
            this.ctx.beginPath();
            this.ctx.moveTo(x, mapY);
            this.ctx.lineTo(x + width, mapY);
            this.ctx.stroke();
        }

        const vignette = this.ctx.createRadialGradient(
            this.width * 0.5,
            this.height * 0.5,
            this.height * 0.2,
            this.width * 0.5,
            this.height * 0.5,
            this.width * 0.75
        );
        vignette.addColorStop(0, 'rgba(15, 23, 42, 0)');
        vignette.addColorStop(1, 'rgba(2, 6, 23, 0.48)');
        this.ctx.fillStyle = vignette;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
    }

    renderContinents() {
        const { x, y, width, height } = this.mapRect;
        const shifted = this.offsetX;
        const startX = x - shifted - width;

        const drawPolygon = (polygon, drawXOffset = 0) => {
            this.ctx.beginPath();
            polygon.points.forEach(([lng, lat], idx) => {
                const px = startX + drawXOffset + this.locationToMapX(lng);
                const py = y + this.locationToMapY(lat);
                if (idx === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            });
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        };

        this.ctx.fillStyle = 'rgba(51, 65, 85, 0.42)';
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
        this.ctx.lineWidth = 1.1;

        for (let drawX = 0; drawX < width * 3; drawX += width) {
            this.continentPolygons.forEach((polygon) => drawPolygon(polygon, drawX));
        }
    }

    renderConnections() {
        if (this.locations.length < 2) return;

        const { x, y, width } = this.mapRect;
        const shifted = this.offsetX;

        const primary = this.locations[0];
        const primaryBaseX = x + this.locationToMapX(primary.lng) - shifted;
        const primaryY = y + this.locationToMapY(primary.lat);

        this.ctx.lineWidth = 1.8;

        this.locations.slice(1).forEach((location, index) => {
            const targetBaseX = x + this.locationToMapX(location.lng) - shifted;
            const targetY = y + this.locationToMapY(location.lat);

            const options = [targetBaseX - width, targetBaseX, targetBaseX + width];
            const targetX = options.reduce((best, candidate) => {
                const bestDist = Math.abs(best - primaryBaseX);
                const candDist = Math.abs(candidate - primaryBaseX);
                return candDist < bestDist ? candidate : best;
            }, targetBaseX);

            const lift = 32 + (index % 3) * 9;
            const controlX = (primaryBaseX + targetX) / 2;
            const controlY = Math.min(primaryY, targetY) - lift;

            this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
            this.ctx.beginPath();
            this.ctx.moveTo(primaryBaseX, primaryY);
            this.ctx.quadraticCurveTo(controlX, controlY, targetX, targetY);
            this.ctx.stroke();
        });
    }

    renderMarkers() {
        const { x, y, width } = this.mapRect;
        const shifted = this.offsetX;
        const t = Date.now() * 0.004;

        this.markerPoints = [];

        this.locations.forEach((location, index) => {
            const baseX = x + this.locationToMapX(location.lng) - shifted;
            const markerY = y + this.locationToMapY(location.lat);
            const drawXs = [baseX - width, baseX, baseX + width];

            drawXs.forEach((markerX) => {
                if (markerX < -30 || markerX > this.width + 30) return;

                const pulse = 1 + Math.sin(t + index * 0.8) * 0.2;
                const radius = 5 * pulse;

                this.ctx.beginPath();
                this.ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
                this.ctx.arc(markerX, markerY, radius + 4, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.fillStyle = '#f97316';
                this.ctx.arc(markerX, markerY, 4, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(markerX, markerY, 5.8, 0, Math.PI * 2);
                this.ctx.stroke();

                this.markerPoints.push({
                    x: markerX,
                    y: markerY,
                    location
                });
            });
        });
    }

    showTooltip(location, x, y) {
        this.tooltip.innerHTML = `
            <div style="font-size: 22px; margin-bottom: 6px;">${location.flag}</div>
            <div style="font-weight: 600; color: #6366f1; margin-bottom: 4px;">${location.country}</div>
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 6px;">${location.cities.join(', ')}</div>
            <div style="color: #e2e8f0; font-size: 13px;">${location.details}</div>
            <div style="color: #f97316; font-size: 11px; margin-top: 6px;">${location.years} years experience</div>
        `;

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y - 14}px`;
        this.tooltip.style.opacity = '1';
    }

    render() {
        this.normalizeOffset();
        this.renderMapBackground();
        this.renderContinents();
        this.renderConnections();
        this.renderMarkers();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.dragState.active) {
            this.offsetX += this.prefersReducedMotion ? 0 : 0.22;
            this.offsetX += this.velocityX;
            this.velocityX *= 0.92;
            if (Math.abs(this.velocityX) < 0.01) this.velocityX = 0;
        }

        this.render();
    }

    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
}

function initializeGlobeOnce() {
    if (window.globeVisualization) return;
    window.globeVisualization = new GlobeVisualization('globe-container');
}

document.addEventListener('DOMContentLoaded', () => {
    const globeContainer = document.getElementById('globe-container');
    if (!globeContainer) return;

    const globalSection =
        document.getElementById('global') ||
        document.getElementById('global-impact') ||
        globeContainer;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initializeGlobeOnce();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1, rootMargin: '200px' });

        observer.observe(globalSection);

        setTimeout(() => {
            if (!window.globeVisualization) {
                initializeGlobeOnce();
                observer.disconnect();
            }
        }, 2000);
        return;
    }

    setTimeout(() => initializeGlobeOnce(), 600);
});
