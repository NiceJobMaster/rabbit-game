import { CylinderGeometry, Matrix4, Mesh, MeshPhongMaterial } from 'three';

export class Fir {
    public mesh: Mesh;

    constructor(color: MeshPhongMaterial) {
        const height = 200;
        const truncGeom = new CylinderGeometry(2, 2, height, 6, 1);
        truncGeom.applyMatrix4(new Matrix4().makeTranslation(0, height / 2, 0));
        this.mesh = new Mesh(truncGeom, color);
        this.mesh.castShadow = true;
    }
}
