class PlayerClass {
    constructor(bool: boolean) {
        if (bool === true) {
            this.x = 0.01 + this.w;
            this.y = 0.5;
        }
        else {
            this.x = 0.99 - this.w;
            this.y = 0.5;
            this.name = 'Player 2';
        }
    }

    name: string = 'Player 1';
    color: string = '#cba6f7aa';
    x: number = 0;
    y: number = 0;
    w: number = 0.01;
    h: number = 0.15;
    velocity: number = 0;
    angle: number = 60;
    points: number = 0;

    score(): number {
        this.points++;
        return this.points;
    }

    setVelocity(val: number) {
        this.velocity = val;
    }

    killVelocity() {
        this.velocity = 0;
    }

    move() {
        const val: number  = this.y + this.velocity;
        if (this.velocity > 0) {
            if (val + this.h / 2 < 0.99)
                this.y = val;
        }
        else {
            if (val - this.h / 2 > 0.01)
                this.y = val;
        }
    }

    calculPlayerPosition() {
        this.move();
    }
}

export default PlayerClass;