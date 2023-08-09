import Ball from "./ball.class";

class Player {
    constructor(bool: boolean) {
        if (bool === true) {
            this.x = 0.01;
            this.y = 0.5; 
        }
        else {
            this.x = 0.99 - this.w;
            this.y = 0.5;
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
            context.fillRect(this.x * width - this.w * width / 2, this.y * height - this.h * height / 2, this.w * width, this.h * height);
        context.closePath();
    }

    renderPlayer(context: CanvasRenderingContext2D, width: number, height: number) {
        this.show(context, width, height);
    }
}

export default Player;