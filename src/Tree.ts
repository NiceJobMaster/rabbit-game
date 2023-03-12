import { Object3D } from 'three';
import { Trunc } from './Trunc';
import { TruncColors } from './types';

export class Tree {
    public mesh: Object3D;
    public trunc: Trunc;

    constructor(truncColors: TruncColors) {
        this.mesh = new Object3D();
        this.trunc = new Trunc(truncColors);
        this.mesh.add(this.trunc.mesh);
    }
}
