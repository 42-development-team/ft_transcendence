import Player from './player.class';

class Ball {
    constructor() {
        this.reset();
    }

    color: string = '#cba6f7';
    x: number = 0.5;
    y: number = 0.5;
    r: number = 0.01;
    pi2: number = Math.PI * 2;
    speed: [number, number] = [0, 0];

    bounce(p1: Player, p2: Player, width:  number, height: number) {
        if (this.y - this.r <= 0 || this.y + this .r >= 1)
        this.speed[1] *= -1;
        this.paddleBounce(p1, p2, height);
        this.score(p1, p2);
    };

    borderBounce() {
        if (this.y - this.r <= 0 || this.y + this .r >= 1)
            this.speed[1] *= -1;
    }

    score(p1: Player, p2: Player) {
        if (this.x <= 0) {
            p2.score();
            this.reset();
        }
        else if(this.x >= 1) {
            p1.score();
            this.reset();
        }
    }

    reset() {
        this.x = 0.5;
        this.y = 0.5;
        let val = 1;
        if (Math.random() < 0.5) {
           val *= -1;
        }
        this.speed[0] = Math.random() * val;
        this.speed[1] = Math.random() * val;
    }

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
                const coef = 10 * (this.y - p.y);
                const radian = (coef * p.angle) * (Math.PI / 180);
                this.speed[0] = Math.cos(radian);
                this.speed[1] = Math.sin(radian);
                console.log(coef);
            }
        }
    };

    paddleRightBounce(p: Player, height: number) {
        let dx = Math.abs(this.x - this.r - p.x);
        let dy = Math.abs(this.y - p.y);

        if (dx <= (this.r + p.w)) {
            if (dy <= (this.r + p.h / 2)) {
                const coef = 10 * (this.y - p.y);
                const radian = (coef * p.angle) * (Math.PI / 180);
                this.speed[0] = -Math.cos(radian);
                this.speed[1] = Math.sin(radian);
                console.log(coef);
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
        this.bounce(p1, p2, width, height);
        this.update();
    };
}

export default Ball;
