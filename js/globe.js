/**
 * Interactive 3D Globe Visualization
 * Shows global experience with animated location markers
 */

class GlobeVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.markers = [];
        this.arcs = [];
        this.isRotating = true;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.hoveredMarker = null;
        this.tooltip = null;

        this.init();
    }

    init() {
        this.setupScene();
        this.createGlobe();
        this.createAtmosphere();
        this.createStars();
        this.addLocationMarkers();
        this.createConnectionArcs();
        this.setupTooltip();
        this.setupEventListeners();

        if (this.prefersReducedMotion) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        this.animate();
    }

    setupScene() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 500;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 3;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x6366f1, 1, 10);
        pointLight.position.set(-5, 3, 2);
        this.scene.add(pointLight);
    }

    createGlobe() {
        // Create globe geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Load Earth texture for realistic globe
        const textureLoader = new THREE.TextureLoader();
        
        // Create material with texture
        const material = new THREE.MeshPhongMaterial({
            color: 0x1a365d,
            emissive: 0x0f172a,
            shininess: 25,
            transparent: true,
            opacity: 0.98
        });

        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);

        // Load Earth texture (stylized dark version)
        textureLoader.load(
            'https://unpkg.com/three-globe@2.31.0/example/img/earth-dark.jpg',
            (texture) => {
                material.map = texture;
                material.color.setHex(0xffffff);
                material.needsUpdate = true;
            },
            undefined,
            () => {
                // Fallback: draw continent outlines if texture fails
                this.addContinentOutlines();
            }
        );

        // Add subtle wireframe overlay for tech look
        const wireframeGeometry = new THREE.SphereGeometry(1.002, 36, 36);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        this.globe.add(wireframe);

        // Add latitude/longitude lines
        this.addGridLines();
    }

    addContinentOutlines() {
        // Simplified continent outlines as fallback
        const continentMaterial = new THREE.LineBasicMaterial({
            color: 0x22c55e,
            transparent: true,
            opacity: 0.6
        });

        // North America outline (simplified)
        const northAmerica = [
            [-125, 48], [-124, 40], [-117, 32], [-105, 25], [-97, 26], 
            [-97, 28], [-83, 29], [-80, 25], [-81, 31], [-75, 35],
            [-70, 42], [-67, 45], [-65, 47], [-57, 47], [-55, 50],
            [-65, 55], [-75, 58], [-85, 60], [-95, 62], [-105, 60],
            [-120, 55], [-125, 50], [-125, 48]
        ];
        this.addContinentPath(northAmerica, continentMaterial);

        // South America outline (simplified)
        const southAmerica = [
            [-80, 10], [-75, 5], [-70, -5], [-75, -15], [-70, -25],
            [-65, -35], [-65, -45], [-70, -55], [-75, -50], [-72, -40],
            [-75, -30], [-80, -20], [-80, -10], [-75, 0], [-80, 10]
        ];
        this.addContinentPath(southAmerica, continentMaterial);

        // Europe outline (simplified)
        const europe = [
            [-10, 36], [0, 36], [5, 44], [10, 45], [15, 40], [25, 40],
            [30, 45], [40, 42], [30, 55], [25, 55], [20, 60], [10, 65],
            [5, 62], [0, 60], [-5, 55], [-10, 50], [-10, 36]
        ];
        this.addContinentPath(europe, continentMaterial);

        // Africa outline (simplified)
        const africa = [
            [-15, 35], [10, 37], [30, 32], [35, 30], [40, 10], [50, 12],
            [45, 0], [40, -10], [35, -25], [30, -35], [20, -35], [15, -30],
            [10, -15], [5, 5], [-5, 5], [-15, 15], [-18, 25], [-15, 35]
        ];
        this.addContinentPath(africa, continentMaterial);

        // Asia outline (simplified)
        const asia = [
            [30, 45], [50, 40], [60, 45], [70, 40], [80, 30], [90, 25],
            [100, 22], [105, 12], [110, 20], [120, 25], [130, 35], [140, 40],
            [145, 45], [160, 60], [170, 65], [180, 68], [170, 70], [120, 75],
            [80, 70], [60, 65], [50, 55], [40, 50], [30, 45]
        ];
        this.addContinentPath(asia, continentMaterial);

        // Australia outline (simplified)
        const australia = [
            [115, -20], [120, -18], [135, -12], [145, -15], [150, -25],
            [155, -28], [150, -35], [145, -40], [135, -35], [125, -35],
            [115, -30], [115, -20]
        ];
        this.addContinentPath(australia, continentMaterial);
    }

    addContinentPath(coords, material) {
        const points = coords.map(([lng, lat]) => 
            this.latLngToVector3(lat, lng, 1.004)
        );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.globe.add(line);
    }

    addGridLines() {
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.1
        });

        // Latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            const latRad = (lat * Math.PI) / 180;
            const radius = Math.cos(latRad);
            const y = Math.sin(latRad);

            const points = [];
            for (let lng = 0; lng <= 360; lng += 5) {
                const lngRad = (lng * Math.PI) / 180;
                points.push(new THREE.Vector3(
                    radius * Math.cos(lngRad),
                    y,
                    radius * Math.sin(lngRad)
                ).multiplyScalar(1.003));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, linesMaterial);
            this.globe.add(line);
        }

        // Longitude lines
        for (let lng = 0; lng < 360; lng += 30) {
            const lngRad = (lng * Math.PI) / 180;
            const points = [];
            
            for (let lat = -90; lat <= 90; lat += 5) {
                const latRad = (lat * Math.PI) / 180;
                points.push(new THREE.Vector3(
                    Math.cos(latRad) * Math.cos(lngRad),
                    Math.sin(latRad),
                    Math.cos(latRad) * Math.sin(lngRad)
                ).multiplyScalar(1.003));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, linesMaterial);
            this.globe.add(line);
        }
    }

    createAtmosphere() {
        // Glow effect
        const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
                    vec3 color = vec3(0.388, 0.4, 0.945); // #6366f1
                    gl_FragColor = vec4(color, intensity * 0.6);
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphere);
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            const distance = Math.sqrt(x*x + y*y + z*z);
            if (distance > 5) {
                starsVertices.push(x, y, z);
            }
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    latLngToVector3(lat, lng, radius = 1.01) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);

        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    addLocationMarkers() {
        const locations = careerData.locations;

        locations.forEach((location, index) => {
            const position = this.latLngToVector3(location.lat, location.lng);

            // Create marker group
            const markerGroup = new THREE.Group();
            markerGroup.position.copy(position);
            markerGroup.lookAt(0, 0, 0);
            markerGroup.rotateX(Math.PI);

            // Outer ring (pulsing)
            const ringGeometry = new THREE.RingGeometry(0.03, 0.04, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.userData = { isPulsing: true, originalScale: 1 };
            markerGroup.add(ring);

            // Inner dot
            const dotGeometry = new THREE.CircleGeometry(0.02, 32);
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: index === 0 ? 0x22c55e : 0xf97316, // Green for primary, orange for others
                transparent: true,
                opacity: 0.95,
                side: THREE.DoubleSide
            });
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            dot.position.z = 0.001;
            markerGroup.add(dot);

            // Glow effect
            const glowGeometry = new THREE.CircleGeometry(0.05, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.z = -0.001;
            markerGroup.add(glow);

            // Store location data
            markerGroup.userData = {
                location: location,
                index: index
            };

            this.globe.add(markerGroup);
            this.markers.push(markerGroup);
        });
    }

    createConnectionArcs() {
        const locations = careerData.locations;
        if (locations.length < 2) return;

        // Connect to primary location (USA)
        const primaryLocation = locations[0];
        const primaryPos = this.latLngToVector3(primaryLocation.lat, primaryLocation.lng);

        locations.slice(1).forEach((location, index) => {
            const targetPos = this.latLngToVector3(location.lat, location.lng);
            const arc = this.createArc(primaryPos, targetPos, index);
            this.arcs.push(arc);
        });
    }

    createArc(startPos, endPos, index) {
        const midPoint = new THREE.Vector3()
            .addVectors(startPos, endPos)
            .multiplyScalar(0.5);
        
        // Elevate the midpoint for arc effect
        const distance = startPos.distanceTo(endPos);
        midPoint.normalize().multiplyScalar(1 + distance * 0.3);

        const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
        const points = curve.getPoints(50);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.4,
            linewidth: 2
        });

        const arc = new THREE.Line(geometry, material);
        arc.userData = { 
            progress: 0,
            delay: index * 0.2,
            points: points
        };

        this.globe.add(arc);
        return arc;
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
            transition: opacity 0.3s ease;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 250px;
        `;
        this.container.appendChild(this.tooltip);
    }

    setupEventListeners() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.isRotating = false;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            setTimeout(() => { this.isRotating = true; }, 2000);
        });

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                this.globe.rotation.y += deltaX * 0.005;
                this.globe.rotation.x += deltaY * 0.005;
                this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }

            // Check for marker hover
            this.checkMarkerHover(e);
        });

        this.container.addEventListener('mouseleave', () => {
            this.tooltip.style.opacity = '0';
        });

        // Resize handler
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight || 500;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });

        // Touch support
        this.container.addEventListener('touchstart', (e) => {
            isDragging = true;
            this.isRotating = false;
            previousMousePosition = { 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
            };
        });

        this.container.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                const deltaY = e.touches[0].clientY - previousMousePosition.y;

                this.globe.rotation.y += deltaX * 0.005;
                this.globe.rotation.x += deltaY * 0.005;
                this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));

                previousMousePosition = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY 
                };
            }
        });

        this.container.addEventListener('touchend', () => {
            isDragging = false;
            setTimeout(() => { this.isRotating = true; }, 2000);
        });
    }

    checkMarkerHover(e) {
        this.mouseVector.x = this.mouse.x;
        this.mouseVector.y = this.mouse.y;

        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        const markerMeshes = [];
        this.markers.forEach(marker => {
            marker.children.forEach(child => {
                child.userData.parentMarker = marker;
                markerMeshes.push(child);
            });
        });

        const intersects = this.raycaster.intersectObjects(markerMeshes);

        if (intersects.length > 0) {
            const marker = intersects[0].object.userData.parentMarker;
            if (marker && marker.userData.location) {
                this.showTooltip(marker.userData.location, e);
            }
        } else {
            this.tooltip.style.opacity = '0';
        }
    }

    showTooltip(location, e) {
        const rect = this.container.getBoundingClientRect();
        
        this.tooltip.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 8px;">${location.flag}</div>
            <div style="font-weight: 600; color: #6366f1; margin-bottom: 4px;">
                ${location.country}
            </div>
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 6px;">
                ${location.cities.join(', ')}
            </div>
            <div style="color: #e2e8f0; font-size: 13px;">
                ${location.details}
            </div>
            <div style="color: #f97316; font-size: 11px; margin-top: 6px;">
                ${location.years} years experience
            </div>
        `;

        this.tooltip.style.left = `${e.clientX - rect.left}px`;
        this.tooltip.style.top = `${e.clientY - rect.top - 10}px`;
        this.tooltip.style.opacity = '1';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Auto-rotate when not dragging
        if (this.isRotating) {
            this.globe.rotation.y += 0.002;
        }

        // Animate pulsing markers
        const time = Date.now() * 0.001;
        this.markers.forEach((marker, index) => {
            const ring = marker.children[0];
            if (ring.userData.isPulsing) {
                const scale = 1 + Math.sin(time * 2 + index) * 0.3;
                ring.scale.set(scale, scale, 1);
                ring.material.opacity = 0.5 + Math.sin(time * 2 + index) * 0.3;
            }
        });

        // Animate arcs
        this.arcs.forEach((arc, index) => {
            arc.userData.progress += 0.005;
            if (arc.userData.progress > 1) arc.userData.progress = 0;
            
            arc.material.opacity = 0.2 + Math.sin(arc.userData.progress * Math.PI) * 0.4;
        });

        this.renderer.render(this.scene, this.camera);
    }

    // Clean up
    destroy() {
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement);
            this.renderer.dispose();
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

    const globalSection = document.getElementById('global') || globeContainer;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initializeGlobeOnce();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.15, rootMargin: '120px' });

        observer.observe(globalSection);
        return;
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initializeGlobeOnce(), { timeout: 1500 });
        return;
    }

    setTimeout(() => initializeGlobeOnce(), 800);
});
