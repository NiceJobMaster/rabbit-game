import gsap, { Power4 } from 'gsap';
import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from 'three';

export class BonusParticles {
    public mesh: Group;
    public parts: Mesh[];

    constructor(pinkMat: MeshPhongMaterial, greenMat: MeshPhongMaterial) {
        this.mesh = new Group();
        const bigParticleGeom = new BoxGeometry(10, 10, 10, 1);
        const smallParticleGeom = new BoxGeometry(5, 5, 5, 1);
        this.parts = [];
        for (let i = 0; i < 10; i += 1) {
            const partPink = new Mesh(bigParticleGeom, pinkMat);
            const partGreen = new Mesh(smallParticleGeom, greenMat);
            partGreen.scale.set(0.5, 0.5, 0.5);
            this.parts.push(partPink);
            this.parts.push(partGreen);
            this.mesh.add(partPink);
            this.mesh.add(partGreen);
        }
    }

    public explose() {
        const explosionSpeed = 0.5;
        const removeParticle = (p: Mesh) => {
            p.visible = false;
        };
        for (let i = 0; i < this.parts.length; i += 1) {
            const tx = -50 + Math.random() * 100;
            const ty = -50 + Math.random() * 100;
            const tz = -50 + Math.random() * 100;
            const p = this.parts[i];
            p.position.set(0, 0, 0);
            p.scale.set(1, 1, 1);
            p.visible = true;
            const s = explosionSpeed + Math.random() * 0.5;
            gsap.to(p.position, s, {
                x: tx,
                y: ty,
                z: tz,
                ease: Power4.easeOut,
            });
            gsap.to(p.scale, s, {
                x: 0.01,
                y: 0.01,
                z: 0.01,
                ease: Power4.easeOut,
                onComplete: removeParticle,
                onCompleteParams: [p],
            });
        }
    }
}
