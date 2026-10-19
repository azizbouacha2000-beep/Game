let scene, camera, renderer, enemies = [];
let score = 0;

init();
animate();

function init() {
    // 1. المشهد والكاميرا
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // لون السماء

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // لتحسين وضوح الجودة على هواتف ريتنا
    document.body.appendChild(renderer.domElement);

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 2. موقع الكاميرا (داخل السيارة)
    camera.position.set(0, 2, 2);

    // 3. بناء الطريق والأعداء
    createRoad();

    // دعم اللمس على الهاتف (النقر على الشاشة لإطلاق النار)
    window.addEventListener('touchstart', onTouchShoot, { passive: false });
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

    // إضافة أعداء (أهداف) عشوائية أمام السيارة
    for (let i = 0; i < 20; i++) {
        const enemyGeo = new THREE.BoxGeometry(1.8, 3.5, 1.8);
        const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
        const enemy = new THREE.Mesh(enemyGeo, enemyMat);
        
        enemy.position.x = (Math.random() - 0.5) * 7;
        enemy.position.y = 1.7;
        enemy.position.z = -40 - (i * 25);
        
        scene.add(enemy);
        enemies.push(enemy);
    }
}

function onTouchShoot(e) {
    e.preventDefault(); // منع السلوك الافتراضي للمتصفح مثل التمرير
    
    // عند النقر بأي مكان على شاشة الهاتف، يتم إطلاق النار على أقرب عدو
    if (enemies.length > 0) {
        const target = enemies[0];
        
        // تأثير اهتزاز بسيط أو اختفاء العدو عند إصابته
        scene.remove(target);
        enemies.shift();
        
        score += 10;
        document.getElementById('score').innerText = score;
        
        // إعادة إنتاج عدو جديد في البعيد لكي تستمر اللعبة
        spawnNewEnemy();
    }
}

function spawnNewEnemy() {
    const enemyGeo = new THREE.BoxGeometry(1.8, 3.5, 1.8);
    const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const enemy = new THREE.Mesh(enemyGeo, enemyMat);
    
    enemy.position.x = (Math.random() - 0.5) * 7;
    enemy.position.y = 1.7;
    enemy.position.z = -300; // يبدأ من بعيد جداً
    
    scene.add(enemy);
    enemies.push(enemy);
}

function animate() {
    requestAnimationFrame(animate);

    // تحريك الأعداء نحو الكاميرا لمحاكاة حركة السيارة للأمام بسرعة سلسة
    enemies.forEach(enemy => {
        enemy.position.z += 0.6; // سرعة تقدم السيارة
        
        // إذا تجاوز العدو الكاميرا، يتم إرجاعه للوراء
        if (enemy.position.z > 4) {
            enemy.position.z = -250;
            enemy.position.x = (Math.random() - 0.5) * 7;
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
