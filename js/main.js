const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.posX = Math.max(radius, Math.random() * (window_width - 2 * radius));
        this.posY = Math.max(radius, Math.random() * (window_height - 2 * radius));
        
        this.dx = (Math.random() - 0.5) * this.speed * 2; // Velocidad aleatoria en x
        this.dy = (Math.random() - 0.5) * this.speed * 2; // Velocidad aleatoria en y
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.draw(context);

        // Actualizar la posición de acuerdo a la velocidad
        this.posX += this.dx;
        this.posY += this.dy;

        // Detectar colisiones con las paredes
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy;
        }

        // Detectar colisiones con otros círculos
        for (let circle of circles) {
            if (circle !== this) {
                let dx = this.posX - circle.posX;
                let dy = this.posY - circle.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.radius + circle.radius) {
                    // Si hay colisión, ajustar las posiciones para evitar superposición
                    let overlap = this.radius + circle.radius - distance;
                    let angle = Math.atan2(dy, dx);
                    let moveX = overlap * Math.cos(angle);
                    let moveY = overlap * Math.sin(angle);

                    this.posX += moveX / 2;
                    this.posY += moveY / 2;
                    circle.posX -= moveX / 2;
                    circle.posY -= moveY / 2;

                    // Cambiar las direcciones para simular el rebote
                    let tempDx = this.dx;
                    let tempDy = this.dy;
                    this.dx = circle.dx;
                    this.dy = circle.dy;
                    circle.dx = tempDx;
                    circle.dy = tempDy;

                    // Cambiar el color del contorno
                    this.color = getRandomColor();
                    circle.color = getRandomColor();
                }
            }
        }
    }
}

// Función para generar un color aleatorio en formato hexadecimal
function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let circles = [];
for (let i = 0; i < 10; i++) {
    let randomRadius = Math.floor(Math.random() * 100 + 30);

    let newCircle = new Circle(0, 0, randomRadius, getRandomColor(), (i + 1).toString(), 3);
    circles.push(newCircle);
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);

    for (let circle of circles) {
        circle.update(ctx, circles);
    }
};

updateCircles();
