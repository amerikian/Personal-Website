/**
 * Premium Interactive World Map Visualization
 * Deep-space aesthetic with glowing markers, animated arc particles, and detailed continents
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

        this.locations = (typeof careerData !== 'undefined' && careerData.locations) ? careerData.locations : [];
        this.markerPoints = [];
        this.hoveredLocation = null;

        this.offsetX = 0;
        this.velocityX = 0;
        this.dragState = { active: false, pointerId: null, lastX: 0, lastMoveTs: 0, lastDelta: 0 };

        this.tooltip = null;
        this.stars = [];
        this.arcParticles = [];
        this.animFrame = 0;
        this.entryProgress = 0;

        this.continentPolygons = this.getDetailedContinents();
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupTooltip();
        this.generateStars(180);
        this.setupEventListeners();
        this.resize();
        this.spawnArcParticles();

        if (this.prefersReducedMotion) {
            this.entryProgress = 1;
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
        this.tooltip.style.cssText = [
            'position:absolute',
            'background:rgba(8,12,24,0.92)',
            'border:1px solid rgba(99,102,241,0.6)',
            'border-radius:12px',
            'padding:14px 18px',
            'color:white',
            'font-size:14px',
            'pointer-events:none',
            'opacity:0',
            'transform:translateX(-50%) translateY(-8px)',
            'transition:opacity .2s ease, transform .2s ease',
            'z-index:1000',
            'backdrop-filter:blur(16px)',
            'box-shadow:0 8px 32px rgba(99,102,241,0.15), 0 0 60px rgba(99,102,241,0.08)',
            'max-width:260px'
        ].join(';');
        this.container.appendChild(this.tooltip);
    }

    resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 550;
        this.canvas.width = Math.floor(this.width * dpr);
        this.canvas.height = Math.floor(this.height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var padding = 24;
        var idealH = Math.min(this.height - padding * 2, (this.width - padding * 2) / 2);
        var mapH = Math.max(220, idealH);
        var mapW = mapH * 2;
        this.mapRect = { width: mapW, height: mapH, x: (this.width - mapW) / 2, y: (this.height - mapH) / 2 };
    }

    generateStars(count) {
        this.stars = [];
        for (var i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                r: Math.random() * 1.2 + 0.3,
                speed: Math.random() * 0.02 + 0.005,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    renderStars() {
        var t = this.animFrame;
        var ctx = this.ctx;
        var w = this.width, h = this.height;
        for (var i = 0; i < this.stars.length; i++) {
            var s = this.stars[i];
            var bri = 0.3 + 0.7 * ((Math.sin(t * s.speed + s.phase) + 1) / 2);
            ctx.fillStyle = 'rgba(200,210,255,' + (bri * 0.55) + ')';
            ctx.beginPath();
            ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    spawnArcParticles() {
        this.arcParticles = [];
        if (this.locations.length < 2) return;
        var primary = this.locations[0];
        for (var idx = 0; idx < this.locations.length - 1; idx++) {
            var loc = this.locations[idx + 1];
            for (var i = 0; i < 3; i++) {
                this.arcParticles.push({
                    fromLat: primary.lat, fromLng: primary.lng,
                    toLat: loc.lat, toLng: loc.lng,
                    progress: Math.random(),
                    speed: 0.002 + Math.random() * 0.003,
                    size: 1.5 + Math.random() * 1.5,
                    arcIndex: idx
                });
            }
        }
    }

    setupEventListeners() {
        var self = this;

        var onPointerDown = function(e) {
            self.dragState.active = true;
            self.dragState.pointerId = (typeof e.pointerId === 'number') ? e.pointerId : null;
            self.dragState.lastX = e.clientX;
            self.dragState.lastMoveTs = performance.now();
            self.dragState.lastDelta = 0;
            self.canvas.style.cursor = 'grabbing';
            if (typeof e.pointerId === 'number' && self.canvas.setPointerCapture) {
                try { self.canvas.setPointerCapture(e.pointerId); } catch (ex) {}
            }
            e.preventDefault();
        };

        var onPointerMove = function(e) {
            var pid = (typeof e.pointerId === 'number') ? e.pointerId : null;
            if (self.dragState.active && (self.dragState.pointerId === null || self.dragState.pointerId === pid)) {
                var now = performance.now();
                var dx = e.clientX - self.dragState.lastX;
                self.offsetX += dx;
                var dt = Math.max(8, now - self.dragState.lastMoveTs);
                self.velocityX = (dx / dt) * 16;
                self.dragState.lastDelta = dx;
                self.dragState.lastX = e.clientX;
                self.dragState.lastMoveTs = now;
            }
            self.updateHover(e.clientX, e.clientY);
        };

        var onPointerUp = function(e) {
            if (!self.dragState.active) return;
            var pid = (typeof e.pointerId === 'number') ? e.pointerId : null;
            if (self.dragState.pointerId !== null && self.dragState.pointerId !== pid) return;
            self.dragState.active = false;
            self.dragState.pointerId = null;
            self.canvas.style.cursor = 'grab';
            if (typeof e.pointerId === 'number' && self.canvas.releasePointerCapture) {
                try {
                    if (self.canvas.hasPointerCapture && self.canvas.hasPointerCapture(e.pointerId)) {
                        self.canvas.releasePointerCapture(e.pointerId);
                    }
                } catch (ex) {}
            }
        };

        var onTouchStart = function(e) {
            if (!e.touches || !e.touches.length) return;
            var t = e.touches[0];
            onPointerDown({ clientX: t.clientX, pointerId: null, preventDefault: function() { e.preventDefault(); } });
            e.preventDefault();
        };
        var onTouchMove = function(e) {
            if (!e.touches || !e.touches.length) return;
            var t = e.touches[0];
            onPointerMove({ clientX: t.clientX, clientY: t.clientY, pointerId: null });
            e.preventDefault();
        };
        var onTouchEnd = function() { onPointerUp({ pointerId: null }); };

        this.canvas.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
        this.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchEnd);
        this.canvas.addEventListener('mouseleave', function() {
            self.hoveredLocation = null;
            self.tooltip.style.opacity = '0';
        });
        this.canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        window.addEventListener('resize', function() { self.resize(); self.generateStars(180); });
    }

    normalizeOffset() {
        var period = this.mapRect.width;
        if (!period) return;
        this.offsetX = ((this.offsetX % period) + period) % period;
    }

    updateHover(clientX, clientY) {
        var rect = this.container.getBoundingClientRect();
        var mx = clientX - rect.left;
        var my = clientY - rect.top;
        var closest = null, closestDist = 20;
        for (var i = 0; i < this.markerPoints.length; i++) {
            var p = this.markerPoints[i];
            var d = Math.hypot(p.x - mx, p.y - my);
            if (d < closestDist) { closestDist = d; closest = p.location; }
        }
        if (closest) { this.hoveredLocation = closest; this.showTooltip(closest, mx, my); }
        else { this.hoveredLocation = null; this.tooltip.style.opacity = '0'; }
    }

    lngToX(lng) { return ((lng + 180) / 360) * this.mapRect.width; }
    latToY(lat) { return ((90 - lat) / 180) * this.mapRect.height; }

    renderBackground() {
        var ctx = this.ctx;
        var bg = ctx.createRadialGradient(
            this.width * 0.5, this.height * 0.45, 0,
            this.width * 0.5, this.height * 0.45, this.width * 0.8
        );
        bg.addColorStop(0, '#0d1528');
        bg.addColorStop(0.5, '#080e1e');
        bg.addColorStop(1, '#040812');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.width, this.height);
        this.renderStars();
    }

    renderGrid() {
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width, h = mr.height;
        var shifted = this.offsetX;
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        ctx.strokeStyle = 'rgba(99,102,241,0.08)';
        ctx.lineWidth = 0.8;
        for (var lon = -180; lon <= 180; lon += 30) {
            var mapX = x + this.lngToX(lon) - shifted;
            for (var drawX = mapX - w; drawX <= mapX + w; drawX += w) {
                ctx.beginPath(); ctx.moveTo(drawX, y); ctx.lineTo(drawX, y + h); ctx.stroke();
            }
        }
        for (var lat = -90; lat <= 90; lat += 30) {
            var mapY = y + this.latToY(lat);
            ctx.beginPath(); ctx.moveTo(x, mapY); ctx.lineTo(x + w, mapY); ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(99,102,241,0.03)';
        ctx.lineWidth = 0.5;
        for (var lon2 = -180; lon2 <= 180; lon2 += 10) {
            if (lon2 % 30 === 0) continue;
            var mapX2 = x + this.lngToX(lon2) - shifted;
            for (var drawX2 = mapX2 - w; drawX2 <= mapX2 + w; drawX2 += w) {
                ctx.beginPath(); ctx.moveTo(drawX2, y); ctx.lineTo(drawX2, y + h); ctx.stroke();
            }
        }
        for (var lat2 = -90; lat2 <= 90; lat2 += 10) {
            if (lat2 % 30 === 0) continue;
            var mapY2 = y + this.latToY(lat2);
            ctx.beginPath(); ctx.moveTo(x, mapY2); ctx.lineTo(x + w, mapY2); ctx.stroke();
        }

        var eqY = y + this.latToY(0);
        ctx.strokeStyle = 'rgba(99,102,241,0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(x, eqY); ctx.lineTo(x + w, eqY); ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
    }

    renderContinents() {
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width, h = mr.height;
        var shifted = this.offsetX;
        var startX = x - shifted - w;
        var entry = Math.min(1, this.entryProgress);
        var ctx = this.ctx;
        var self = this;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        var drawPoly = function(pts, off) {
            ctx.beginPath();
            for (var i = 0; i < pts.length; i++) {
                var px = startX + off + self.lngToX(pts[i][0]);
                var py = y + self.latToY(pts[i][1]);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
        };

        for (var drawXOff = 0; drawXOff < w * 3; drawXOff += w) {
            for (var ci = 0; ci < this.continentPolygons.length; ci++) {
                var cont = this.continentPolygons[ci];

                drawPoly(cont.points, drawXOff);
                ctx.shadowColor = 'rgba(99,102,241,0.12)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = 'rgba(15,23,55,' + (0.5 * entry) + ')';
                ctx.fill();
                ctx.shadowBlur = 0;

                drawPoly(cont.points, drawXOff);
                var grad = ctx.createLinearGradient(startX + drawXOff, y, startX + drawXOff + w * 0.5, y + h);
                grad.addColorStop(0, 'rgba(30,41,82,' + (0.65 * entry) + ')');
                grad.addColorStop(0.5, 'rgba(22,33,72,' + (0.55 * entry) + ')');
                grad.addColorStop(1, 'rgba(15,23,55,' + (0.5 * entry) + ')');
                ctx.fillStyle = grad;
                ctx.fill();

                ctx.strokeStyle = 'rgba(99,130,241,' + (0.35 * entry) + ')';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.strokeStyle = 'rgba(165,180,252,' + (0.06 * entry) + ')';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    renderArcs() {
        if (this.locations.length < 2) return;
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width;
        var shifted = this.offsetX;
        var entry = Math.min(1, this.entryProgress);
        var primary = this.locations[0];
        var pBX = x + this.lngToX(primary.lng) - shifted;
        var pY = y + this.latToY(primary.lat);
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.rect(mr.x, mr.y, mr.width, mr.height);
        ctx.clip();

        for (var idx = 1; idx < this.locations.length; idx++) {
            var loc = this.locations[idx];
            var tBX = x + this.lngToX(loc.lng) - shifted;
            var tY = y + this.latToY(loc.lat);
            var opts = [tBX - w, tBX, tBX + w];
            var tX = tBX;
            for (var oi = 0; oi < opts.length; oi++) {
                if (Math.abs(opts[oi] - pBX) < Math.abs(tX - pBX)) tX = opts[oi];
            }
            var dist = Math.abs(tX - pBX);
            var lift = 40 + dist * 0.12 + ((idx - 1) % 3) * 8;
            var cx = (pBX + tX) / 2;
            var cy = Math.min(pY, tY) - lift;

            ctx.shadowColor = 'rgba(99,102,241,0.4)';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = 'rgba(99,102,241,' + (0.35 * entry) + ')';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(pBX, pY); ctx.quadraticCurveTo(cx, cy, tX, tY); ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = 'rgba(139,150,255,' + (0.55 * entry) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pBX, pY); ctx.quadraticCurveTo(cx, cy, tX, tY); ctx.stroke();
        }
        ctx.restore();
    }

    renderArcParticles() {
        if (this.locations.length < 2) return;
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width;
        var shifted = this.offsetX;
        var primary = this.locations[0];
        var pBX = x + this.lngToX(primary.lng) - shifted;
        var pY = y + this.latToY(primary.lat);
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.rect(mr.x, mr.y, mr.width, mr.height);
        ctx.clip();

        for (var pi = 0; pi < this.arcParticles.length; pi++) {
            var p = this.arcParticles[pi];
            var loc = this.locations[p.arcIndex + 1];
            if (!loc) continue;
            var tBX = x + this.lngToX(loc.lng) - shifted;
            var tY = y + this.latToY(loc.lat);
            var opts = [tBX - w, tBX, tBX + w];
            var tX = tBX;
            for (var oi = 0; oi < opts.length; oi++) {
                if (Math.abs(opts[oi] - pBX) < Math.abs(tX - pBX)) tX = opts[oi];
            }
            var dist = Math.abs(tX - pBX);
            var lift = 40 + dist * 0.12 + (p.arcIndex % 3) * 8;
            var cx = (pBX + tX) / 2;
            var cy = Math.min(pY, tY) - lift;

            var t = p.progress;
            var px = (1 - t) * (1 - t) * pBX + 2 * (1 - t) * t * cx + t * t * tX;
            var py = (1 - t) * (1 - t) * pY + 2 * (1 - t) * t * cy + t * t * tY;

            var glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
            glow.addColorStop(0, 'rgba(165,180,252,0.9)');
            glow.addColorStop(0.4, 'rgba(99,102,241,0.4)');
            glow.addColorStop(1, 'rgba(99,102,241,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(px, py, p.size * 4, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(220,225,255,0.95)';
            ctx.beginPath(); ctx.arc(px, py, p.size * 0.8, 0, Math.PI * 2); ctx.fill();

            p.progress += p.speed;
            if (p.progress > 1) p.progress -= 1;
        }
        ctx.restore();
    }

    renderMarkers() {
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width;
        var shifted = this.offsetX;
        var t = this.animFrame * 0.06;
        var entry = Math.min(1, this.entryProgress);
        var ctx = this.ctx;

        this.markerPoints = [];

        for (var idx = 0; idx < this.locations.length; idx++) {
            var loc = this.locations[idx];
            var baseX = x + this.lngToX(loc.lng) - shifted;
            var markerY = y + this.latToY(loc.lat);
            var drawXs = [baseX - w, baseX, baseX + w];
            var isHovered = this.hoveredLocation === loc;
            var isPrimary = idx === 0;

            for (var di = 0; di < drawXs.length; di++) {
                var markerX = drawXs[di];
                if (markerX < -40 || markerX > this.width + 40) continue;

                var pulse = 1 + Math.sin(t + idx * 1.1) * 0.25;
                var glowColor = isPrimary ? '249,115,22' : '99,102,241';
                var rippleCol = isPrimary ? '249,115,22' : '139,150,255';

                // Outer glow
                var glowR = (isPrimary ? 22 : 16) * pulse * entry;
                var glow = ctx.createRadialGradient(markerX, markerY, 0, markerX, markerY, glowR);
                glow.addColorStop(0, 'rgba(' + glowColor + ',0.2)');
                glow.addColorStop(1, 'rgba(' + glowColor + ',0)');
                ctx.fillStyle = glow;
                ctx.beginPath(); ctx.arc(markerX, markerY, glowR, 0, Math.PI * 2); ctx.fill();

                // Ripple ring 1
                if (!this.prefersReducedMotion) {
                    var rPhase = (t * 0.5 + idx * 0.7) % (Math.PI * 2);
                    var rR = 8 + Math.sin(rPhase) * 4 + (isPrimary ? 4 : 0);
                    var rA = 0.25 * (1 - Math.sin(rPhase) * 0.5) * entry;
                    ctx.strokeStyle = 'rgba(' + rippleCol + ',' + rA + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.arc(markerX, markerY, rR, 0, Math.PI * 2); ctx.stroke();
                }

                // Ripple ring 2 (slower, larger)
                if (!this.prefersReducedMotion) {
                    var r2Phase = (t * 0.3 + idx * 1.2) % (Math.PI * 2);
                    var r2R = 14 + Math.sin(r2Phase) * 6 + (isPrimary ? 6 : 0);
                    var r2A = 0.12 * (1 - Math.sin(r2Phase) * 0.5) * entry;
                    ctx.strokeStyle = 'rgba(' + rippleCol + ',' + r2A + ')';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.arc(markerX, markerY, r2R, 0, Math.PI * 2); ctx.stroke();
                }

                // Core dot
                var coreR = (isPrimary ? 5.5 : 4) * entry;
                ctx.shadowColor = isPrimary ? 'rgba(249,115,22,0.6)' : 'rgba(99,102,241,0.6)';
                ctx.shadowBlur = isHovered ? 16 : 8;
                ctx.fillStyle = isPrimary ? '#f97316' : '#6366f1';
                ctx.beginPath(); ctx.arc(markerX, markerY, coreR, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                // White border
                ctx.strokeStyle = 'rgba(255,255,255,' + (isHovered ? '1' : '0.7') + ')';
                ctx.lineWidth = isHovered ? 2 : 1.2;
                ctx.beginPath(); ctx.arc(markerX, markerY, coreR + 2, 0, Math.PI * 2); ctx.stroke();

                // Inner highlight
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath(); ctx.arc(markerX - 1.2, markerY - 1.2, coreR * 0.35, 0, Math.PI * 2); ctx.fill();

                // Hover label
                if (isHovered) {
                    ctx.font = '600 11px Inter, system-ui, sans-serif';
                    ctx.fillStyle = 'rgba(255,255,255,0.95)';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.shadowBlur = 6;
                    ctx.fillText(loc.country, markerX, markerY - coreR - 10);
                    ctx.shadowBlur = 0;
                }

                this.markerPoints.push({ x: markerX, y: markerY, location: loc });
            }
        }
    }

    renderMapBorder() {
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width, h = mr.height;
        var ctx = this.ctx;
        var cLen = 20;

        ctx.strokeStyle = 'rgba(99,102,241,0.5)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(99,102,241,0.3)';
        ctx.shadowBlur = 8;

        // Top-left
        ctx.beginPath(); ctx.moveTo(x, y + cLen); ctx.lineTo(x, y); ctx.lineTo(x + cLen, y); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(x + w - cLen, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cLen); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(x, y + h - cLen); ctx.lineTo(x, y + h); ctx.lineTo(x + cLen, y + h); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(x + w - cLen, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cLen); ctx.stroke();
        ctx.shadowBlur = 0;

        // Subtle full border
        ctx.strokeStyle = 'rgba(99,102,241,0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        // Vignette
        var vig = ctx.createRadialGradient(x + w * 0.5, y + h * 0.5, h * 0.3, x + w * 0.5, y + h * 0.5, w * 0.7);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(4,8,18,0.45)');
        ctx.fillStyle = vig;
        ctx.fillRect(x, y, w, h);
    }

    renderHUD() {
        var mr = this.mapRect;
        var x = mr.x, y = mr.y, w = mr.width, h = mr.height;
        var ctx = this.ctx;
        ctx.save();
        ctx.font = '500 9px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(99,102,241,0.3)';

        var lats = [-60, -30, 0, 30, 60];
        for (var li = 0; li < lats.length; li++) {
            var lat = lats[li];
            var ly = y + this.latToY(lat);
            ctx.textAlign = 'right';
            ctx.fillText(Math.abs(lat) + '\u00B0' + (lat >= 0 ? 'N' : 'S'), x - 6, ly + 3);
        }

        var shifted = this.offsetX;
        var lons = [-120, -60, 0, 60, 120];
        for (var lo = 0; lo < lons.length; lo++) {
            var lon = lons[lo];
            var lx = x + this.lngToX(lon) - shifted;
            for (var drawX = lx - w; drawX <= lx + w; drawX += w) {
                if (drawX > x + 10 && drawX < x + w - 10) {
                    ctx.textAlign = 'center';
                    ctx.fillText(Math.abs(lon) + '\u00B0' + (lon >= 0 ? 'E' : 'W'), drawX, y + h + 14);
                }
            }
        }
        ctx.restore();
    }

    showTooltip(loc, mx, my) {
        var isPrimary = loc === this.locations[0];
        var accentColor = isPrimary ? '#f97316' : '#818cf8';
        this.tooltip.innerHTML =
            '<div style="font-size:24px;margin-bottom:8px;">' + loc.flag + '</div>' +
            '<div style="font-weight:700;color:' + accentColor + ';font-size:15px;margin-bottom:4px;">' + loc.country + '</div>' +
            '<div style="color:#94a3b8;font-size:12px;margin-bottom:8px;">' + loc.cities.join(' \u2022 ') + '</div>' +
            '<div style="color:#e2e8f0;font-size:13px;line-height:1.4;">' + loc.details + '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;color:#f97316;font-size:11px;font-weight:600;">' +
            '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f97316;"></span>' +
            loc.years + ' years</div>';

        var ttW = 260;
        var left = mx;
        if (mx - ttW / 2 < 10) left = ttW / 2 + 10;
        if (mx + ttW / 2 > this.width - 10) left = this.width - ttW / 2 - 10;
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = (my - 16) + 'px';
        this.tooltip.style.opacity = '1';
        this.tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    }

    render() {
        this.normalizeOffset();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.renderBackground();
        this.renderGrid();
        this.renderContinents();
        this.renderArcs();
        this.renderArcParticles();
        this.renderMarkers();
        this.renderMapBorder();
        this.renderHUD();
    }

    animate() {
        var self = this;
        this.animFrame++;
        requestAnimationFrame(function() { self.animate(); });

        if (this.entryProgress < 1) this.entryProgress = Math.min(1, this.entryProgress + 0.012);

        if (!this.dragState.active) {
            this.offsetX += this.prefersReducedMotion ? 0 : 0.18;
            this.offsetX += this.velocityX;
            this.velocityX *= 0.93;
            if (Math.abs(this.velocityX) < 0.01) this.velocityX = 0;
        }
        this.render();
    }

    destroy() {
        if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
        if (this.tooltip && this.tooltip.parentNode) this.tooltip.parentNode.removeChild(this.tooltip);
    }

    getDetailedContinents() {
        return [
            { name: 'North America', points: [
                [-168,72],[-162,70],[-155,71],[-140,70],[-130,72],[-120,74],[-100,76],[-85,77],[-75,78],[-60,82],
                [-45,78],[-55,70],[-55,52],[-60,47],[-67,44],[-70,41],[-75,35],[-81,25],[-82,22],[-87,18],
                [-90,16],[-92,15],[-87,14],[-83,10],[-80,8],[-78,9],[-77,18],[-75,20],[-71,19],[-66,18],
                [-80,25],[-82,27],[-85,29],[-89,29],[-94,29],[-97,26],[-100,28],[-104,29],[-106,32],
                [-112,31],[-117,33],[-120,34],[-122,37],[-124,40],[-124,43],[-124,46],[-123,48],
                [-130,52],[-135,57],[-140,60],[-148,61],[-152,58],[-155,57],[-160,58],
                [-163,60],[-165,62],[-168,64],[-170,66],[-168,72]
            ]},
            { name: 'Greenland', points: [
                [-73,78],[-68,76],[-60,76],[-50,76],[-44,78],[-35,79],[-28,78],[-20,76],[-18,74],[-18,72],
                [-22,70],[-27,68],[-32,67],[-40,65],[-43,60],[-45,61],[-48,62],[-52,63],[-52,65],
                [-54,66],[-53,68],[-55,70],[-60,72],[-65,74],[-68,76],[-73,78]
            ]},
            { name: 'South America', points: [
                [-80,10],[-77,12],[-72,12],[-67,11],[-60,8],[-55,6],[-52,4],[-50,2],[-50,0],
                [-49,-2],[-45,-3],[-42,-3],[-39,-4],[-36,-5],[-35,-8],[-35,-10],[-37,-12],[-38,-15],
                [-40,-18],[-41,-22],[-43,-23],[-45,-24],[-48,-26],[-48,-28],[-50,-29],[-51,-33],
                [-53,-34],[-53,-36],[-56,-37],[-58,-38],[-62,-39],[-64,-42],[-65,-45],[-66,-47],
                [-66,-50],[-68,-52],[-68,-54],[-70,-55],[-74,-52],[-74,-48],[-72,-44],[-72,-42],
                [-71,-38],[-71,-34],[-71,-30],[-70,-26],[-70,-22],[-72,-18],[-75,-14],[-76,-12],
                [-76,-8],[-78,-4],[-80,0],[-80,5],[-77,8],[-80,10]
            ]},
            { name: 'Europe', points: [
                [-10,36],[-8,38],[-9,40],[-9,43],[-2,44],[0,44],[3,43],[5,44],[2,47],[1,48],
                [-5,48],[-6,53],[-3,56],[0,57],[2,51],[5,52],[8,54],[10,55],[12,54],[12,57],
                [10,58],[12,56],[8,58],[6,58],[5,60],[6,62],[5,64],[7,65],[10,64],[12,66],
                [15,69],[18,70],[22,70],[25,71],[28,71],[30,70],[32,69],[30,67],[28,66],
                [27,64],[24,61],[22,60],[20,57],[18,55],[17,53],[20,51],[22,48],[24,45],
                [26,42],[28,41],[26,40],[22,40],[18,42],[15,44],[12,46],[10,45],[8,48],
                [6,47],[4,44],[2,43],[0,43],[-2,43],[-4,44],[-8,44],[-10,36]
            ]},
            { name: 'Africa', points: [
                [-17,15],[-17,21],[-16,24],[-13,28],[-8,32],[-5,34],[-2,35],[5,36],[10,37],
                [12,35],[15,33],[18,33],[20,32],[25,32],[30,31],[32,30],[33,28],[35,25],
                [38,22],[42,18],[44,12],[46,8],[48,5],[50,2],[50,-2],[48,-5],[44,-10],
                [42,-14],[40,-16],[38,-20],[36,-24],[34,-28],[32,-30],[30,-32],[28,-34],
                [26,-34],[22,-34],[18,-30],[16,-28],[14,-24],[12,-18],[10,-14],[10,-10],
                [10,-5],[8,-2],[6,2],[4,5],[2,5],[0,6],[-2,5],[-5,5],[-8,5],
                [-10,6],[-12,8],[-14,10],[-16,12],[-17,15]
            ]},
            { name: 'Asia', points: [
                [30,42],[35,38],[38,36],[42,38],[45,40],[50,38],[52,36],[55,37],[58,38],
                [60,42],[63,45],[65,40],[68,38],[70,35],[72,30],[75,28],[78,25],[80,22],
                [82,18],[85,22],[88,24],[90,22],[92,20],[95,18],[98,16],[100,14],[102,12],
                [104,10],[106,12],[108,16],[110,18],[112,20],[115,22],[118,24],[120,22],
                [119,25],[121,28],[122,30],[124,34],[126,36],[128,35],[130,34],[132,35],
                [134,36],[135,40],[138,35],[140,36],[142,44],[144,46],[146,44],[148,46],
                [150,48],[152,50],[155,52],[158,54],[162,58],[163,60],[168,63],[170,64],
                [175,66],[180,68],[180,72],[170,72],[162,68],[160,65],
                [155,60],[148,58],[145,55],[140,52],[135,55],[130,55],
                [125,54],[120,58],[115,60],[110,62],[105,64],[100,67],[95,68],
                [90,70],[85,72],[80,73],[75,72],[70,73],[65,72],[60,68],
                [55,62],[50,55],[45,50],[42,48],[40,45],[35,43],[30,42]
            ]},
            { name: 'Australia', points: [
                [114,-20],[116,-22],[116,-25],[117,-28],[118,-30],[120,-33],[122,-34],
                [125,-33],[128,-32],[130,-31],[132,-32],[134,-33],[136,-35],[138,-36],
                [140,-38],[142,-39],[144,-38],[147,-38],[149,-37],[151,-34],[152,-30],
                [153,-27],[153,-24],[150,-22],[148,-20],[146,-18],[144,-15],[142,-12],
                [140,-11],[137,-12],[136,-14],[134,-12],[132,-11],[130,-12],[128,-14],
                [126,-14],[124,-15],[122,-16],[120,-18],[118,-20],[116,-20],[114,-20]
            ]},
            { name: 'New Zealand', points: [
                [172,-34],[174,-36],[175,-38],[177,-40],[178,-42],[177,-44],[176,-46],
                [174,-46],[172,-44],[171,-42],[170,-44],[168,-46],[167,-46],[167,-44],
                [168,-42],[170,-40],[171,-38],[172,-36],[172,-34]
            ]},
            { name: 'Japan', points: [
                [130,31],[132,33],[133,34],[135,35],[137,36],[139,36],[140,38],
                [140,40],[141,42],[142,44],[144,44],[145,43],[145,41],[144,40],
                [142,39],[140,36],[138,34],[136,34],[134,33],[132,32],[130,31]
            ]},
            { name: 'UK and Ireland', points: [
                [-6,50],[-5,52],[-3,53],[-3,55],[-4,57],[-3,58],[-5,58],[-6,56],
                [-7,55],[-8,54],[-10,52],[-10,51],[-8,51],[-6,50]
            ]},
            { name: 'Indonesia', points: [
                [95,-6],[98,-4],[100,-2],[102,0],[104,1],[106,0],[108,-2],[110,-7],
                [112,-8],[114,-8],[116,-8],[118,-9],[120,-10],[122,-8],[124,-8],
                [126,-6],[128,-4],[130,-3],[132,-4],[134,-6],[136,-8],[138,-7],
                [140,-5],[140,-3],[138,-2],[136,-1],[134,-2],[132,-3],[130,-2],
                [128,-3],[126,-5],[124,-7],[122,-7],[120,-9],[118,-8],[116,-7],
                [114,-7],[112,-7],[110,-6],[108,-1],[106,1],[104,2],[102,1],
                [100,-1],[98,-3],[96,-5],[95,-6]
            ]},
            { name: 'Philippines', points: [
                [118,6],[120,8],[121,10],[122,12],[122,14],[123,16],[124,18],[125,18],
                [126,16],[126,14],[125,12],[124,10],[122,8],[120,6],[118,6]
            ]},
            { name: 'Madagascar', points: [
                [44,-12],[46,-14],[48,-16],[49,-18],[49,-20],[49,-22],[48,-24],[47,-25],
                [45,-25],[44,-24],[43,-22],[43,-20],[44,-18],[44,-16],[44,-12]
            ]}
        ];
    }
}

function initializeGlobeOnce() {
    if (window.globeVisualization) return;
    window.globeVisualization = new GlobeVisualization('globe-container');
}

document.addEventListener('DOMContentLoaded', function() {
    var globeContainer = document.getElementById('globe-container');
    if (!globeContainer) return;

    var globalSection =
        document.getElementById('global') ||
        document.getElementById('global-impact') ||
        globeContainer;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    initializeGlobeOnce();
                    observer.disconnect();
                    break;
                }
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        observer.observe(globalSection);

        setTimeout(function() {
            if (!window.globeVisualization) {
                initializeGlobeOnce();
                observer.disconnect();
            }
        }, 2000);
        return;
    }

    setTimeout(function() { initializeGlobeOnce(); }, 600);
});
