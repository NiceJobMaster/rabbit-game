import {
    BoxGeometry,
    CylinderGeometry,
    Group,
    Matrix4,
    Mesh,
    MeshPhongMaterial,
} from 'three';

export class Carrot {
    public mesh: Group;
    public angle: number;
    public body: Mesh;
    public leaf1: Mesh;
    public leaf2: Mesh;

    constructor(colors: CarrotColors) {
        this.angle = 0;
        this.mesh = new Group();

        const bodyGeom = new CylinderGeometry(5, 3, 10, 4, 1);
        this.body = new Mesh(bodyGeom, colors.bodyColor);

        const leafGeom = new BoxGeometry(5, 10, 1, 1);
        leafGeom.applyMatrix4(new Matrix4().makeTranslation(0, 5, 0));

        this.leaf1 = new Mesh(leafGeom, colors.leafColor);
        this.leaf1.position.y = 7;
        this.leaf1.rotation.z = 0.3;
        this.leaf1.rotation.x = 0.2;

        this.leaf2 = this.leaf1.clone();
        this.leaf2.scale.set(1, 1.3, 1);
        this.leaf2.position.y = 7;
        this.leaf2.rotation.z = -0.3;
        this.leaf2.rotation.x = -0.2;

        this.mesh.add(this.body);
        this.mesh.add(this.leaf1);
        this.mesh.add(this.leaf2);

        this.body.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }
}

interface CarrotColors {
    bodyColor: MeshPhongMaterial;
    leafColor: MeshPhongMaterial;
}
