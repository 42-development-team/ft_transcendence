import Player from './player.class';

class Ball {
    constructor(xspeed: number, yspeed: number) {
        let val = 1;
        if (Math.random() < 0.5) {
           val *= -1;
        }
        this.speed[0] = xspeed * val;
        this.speed[1] = yspeed * val;
    }

    color: string = 'red';
    x: number = 0.5;
    y: number = 0.5;
    r: number = 0.01;
    pi2: number = Math.PI * 2;
    speed: [number, number] = [0, 0];

    borderBounce(p1: Player, p2: Player, width:  number, height: number) {
        if (this.x <= 0) 
            this.speed[0] *= -1; // reset and count p2 score ++
        if(this.x >= 1)
            this.speed[0] *= -1; // reset and count p1 score ++
        if (this.y - this.r <= 0 || this.y + this .r >= 1)
            this.speed[1] *= -1;
        this.paddleBounce(p1, p2, height);
    };

    paddleBounce(p1: Player, p2: Player, height: number) {
        if (this.speed[0] < 0)
            this.paddleLeftBounce(p1, height);
        else
            this.paddleRightBounce(p2, height);
    }

    paddleLeftBounce(p: Player, height: number) {
        let dx = Math.abs(this.x + this.r - p.x);
        let dy = Math.abs(this.y - p.y);

        if (dx <= (this.r + p.w)) {
            if (dy <= (this.r + p.h / 2)) {
                const diff = 10 * (this.y - p.y);
                const rad = (diff * p.angle) * (Math.PI / 180);
                this.speed[0] = Math.cos(rad);
                this.speed[1] = Math.sin(rad);
                console.log(diff);
            }
        }
    };

    paddleRightBounce(p: Player, height: number) {
        let dx = Math.abs(this.x - this.r - p.x);
        let dy = Math.abs(this.y - p.y);

        if (dx <= (this.r + p.w)) {
            if (dy <= (this.r + p.h / 2)) {
                const diff = 10 * (this.y - p.y);
                const rad = (diff * p.angle) * (Math.PI / 180);
                this.speed[0] = -Math.cos(rad);
                this.speed[1] = Math.sin(rad);
                console.log(diff);
            }
        }
    };

    update() {
        this.x += this.speed[0] / 100;
        this.y += this.speed[1] / 100;
    };

    show(context: CanvasRenderingContext2D, width:  number, height: number) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x * width, this.y * height , this.r * width, 0, this.pi2, false);
        context.fill();
        context.stroke();
        context.closePath();
    };

    renderBall(context: CanvasRenderingContext2D, p1: Player, p2: Player, width: number, height: number) {
        this.show(context, width, height);
        this.borderBounce(p1, p2, width, height);
        this.update();
    };
}

export default Ball;
