let canvas;
let ctx;
let trippyBackground;
let trippyBackgroundAnimation;

window.onload = function(){
    canvas = document.getElementById('canvas-back');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    trippyBackground = new TrippyBackgroundEffect(ctx, canvas.width, canvas.height)
    trippyBackground.animation(0);
}

window.addEventListener('resize', function(){
    cancelAnimationFrame(trippyBackgroundAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    trippyBackground = new TrippyBackgroundEffect(ctx, canvas.width, canvas.height)
    trippyBackground.animation(0);
})

const mouse = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
})

class TrippyBackgroundEffect{
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.lineWidth = 1;
        this.angle = 0;
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        this.cellSize = 7;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 0;
        this.vr = 0.03;
    }
    #createGradient(){
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1","#A020F0");
        this.gradient.addColorStop("0.9","#FF9E44")
    }
    #draw(angle, x, y){
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let dist = dx*dx+dy*dy;
        //if(dist> 600000) dist = 600000;
        let length = dist/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x+Math.cos(angle)*length, y+Math.sin(angle)*length);
        this.#ctx.stroke();
    }
    animation(timeStamp){
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if(this.timer>this.interval){
            
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr;
            if( this.radius>5 || this.radius< -5) this.vr *= -1;
            for(let y = 0; y < this.#width; y += this.cellSize){
                for(let x = 0; x < this.#width; x += this.cellSize){
                    
                    const angle = (Math.cos(x*0.03) + Math.sin(y*0.03))*this.radius;
                    this.#draw(angle, x, y);
                }
            }
            this.timer = 0;
        }
        else{
            this.timer += deltaTime;
        }
        this.#draw(this.#width/2 + Math.sin(this.angle), this.#height/2 + Math.cos(this.angle));
        trippyBackgroundAnimation = requestAnimationFrame(this.animation.bind(this))
    }
}