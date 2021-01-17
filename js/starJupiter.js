// 木星
const StartJupiter = function () {
    // 球体分段数
    this.segments = 200;

    // 球体
    this.geom = new THREE.SphereGeometry(20, this.segments, this.segments);

    // 贴图
    this.mapTexture = new THREE.TextureLoader().load('images/jupiter.jpg');
    this.mapTexture.repeat.set(1, 1);

    // 材质
    this.material = new THREE.MeshStandardMaterial({
        map: this.mapTexture, // 漫反射贴图
        lightMap: this.mapTexture, // 自发光贴图
        lightMapIntensity: 0.05, // 自发光强度   
        bumpMap: this.mapTexture, // 凹凸贴图
        bumpScale: 0.1, // 凹凸程度
        metalness: 0.5, // 金属质感
        roughness: 1, // 粗糙程度
    });

    // 星球对象
    this.mesh = new THREE.Mesh(this.geom, this.material);

    // 初始化缩放
    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.z = 1;

    // 初始化位置为画外
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    this.mesh.position.z = 200;
};