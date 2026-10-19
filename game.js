let scene, camera, renderer, car, enemies = [];
let score = 0;
let roadSegments = [];

init();
animate();

function init() {
    // 1. المشهد والكاميرا
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // لون السماء

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 2. إنشاء السيارة من منظور الشخص الأول (داخل السيارة)
    camera.position.set(0, 2, 2);

    // 3. بناء الطريق الشارعي والأشجار (لإعطاء إيحاء الحركة)
    createRoad();

    // أحداث النقر لإطلاق النار
    window.addEventListener('click', onShoot);
    window.addEventListener('resize', onWindowResize);
}

function createRoad() {
    // إنشاء أرضية الطريق
    const roadGeo = new THREE.PlaneGeometry(10, 1000);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = -500;
    scene.add(road);

    // إضافة أعداء (أهداف) عشوائية على جانبي الطريق
    for (let i = 0; i < 20; i++) {
        const enemyGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
        const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const enemy = new THREE.Mesh(enemyGeo, enemyMat);
        
        enemy.position.x = (Math.random() - 0.5) * 8;
        enemy.position.y = 1.5;
        enemy.position.z = -50 - (i * 30);
        
        scene.add(enemy);
        enemies.push(enemy);
    }
}

function onShoot() {
    // محاكاة إطلاق النار والتأكد من الإصابة في المنتصف
    if (enemies.length > 0) {
        // كمثال بسيط: إزالة أول أعداء تقترب وإضافة نقاط
        const target = enemies[0];
        // تأثير بصري بسيط للاختفاء
        scene.remove(target);
        enemies.shift();
        
        score += 10;
        document.getElementById('score').innerText = score;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // تحريك الأعداء نحو الكاميرا لمحاكاة حركة السيارة للأمام
    enemies.forEach(enemy => {
        enemy.position.z += 0.5; // سرعة حركة الشارع والسيارة
        if (enemy.position.z > 5) {
            enemy.position.z = -300; // إعادة تدوير العدو للخلف
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
