import Ball from "./ball.class";

class Player {
    constructor(bool: boolean) {
        if (bool === true) {
            this.x = 0.01 + this.w;
            this.y = 0.5;
            this.angle = 45;
        }
        else {
            this.x = 0.99 - this.w;
            this.y = 0.5;
            this.angle = 45;
        }
    }

    color: string = 'blue';
    x: number = 0;
    y: number = 0;
    w: number = 0.01;
    h: number = 0.15;
    velocity: number = 0;
    angle: number = 0;

    setVelocity(val: number) {
        this.velocity = val;
    }

    killVelocity() {
        this.velocity = 0;
    }

    move() {
        const val: number  = this.y + this.velocity;
        if (this.velocity > 0) {
            if (val + this.h / 2 < 1)
                this.y = val;
        }
        else {
            if (val - this.h / 2 > 0)
                this.y = val;
        }
    }

    show(context: CanvasRenderingContext2D, width:  number, height: number) {
        context.fillStyle = this.color;
        context.beginPath();
            context.fillRect(this.x * width - this.w * width / 2, this.y * height - this.h * height / 2, this.w * width, this.h * height);
        context.closePath();
    }

    renderPlayer(context: CanvasRenderingContext2D, width: number, height: number) {
        this.move();
        this.show(context, width, height);
    }
}

export default Player;