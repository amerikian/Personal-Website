/**
 * 3D Interactive Globe — Canvas 2D Orthographic Projection
 * Real Natural Earth coastlines on a rotating sphere
 * No Three.js / WebGL — pure math + Canvas 2D for maximum compatibility
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
        this.radius = 0;
        this.cx = 0;
        this.cy = 0;

        this.locations = (typeof careerData !== 'undefined' && careerData.locations) ? careerData.locations : [];
        this.markerPoints = [];
        this.hoveredLocation = null;
        this.tooltip = null;

        // Rotation state (radians)
        this.rotY = -1.5;   // longitude rotation — start centered on Americas
        this.rotX = 0.35;   // latitude tilt — slight downward view
        this.velY = 0;
        this.dragState = { active: false, lastX: 0, lastY: 0, lastTs: 0 };

        this.stars = [];
        this.arcParticles = [];
        this.animFrame = 0;
        this.entryProgress = 0;

        // Accurate Natural Earth coastline polygons
        this.polygons = (typeof worldPolygons !== 'undefined') ? worldPolygons : [];
        // Pre-convert to radians for speed
        this.polygonsRad = this.polygons.map(function(ring) {
            return ring.map(function(pt) {
                return [pt[0] * Math.PI / 180, pt[1] * Math.PI / 180];
            });
        });

        this.init();
    }

    /* ─────── Setup ─────── */

    init() {
        this.setupCanvas();
        this.setupTooltip();
        this.generateStars(200);
        this.setupEventListeners();
        this.resize();
        this.spawnArcParticles();
        if (this.prefersReducedMotion) { this.entryProgress = 1; this.render(); return; }
        this.animate();
    }

    setupCanvas() {
        this.canvas.className = 'global-map-canvas';
        this.canvas.style.cssText = 'display:block;width:100%;height:100%;cursor:grab;touch-action:none;pointer-events:auto;position:relative;z-index:10;';
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
        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.radius = Math.min(this.width, this.height) * 0.4;
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

    spawnArcParticles() {
        this.arcParticles = [];
        if (this.locations.length < 2) return;
        var primary = this.locations[0];
        for (var idx = 0; idx < this.locations.length - 1; idx++) {
            var loc = this.locations[idx + 1];
            for (var i = 0; i < 3; i++) {
                this.arcParticles.push({
                    fromLat: primary.lat * Math.PI / 180, fromLng: primary.lng * Math.PI / 180,
                    toLat: loc.lat * Math.PI / 180, toLng: loc.lng * Math.PI / 180,
                    progress: Math.random(),
                    speed: 0.003 + Math.random() * 0.004,
                    size: 1.5 + Math.random() * 1.5,
                    arcIndex: idx
                });
            }
        }
    }

    /* ─────── Event Handling ─────── */

    setupEventListeners() {
        var self = this;
        var sens = 0.006;

        // ── Drag helpers ──
        function startDrag(x, y) {
            self.dragState.active = true;
            self.dragState.lastX = x;
            self.dragState.lastY = y;
            self.dragState.lastTs = performance.now();
            self.velY = 0;
            self.canvas.style.cursor = 'grabbing';
            self.container.style.cursor = 'grabbing';
        }

        function moveDrag(x, y) {
            if (!self.dragState.active) return;
            var now = performance.now();
            var dx = x - self.dragState.lastX;
            var dy = y - self.dragState.lastY;
            self.rotY += dx * sens;
            self.rotX = Math.max(-1.2, Math.min(1.2, self.rotX - dy * sens));
            var dt = Math.max(8, now - self.dragState.lastTs);
            self.velY = (dx * sens / dt) * 16;
            self.dragState.lastX = x;
            self.dragState.lastY = y;
            self.dragState.lastTs = now;
        }

        function endDrag() {
            self.dragState.active = false;
            self.canvas.style.cursor = 'grab';
            self.container.style.cursor = 'grab';
        }

        // ── Pointer events (primary — unifies mouse + pen + touch) ──
        this.canvas.addEventListener('pointerdown', function(e) {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            if (self.canvas.setPointerCapture) {
                try { self.canvas.setPointerCapture(e.pointerId); } catch (_) {}
            }
            startDrag(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('pointermove', function(e) {
            if (self.dragState.active) {
                e.preventDefault();
                moveDrag(e.clientX, e.clientY);
            }
            self.updateHover(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('pointerup', function(e) {
            if (self.dragState.active) {
                if (self.canvas.releasePointerCapture) {
                    try { self.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
                }
                endDrag();
            }
        });

        this.canvas.addEventListener('pointercancel', function(e) {
            if (self.dragState.active) {
                if (self.canvas.releasePointerCapture) {
                    try { self.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
                }
                endDrag();
            }
        });

        // ── Mouse/touch fallback drag start (older browsers) ──
        this.canvas.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('touchstart', function(e) {
            if (e.touches.length !== 1) return;
            e.preventDefault();
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        // ── Mouse events fallback (document-level for moves outside canvas) ──
        document.addEventListener('mousemove', function(e) {
            if (self.dragState.active) {
                e.preventDefault();
                moveDrag(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mouseup', function() {
            if (self.dragState.active) endDrag();
        });

        document.addEventListener('touchmove', function(e) {
            if (self.dragState.active && e.touches.length) {
                e.preventDefault();
                moveDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        document.addEventListener('touchend', function() {
            if (self.dragState.active) endDrag();
        });

        document.addEventListener('touchcancel', function() {
            if (self.dragState.active) endDrag();
        });

        // ── Wheel / trackpad scroll → rotate globe ──
        this.canvas.addEventListener('wheel', function(e) {
            e.preventDefault();
            // Horizontal scroll → rotate Y; Vertical scroll → tilt X
            var wy = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            self.rotY += wy * 0.003;
            // Vertical tilt only if shift is held or if it's a true 2D scroll
            if (e.deltaX !== 0 && e.deltaY !== 0) {
                self.rotX = Math.max(-1.2, Math.min(1.2, self.rotX - e.deltaY * 0.003));
            }
            self.velY = 0; // stop inertia during wheel
        }, { passive: false });

        // Container fallback for wheel too
        this.container.addEventListener('wheel', function(e) {
            e.preventDefault();
            var wy = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            self.rotY += wy * 0.003;
            if (e.deltaX !== 0 && e.deltaY !== 0) {
                self.rotX = Math.max(-1.2, Math.min(1.2, self.rotX - e.deltaY * 0.003));
            }
            self.velY = 0;
        }, { passive: false });

        // ── Container fallback for pointer/mouse ──
        this.container.addEventListener('pointerdown', function(e) {
            if (e.button !== 0 || self.dragState.active) return;
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('mouseleave', function() {
            self.hoveredLocation = null;
            self.tooltip.style.opacity = '0';
        });
        this.canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        window.addEventListener('resize', function() { self.resize(); self.generateStars(200); });
    }

    updateHover(clientX, clientY) {
        var rect = this.container.getBoundingClientRect();
        var mx = clientX - rect.left;
        var my = clientY - rect.top;
        var closest = null, closestDist = 18;
        for (var i = 0; i < this.markerPoints.length; i++) {
            var p = this.markerPoints[i];
            var d = Math.hypot(p.sx - mx, p.sy - my);
            if (d < closestDist) { closestDist = d; closest = p.location; }
        }
        if (closest) { this.hoveredLocation = closest; this.showTooltip(closest, mx, my); }
        else { this.hoveredLocation = null; this.tooltip.style.opacity = '0'; }
    }

    /* ─────── 3D Projection ─────── */

    // Project lat/lng (radians) onto screen. Returns {x,y,visible}
    project(latRad, lngRad) {
        var cosLat = Math.cos(latRad);
        var sinLat = Math.sin(latRad);
        var cosLng = Math.cos(lngRad - this.rotY);
        var sinLng = Math.sin(lngRad - this.rotY);
        var cosRx = Math.cos(this.rotX);
        var sinRx = Math.sin(this.rotX);

        // 3D point on unit sphere
        var px = cosLat * sinLng;
        var py = sinLat;
        var pz = cosLat * cosLng;

        // Rotate around X axis (tilt)
        var y1 = py * cosRx - pz * sinRx;
        var z1 = py * sinRx + pz * cosRx;

        // Orthographic projection — visible if z1 > 0 (facing us)
        return {
            x: this.cx + px * this.radius,
            y: this.cy - y1 * this.radius,
            visible: z1 > 0,
            z: z1
        };
    }

    /* ─────── Render: Background ─────── */

    renderBackground() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius * 1.22, 0, Math.PI * 2);
        ctx.clip();

        var bg = ctx.createRadialGradient(this.cx, this.cy * 0.9, 0, this.cx, this.cy * 0.9, this.width * 0.8);
        bg.addColorStop(0, '#0d1528');
        bg.addColorStop(0.5, '#080e1e');
        bg.addColorStop(1, '#040812');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        var t = this.animFrame;
        var w = this.width, h = this.height;
        for (var i = 0; i < this.stars.length; i++) {
            var s = this.stars[i];
            var bri = 0.3 + 0.7 * ((Math.sin(t * s.speed + s.phase) + 1) / 2);
            ctx.fillStyle = 'rgba(200,210,255,' + (bri * 0.5) + ')';
            ctx.beginPath();
            ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    /* ─────── Render: Globe Sphere ─────── */

    renderGlobeSphere() {
        var ctx = this.ctx;
        var entry = Math.min(1, this.entryProgress);

        // Ocean / sphere base
        var grad = ctx.createRadialGradient(
            this.cx - this.radius * 0.25, this.cy - this.radius * 0.2, this.radius * 0.1,
            this.cx, this.cy, this.radius
        );
        grad.addColorStop(0, 'rgba(12,24,48,' + (0.95 * entry) + ')');
        grad.addColorStop(0.7, 'rgba(6,14,32,' + (0.95 * entry) + ')');
        grad.addColorStop(1, 'rgba(3,8,20,' + (0.9 * entry) + ')');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Atmosphere rim glow
        var atm = ctx.createRadialGradient(this.cx, this.cy, this.radius * 0.88, this.cx, this.cy, this.radius * 1.15);
        atm.addColorStop(0, 'rgba(56,189,248,0)');
        atm.addColorStop(0.5, 'rgba(56,189,248,' + (0.06 * entry) + ')');
        atm.addColorStop(0.8, 'rgba(99,102,241,' + (0.12 * entry) + ')');
        atm.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = atm;
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius * 1.15, 0, Math.PI * 2);
        ctx.fill();
    }

    /* ─────── Render: Grid Lines ─────── */

    renderGrid() {
        var ctx = this.ctx;
        var entry = Math.min(1, this.entryProgress);

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.strokeStyle = 'rgba(99,102,241,' + (0.07 * entry) + ')';
        ctx.lineWidth = 0.6;

        // Latitude lines
        for (var lat = -60; lat <= 60; lat += 30) {
            var latR = lat * Math.PI / 180;
            ctx.beginPath();
            var started = false;
            for (var lng = -180; lng <= 180; lng += 3) {
                var lngR = lng * Math.PI / 180;
                var p = this.project(latR, lngR);
                if (p.visible) {
                    if (!started) { ctx.moveTo(p.x, p.y); started = true; }
                    else ctx.lineTo(p.x, p.y);
                } else { started = false; }
            }
            ctx.stroke();
        }

        // Longitude lines
        for (var lng2 = -180; lng2 < 180; lng2 += 30) {
            var lngR2 = lng2 * Math.PI / 180;
            ctx.beginPath();
            var started2 = false;
            for (var lat2 = -90; lat2 <= 90; lat2 += 3) {
                var latR2 = lat2 * Math.PI / 180;
                var p2 = this.project(latR2, lngR2);
                if (p2.visible) {
                    if (!started2) { ctx.moveTo(p2.x, p2.y); started2 = true; }
                    else ctx.lineTo(p2.x, p2.y);
                } else { started2 = false; }
            }
            ctx.stroke();
        }

        ctx.restore();
    }

    /* ─────── Render: Continents ─────── */

    renderContinents() {
        var ctx = this.ctx;
        var entry = Math.min(1, this.entryProgress);

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        ctx.clip();

        // Render all polygons
        for (var ci = 0; ci < this.polygonsRad.length; ci++) {
            var ring = this.polygonsRad[ci];
            if (ring.length < 3) continue;

            // Quick visibility check — test centroid
            var sumLat = 0, sumLng = 0;
            for (var k = 0; k < ring.length; k++) { sumLng += ring[k][0]; sumLat += ring[k][1]; }
            var cLat = sumLat / ring.length;
            var cLng = sumLng / ring.length;
            var cp = this.project(cLat, cLng);
            if (!cp.visible) continue;

            // Build the path, only connecting visible consecutive points
            ctx.beginPath();
            var moved = false;
            for (var pi = 0; pi < ring.length; pi++) {
                var p = this.project(ring[pi][1], ring[pi][0]);
                if (p.visible) {
                    if (!moved) { ctx.moveTo(p.x, p.y); moved = true; }
                    else ctx.lineTo(p.x, p.y);
                }
            }
            ctx.closePath();

            // Fill — teal gradient
            ctx.fillStyle = 'rgba(16,70,105,' + (0.85 * entry) + ')';
            ctx.fill();
        }

        ctx.restore();
    }

    /* ─────── Render: Arcs ─────── */

    // Interpolate along great circle between two points
    greatCirclePoint(lat1, lng1, lat2, lng2, t) {
        var d = Math.acos(
            Math.min(1, Math.max(-1,
                Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
            ))
        );
        if (d < 0.001) return { lat: lat1, lng: lng1 };
        var A = Math.sin((1 - t) * d) / Math.sin(d);
        var B = Math.sin(t * d) / Math.sin(d);
        var x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
        var y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
        var z = A * Math.sin(lat1) + B * Math.sin(lat2);
        return { lat: Math.atan2(z, Math.sqrt(x * x + y * y)), lng: Math.atan2(y, x) };
    }

    renderArcs() {
        if (this.locations.length < 2) return;
        var ctx = this.ctx;
        var entry = Math.min(1, this.entryProgress);
        var primary = this.locations[0];
        var pLat = primary.lat * Math.PI / 180;
        var pLng = primary.lng * Math.PI / 180;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        ctx.clip();

        var arrowLen = 9;
        var arrowHalf = Math.PI / 7;

        for (var idx = 1; idx < this.locations.length; idx++) {
            var loc = this.locations[idx];
            var tLat = loc.lat * Math.PI / 180;
            var tLng = loc.lng * Math.PI / 180;

            // Lift factor — raise arc above sphere surface
            var liftFactor = 0.08 + 0.04 * idx;

            // Draw arc as great circle segments lifted above surface
            var steps = 40;
            var prevVisible = false;
            var prevX = 0, prevY = 0;
            var lastVisX = 0, lastVisY = 0, lastVisPrevX = 0, lastVisPrevY = 0;
            var hasVisible = false;

            ctx.strokeStyle = 'rgba(99,102,241,' + (0.6 * entry) + ')';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(99,102,241,0.4)';
            ctx.shadowBlur = 10;
            ctx.beginPath();

            for (var si = 0; si <= steps; si++) {
                var t = si / steps;
                var gc = this.greatCirclePoint(pLat, pLng, tLat, tLng, t);
                // Parabolic lift: max at t=0.5
                var lift = 1 + liftFactor * 4 * t * (1 - t);
                var p = this.project(gc.lat, gc.lng);
                // Apply lift by scaling distance from center
                var dx = p.x - this.cx;
                var dy = p.y - this.cy;
                var screenDist = Math.sqrt(dx * dx + dy * dy);
                var liftedDist = screenDist * lift;
                var sx = this.cx + (dx / (screenDist || 1)) * liftedDist;
                var sy = this.cy + (dy / (screenDist || 1)) * liftedDist;

                if (p.visible) {
                    if (!prevVisible) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                    lastVisPrevX = prevX;
                    lastVisPrevY = prevY;
                    lastVisX = sx;
                    lastVisY = sy;
                    hasVisible = true;
                    prevVisible = true;
                } else {
                    prevVisible = false;
                }
                prevX = sx;
                prevY = sy;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Bright inner line
            ctx.strokeStyle = 'rgba(165,180,255,' + (0.5 * entry) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            prevVisible = false;
            for (var si2 = 0; si2 <= steps; si2++) {
                var t2 = si2 / steps;
                var gc2 = this.greatCirclePoint(pLat, pLng, tLat, tLng, t2);
                var lift2 = 1 + liftFactor * 4 * t2 * (1 - t2);
                var p2 = this.project(gc2.lat, gc2.lng);
                var dx2 = p2.x - this.cx;
                var dy2 = p2.y - this.cy;
                var sd2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                var sx2 = this.cx + (dx2 / (sd2 || 1)) * sd2 * lift2;
                var sy2 = this.cy + (dy2 / (sd2 || 1)) * sd2 * lift2;
                if (p2.visible) {
                    if (!prevVisible) ctx.moveTo(sx2, sy2);
                    else ctx.lineTo(sx2, sy2);
                    prevVisible = true;
                } else { prevVisible = false; }
            }
            ctx.stroke();

            // Arrowhead at destination
            if (hasVisible && (lastVisX !== lastVisPrevX || lastVisY !== lastVisPrevY)) {
                var angle = Math.atan2(lastVisY - lastVisPrevY, lastVisX - lastVisPrevX);
                ctx.fillStyle = 'rgba(165,180,255,' + (0.85 * entry) + ')';
                ctx.shadowColor = 'rgba(99,102,241,0.5)';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.moveTo(lastVisX, lastVisY);
                ctx.lineTo(lastVisX - arrowLen * Math.cos(angle - arrowHalf), lastVisY - arrowLen * Math.sin(angle - arrowHalf));
                ctx.lineTo(lastVisX - arrowLen * Math.cos(angle + arrowHalf), lastVisY - arrowLen * Math.sin(angle + arrowHalf));
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        ctx.restore();
    }

    /* ─────── Render: Arc Particles ─────── */

    renderArcParticles() {
        if (this.locations.length < 2) return;
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius * 1.15, 0, Math.PI * 2);
        ctx.clip();

        for (var pi = 0; pi < this.arcParticles.length; pi++) {
            var ap = this.arcParticles[pi];
            var loc = this.locations[ap.arcIndex + 1];
            if (!loc) continue;

            var liftFactor = 0.08 + 0.04 * (ap.arcIndex + 1);
            var t = ap.progress;
            var gc = this.greatCirclePoint(ap.fromLat, ap.fromLng, ap.toLat, ap.toLng, t);
            var lift = 1 + liftFactor * 4 * t * (1 - t);
            var p = this.project(gc.lat, gc.lng);

            if (p.visible) {
                var dx = p.x - this.cx;
                var dy = p.y - this.cy;
                var sd = Math.sqrt(dx * dx + dy * dy);
                var sx = this.cx + (dx / (sd || 1)) * sd * lift;
                var sy = this.cy + (dy / (sd || 1)) * sd * lift;

                var glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, ap.size * 4);
                glow.addColorStop(0, 'rgba(165,180,252,0.9)');
                glow.addColorStop(0.4, 'rgba(99,102,241,0.4)');
                glow.addColorStop(1, 'rgba(99,102,241,0)');
                ctx.fillStyle = glow;
                ctx.beginPath(); ctx.arc(sx, sy, ap.size * 4, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = 'rgba(220,225,255,0.95)';
                ctx.beginPath(); ctx.arc(sx, sy, ap.size * 0.8, 0, Math.PI * 2); ctx.fill();
            }

            ap.progress += ap.speed;
            if (ap.progress > 1) ap.progress -= 1;
        }
        ctx.restore();
    }

    /* ─────── Render: Markers ─────── */

    renderMarkers() {
        var ctx = this.ctx;
        var t = this.animFrame * 0.06;
        var entry = Math.min(1, this.entryProgress);
        this.markerPoints = [];

        for (var idx = 0; idx < this.locations.length; idx++) {
            var loc = this.locations[idx];
            var latR = loc.lat * Math.PI / 180;
            var lngR = loc.lng * Math.PI / 180;
            var p = this.project(latR, lngR);

            if (!p.visible) continue;

            var isHovered = this.hoveredLocation === loc;
            var isPrimary = idx === 0;
            var pulse = 1 + Math.sin(t + idx * 1.1) * 0.25;
            var glowColor = isPrimary ? '249,115,22' : '99,102,241';
            var rippleCol = isPrimary ? '249,115,22' : '139,150,255';

            // Outer glow
            var glowR = (isPrimary ? 20 : 14) * pulse * entry;
            var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
            glow.addColorStop(0, 'rgba(' + glowColor + ',0.25)');
            glow.addColorStop(1, 'rgba(' + glowColor + ',0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2); ctx.fill();

            // Ripple rings
            if (!this.prefersReducedMotion) {
                var rPhase = (t * 0.5 + idx * 0.7) % (Math.PI * 2);
                var rR = 8 + Math.sin(rPhase) * 4 + (isPrimary ? 4 : 0);
                var rA = 0.25 * (1 - Math.sin(rPhase) * 0.5) * entry;
                ctx.strokeStyle = 'rgba(' + rippleCol + ',' + rA + ')';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(p.x, p.y, rR, 0, Math.PI * 2); ctx.stroke();

                var r2Phase = (t * 0.3 + idx * 1.2) % (Math.PI * 2);
                var r2R = 14 + Math.sin(r2Phase) * 6 + (isPrimary ? 6 : 0);
                var r2A = 0.12 * (1 - Math.sin(r2Phase) * 0.5) * entry;
                ctx.strokeStyle = 'rgba(' + rippleCol + ',' + r2A + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.arc(p.x, p.y, r2R, 0, Math.PI * 2); ctx.stroke();
            }

            // Core dot
            var coreR = (isPrimary ? 5.5 : 4) * entry;
            ctx.shadowColor = isPrimary ? 'rgba(249,115,22,0.6)' : 'rgba(99,102,241,0.6)';
            ctx.shadowBlur = isHovered ? 16 : 8;
            ctx.fillStyle = isPrimary ? '#f97316' : '#6366f1';
            ctx.beginPath(); ctx.arc(p.x, p.y, coreR, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // White border
            ctx.strokeStyle = 'rgba(255,255,255,' + (isHovered ? '1' : '0.7') + ')';
            ctx.lineWidth = isHovered ? 2 : 1.2;
            ctx.beginPath(); ctx.arc(p.x, p.y, coreR + 2, 0, Math.PI * 2); ctx.stroke();

            // Inner highlight
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath(); ctx.arc(p.x - 1.2, p.y - 1.2, coreR * 0.35, 0, Math.PI * 2); ctx.fill();

            // Hover label
            if (isHovered) {
                ctx.font = '600 11px Inter, system-ui, sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.95)';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 6;
                ctx.fillText(loc.country, p.x, p.y - coreR - 10);
                ctx.shadowBlur = 0;
            }

            this.markerPoints.push({ sx: p.x, sy: p.y, location: loc });
        }
    }

    /* ─────── Render: Globe Border ─────── */

    renderGlobeBorder() {
        var ctx = this.ctx;
        var entry = Math.min(1, this.entryProgress);

        // Outer ring
        ctx.strokeStyle = 'rgba(99,102,241,' + (0.3 * entry) + ')';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(99,102,241,0.3)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius + 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Specular highlight (top-left)
        var spec = ctx.createRadialGradient(
            this.cx - this.radius * 0.35, this.cy - this.radius * 0.35, 0,
            this.cx - this.radius * 0.35, this.cy - this.radius * 0.35, this.radius * 0.6
        );
        spec.addColorStop(0, 'rgba(120,160,255,' + (0.04 * entry) + ')');
        spec.addColorStop(1, 'rgba(120,160,255,0)');
        ctx.fillStyle = spec;
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /* ─────── Render: HUD Labels ─────── */

    renderHUD() {
        var ctx = this.ctx;
        var entry = Math.min(1, this.entryProgress);

        // Connection count
        ctx.save();
        ctx.font = '500 9px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(99,102,241,' + (0.35 * entry) + ')';
        ctx.textAlign = 'left';
        ctx.fillText('CONNECTIONS: ' + (this.locations.length - 1), this.cx - this.radius, this.cy + this.radius + 22);
        ctx.textAlign = 'right';
        ctx.fillText('COUNTRIES: ' + this.locations.length, this.cx + this.radius, this.cy + this.radius + 22);
        ctx.restore();
    }

    /* ─────── Tooltip ─────── */

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

    /* ─────── Main Render & Animate ─────── */

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.renderBackground();
        this.renderGlobeSphere();
        this.renderGrid();
        this.renderContinents();
        this.renderArcs();
        this.renderArcParticles();
        this.renderMarkers();
        this.renderGlobeBorder();
        this.renderHUD();
    }

    animate() {
        var self = this;
        this.animFrame++;
        requestAnimationFrame(function() { self.animate(); });

        if (this.entryProgress < 1) this.entryProgress = Math.min(1, this.entryProgress + 0.015);

        if (!this.dragState.active) {
            this.rotY += this.prefersReducedMotion ? 0 : 0.002;
            this.rotY += this.velY;
            this.velY *= 0.94;
            if (Math.abs(this.velY) < 0.0001) this.velY = 0;
        }
        this.render();
    }

    destroy() {
        if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
        if (this.tooltip && this.tooltip.parentNode) this.tooltip.parentNode.removeChild(this.tooltip);
    }
}

/* ─────── Lazy Initialization ─────── */

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
