import Ball from "./ball.class";

class Player {
    constructor(bool: boolean) {
        if (bool === true) {
            this.x = 0.01;
            this.y = 0.5 - this.h / 2; 
        }
        else {
            this.x = 0.99 - this.w;
            this.y = 0.5 - this.h / 2;
        }
    }

    color: string = 'blue';
    x: number = 0;
    y: number = 0;
    w: number = 0.01;
    h: number = 0.15;

    show(context: CanvasRenderingContext2D, width:  number, height: number) {
        context.fillStyle = this.color;
        context.beginPath();
            context.fillRect(this.x * width - this.w, this.y * height - this.h, this.w * width, this.h * height);
        context.closePath();
    }

    renderPlayer(context: CanvasRenderingContext2D, width: number, height: number) {
        this.show(context, width, height);
    }
}

export default Player;