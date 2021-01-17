// 土星
const StartSaturn = function () {
    // 土星包含一个环，我们需要把环和星球放在一个 group 里
    this.group = new THREE.Group();

    // 球体分段
    this.segments = 200;

    // 球体
    this.geom = new THREE.SphereGeometry(20, this.segments, this.segments);

    // 漫反射贴图
    this.mapTexture = new THREE.TextureLoader().load('images/saturn.jpg');

    // 材质
    this.material = new THREE.MeshStandardMaterial({
        map: this.mapTexture, // 漫反射贴图
        bumpMap: this.mapTexture, // 凹凸贴图，没有明显的凹凸
        bumpScale: 0.5, // 凹凸程度
        metalness: 0.6, // 金属质感
        roughness: 2, // 粗糙程度
    });

    // 球体对象
    this.mesh = new THREE.Mesh(this.geom, this.material);

    // 添加到组
    this.group.add(this.mesh);

    // 土星环，土星环由粒子和环组成，还需要一个 group
    this.ringGroup = new THREE.Group();

    // 创建环中的粒子，总数 1200 个
    for (let i = 0; i < 1200; i++) {
        const boxGeom = new THREE.SphereGeometry(Math.max(0.0002, Math.random() * 0.15), 3, 4);
        const cube = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            opacity: Math.random() * 1,
            metalness: 1,
            roughness: 1,
        }));
        cube.position.x = Math.sin(i) * Math.PI * (Math.random() + 10 + Math.random() * 5);
        cube.position.y = Math.cos(i) * Math.PI * (Math.random() + 10 + Math.random() * 5);
        cube.position.z = Math.sin(i) * Math.random(3);
        this.ringGroup.add(cube);
    }

    // 土星环
    this.ringShadown = new THREE.RingGeometry(35, 45, 360);
    this.ringShadownTexture = new THREE.TextureLoader().load('images/saturn_ring.png');
    this.ringShadownMaterial = new THREE.MeshStandardMaterial({
        alphaMap: this.ringShadownTexture,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
        roughness: 1, // 粗糙程度
    });
    this.ringShadownMesh = new THREE.Mesh(this.ringShadown, this.ringShadownMaterial);
    this.ringShadownMesh.rotation.x = Math.PI;
    this.ringGroup.add(this.ringShadownMesh);

    // 调整土星环的角度
    this.ringGroup.rotation.x = 1.7;
    this.ringGroup.rotation.y = 0.2;

    // 添加环
    this.group.add(this.ringGroup);

    // 初始化缩放
    this.group.scale.x = 1;
    this.group.scale.y = 1;
    this.group.scale.z = 1;

    // 初始化位置为画外
    this.group.position.x = 0;
    this.group.position.y = 0;
    this.group.position.z = 200;
};