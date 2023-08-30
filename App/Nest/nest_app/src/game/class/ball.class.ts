import { BallDto }  from '../dto/game-data.dto';
import PlayerClass from './player.class';

class BallClass {

    constructor() {
        this.reset();
    }

    color: string = '#cba6f7';
    x: number = 0.5;
    y: number = 0.5;
    r: number = 0.01;
    pi2: number = Math.PI * 2;
    speed: [number, number] = [0, 0];
    incr: number = 0;

    //========== BOUNCES =============//
    //>>BORDER<<//
    borderBounce() {
        if (this.y - this.r <= 0 || this.y + this .r >= 1)
            this.speed[1] *= -1;
    }

    //>>PADDLE<//
    paddleBounce(p1: PlayerClass, p2: PlayerClass, height: number) {
        if (this.speed[0] < 0)
            this.paddleLeftBounce(p1, height);
            else
            this.paddleRightBounce(p2, height);
        }
        
    paddleLeftBounce(p: PlayerClass, height: number) {
        let dx = Math.abs(this.x + this.r - p.x);
        let dy = Math.abs(this.y - p.y);
        
        if (dx <= (this.r + p.w)) {
            if (dy <= (this.r + p.h / 2)) {
                const coef = 10 * (this.y - p.y);
                const radian = (coef * p.angle) * (Math.PI / 180);
                this.speed[0] *= -1;
                this.speed[1] = Math.sin(radian);
            }
        }
    };
    
    paddleRightBounce(p: PlayerClass, height: number) {
        
        let dx = Math.abs(this.x - this.r - p.x);
        let dy = Math.abs(this.y - p.y);

        if (dx <= (this.r + p.w)) {
            if (dy <= (this.r + p.h / 2)) {
                const coef = 10 * (this.y - p.y);
                const radian = (coef * p.angle) * (Math.PI / 180);
                this.speed[0] *= -1;
                this.speed[1] = Math.sin(radian);
            }
        }
    };
    
    bounce(p1: PlayerClass, p2: PlayerClass, width:  number, height: number) {
        this.borderBounce();
        this.paddleBounce(p1, p2, height);
        this.score(p1, p2);
    };

    //========== SCORE =============//
    score(p1: PlayerClass, p2: PlayerClass) {
        if (this.x <= 0) {
            p2.score();
            this.reset();
        }
        else if(this.x >= 1) {
            p1.score();
            this.reset();
        }
    }

    //========== RESET BALL =============//
    reset() {
        this.x = 0.5;
        this.y = 0.5;
        let val = 1;
        if (Math.random() < 0.5) {
           val *= -1;
        }
        this.speed[0] = 0.3 * val;
        this.speed[1] = Math.random() * val;
    }

    //========== MOVEMENT =============//
    //>>ACCELERATION<<//
    incrementSpeed() {
        this.incr++;
        if (this.incr === 10) {
            this.speed[0] += 0.01 * this.speed[0];
            this.incr = 0;
        }
    }

    //>>UPDATE POSITION<<//
    update() {
        this.x += this.speed[0] / 100;
        this.y += this.speed[1] / 100;
    };

    //>>CALCUL POSITION<<//
    renderBall(p1: PlayerClass, p2: PlayerClass, width: number, height: number) {
        // back
        this.bounce(p1, p2, width, height);
        this.update();
        this.incrementSpeed();
    };

    //========== RETURN INFORMATIONS =============//
    returnInfos(): BallDto {
        let ball: BallDto;

        ball.color = this.color;
        ball.x = this.x;
        ball.y = this.y;
        ball.r = this.r;
        ball.pi2 = this.pi2;
        return ball;
    }
}

export default BallClass;
