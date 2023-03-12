import { BoxGeometry, CylinderGeometry, Matrix4, Mesh, Vector3 } from 'three';
import { TruncColors } from './types';

export class Trunc {
    public mesh: Mesh;

    constructor(colors: TruncColors) {
        const truncHeight = 50 + Math.random() * 150;
        const topRadius = 1 + Math.random() * 5;
        const bottomRadius = 5 + Math.random() * 5;
        const mats = [
            colors.blackMat,
            colors.brownMat,
            colors.greenMat,
            colors.lightBrownMat,
            colors.pinkMat,
            colors.whiteMat,
        ];
        const matTrunc = colors.blackMat;
        const nhSegments = 3;
        const nvSegments = 3;
        const geom = new CylinderGeometry(
            topRadius,
            bottomRadius,
            truncHeight,
            nhSegments,
            nvSegments
        );
        geom.applyMatrix4(new Matrix4().makeTranslation(0, truncHeight / 2, 0));
        this.mesh = new Mesh(geom, matTrunc);
        const position = geom.attributes.position;

        for (let i = 0; i < position.count; i += 1) {
            const noise = Math.random();

            position.setX(
                i,
                position.getX(i) + -noise + Math.random() * noise * 2
            );
            position.setY(
                i,
                position.getY(i) + -noise + Math.random() * noise * 2
            );
            position.setZ(
                i,
                position.getZ(i) + -noise + Math.random() * noise * 2
            );

            geom.computeVertexNormals();

            // FRUITS

            if (Math.random() > 0.7) {
                const size = Math.random() * 3;
                const fruitGeometry = new BoxGeometry(size, size, size, 1);
                const matFruit = mats[Math.floor(Math.random() * mats.length)];
                const fruit = new Mesh(fruitGeometry, matFruit);
                if (position.getX(i)) {
                    fruit.position.x = position.getX(i);
                    fruit.position.y = position.getY(i) + 3;
                    fruit.position.z = position.getZ(i);
                    fruit.rotation.x = Math.random() * Math.PI;
                    fruit.rotation.y = Math.random() * Math.PI;

                    this.mesh.add(fruit);
                }
            }

            // BRANCHES

            if (
                Math.random() > 0.5 &&
                position.getY(i) > 10 &&
                position.getY(i) < truncHeight - 10
            ) {
                const h = 3 + Math.random() * 5;
                const thickness = 0.2 + Math.random();

                const branchGeometry = new CylinderGeometry(
                    thickness / 2,
                    thickness,
                    h,
                    3,
                    1
                );
                branchGeometry.applyMatrix4(
                    new Matrix4().makeTranslation(0, h / 2, 0)
                );
                const branch = new Mesh(branchGeometry, matTrunc);
                branch.position.x = position.getX(i);
                branch.position.y = position.getY(i);
                branch.position.z = position.getZ(i);

                const vec = new Vector3(position.getX(i), 2, position.getZ(i));
                const axis = new Vector3(0, 1, 0);
                branch.quaternion.setFromUnitVectors(
                    axis,
                    vec.clone().normalize()
                );

                this.mesh.add(branch);
            }
        }

        this.mesh.castShadow = true;
    }
}
