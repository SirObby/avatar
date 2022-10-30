/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('ctx');
const ctx = canvas.getContext("2d");

ctx.translate(canvas.width / 2, canvas.height / 2)

let color = "#000000";

let mouth_size = 25;
let cycle = 0;

function draw_borders() {
    ctx.beginPath();
    ctx.moveTo(250, -250);
    ctx.lineTo(250, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-250, 250);
    ctx.lineTo(250, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(250, -250);
    ctx.lineTo(-250, -250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-250, 250);
    ctx.lineTo(-250, -250);
    ctx.stroke();
}

function draw_head(x, y, volume) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x + 150, y - 150, 30, 160);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x - 170, y - 150, 30, 160);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x - 140, y - 180, 290, 30);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x - 90, y - 100, 25, 25);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x + 70, y - 100, 25, 25);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x - 70, y - 16, 160, (mouth_size / 2 + (volume * 125 * 15)));
    ctx.fill();

    console.log(mouth_size / 2 + (volume * 125 * 15));
}

function draw_guy(x, y) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x + 170, y + 10, 30, 250);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x - 190, y + 10, 30, 250);
    ctx.fill();
}

let animation_frame, x, y, head_x, head_y, idle_animation, talk_animation = 0;

x = 0;
y = 0;
head_x = 0;
head_y = 0;
idle_animation = 1;
talk_animation = 0;
animation_frame = 0;

let caffinated = 0;
let in_settings = 0;

let microphone = new Microphone();

setInterval(() => {

    color = document.getElementById("color").value;
    bgcolor = document.getElementById("bgcolor").value;

    document.getElementById("body").style.backgroundColor = bgcolor;
    document.getElementById("body").style.color = color;
    document.getElementById("invert-btn").style.color = color;
    document.getElementById("rainbow-btn").style.color = color; // settings_button
    document.getElementById("settings_button").style.color = color;

    document.getElementById("talk-btn").style.color = color;
    document.getElementById("coffee-btn").style.color = color;

    ctx.fillStyle = bgcolor;
    ctx.beginPath();
    ctx.rect(-250, -250, 500, 500);
    ctx.fill();

    if (in_settings == 0) {

        if (animation_frame == 1 && idle_animation == 1) {
            head_x += 15 * caffinated;
            //y -= 50;
        }
        if (animation_frame == 2 && idle_animation == 1) {
            head_x -= 30 * caffinated;
            //y += 100;
        }
        if (animation_frame == 3 && idle_animation == 1) {
            head_x += 30 * caffinated;
            head_y += 10 * caffinated;
        }
        if (animation_frame == 4 && idle_animation == 1) {
            head_x -= 50 * caffinated;
            head_y -= 10 * caffinated;
        }

        if (animation_frame == 1 && talk_animation == 1) {
            mouth_size += 25;
        }
        if (animation_frame == 2 && talk_animation == 1) {
            mouth_size -= 10;
        }
        if (animation_frame == 3 && talk_animation == 1) {
            mouth_size += 10;
        }
        if (animation_frame == 4 && talk_animation == 1) {
            mouth_size -= 10;
        }

        //draw_borders();
        draw_guy(x, y);
        draw_head(head_x, head_y, microphone.volume);
        animation_frame++;
        if (animation_frame == 5) {
            animation_frame = 1
            head_x = 0;
            head_y = 0;
            mouth_size = 25;

            cycle++;
            if (cycle > 4 && talk_animation == 1) {
                cycle = 0;
                talk_animation = 0;
                //idle_animation = 0;
                //document.getElementById("current").innerHTML = "Idling"
            }
        };

    }
}, 170);

//draw_borders();
//draw_guy(0, 0);

function invert() {
    let temp = document.getElementById("color").value
    document.getElementById("color").value = document.getElementById("bgcolor").value;
    document.getElementById("bgcolor").value = temp;
}

function talk() {

    talk_animation = 1;
    close_settings();
    //document.getElementById("current").innerHTML = "Talking"
}

function caffinate() {
    caffinated++;
    close_settings();
}

var rainbowing = 0;

function rainbow() {
    if (rainbowing == 1) {
        rainbowing = 0;
        return;
    }
    rainbowing = 1;

    let r = 0;
    let g = 0;
    let b = 0;

    setInterval(() => {
        if (rainbowing == 1) {
            if (g != 255) g++;
            if (r != 255 && g > 100) r++;
            if (b != 255 && r > 100) {
                b++;
                g--;
            };

            console.log("r: " + r + " g: " + g + " b: " + b + ` ${rgbToHex(r, g, b)}`);
            document.getElementById("bgcolor").value = `${rgbToHex(r, g, b)}`;

            if (r == 255 && g == 255 && b == 255) {
                r = 0;
                g = 0;
                b = 0;
            }
        }
    }, 10);
}

function open_settings() {
    in_settings = 1;

    ctx.fillStyle = document.getElementById("bgcolor").value;
    ctx.beginPath();
    ctx.rect(-250, -250, 500, 500);
    ctx.fill();

    document.getElementById("settings_element").style.visibility = "visible";
}

function close_settings() {
    in_settings = 0;
    document.getElementById("settings_element").style.visibility = "hidden";
}

function getXY(canvas, event) { //adjust mouse click to canvas coordinates
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top
    const x = event.clientX - rect.left
    return {
        x: x,
        y: y
    }
}

document.addEventListener("click", function (e) {
    const XY = getXY(canvas, e)
    console.log(XY);
    if (in_settings == 0) open_settings();
    /*if(context.isPointInPath(path, XY.x, XY.y)) {
      alert("clicked in rectangle")
    }*/
    if (XY.x > 289 && XY.x < 322 && XY.y > 210 && XY.y < 240) {
        close_settings();
    }
}, false)

// Implement keybinds
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 32) { // space
        talk();
    }
    if (e.keyCode == 13) { // enter
        caffinate();
    }
    if (e.keyCode == 27) { // esc
        close_settings();
    }
    if (e.keyCode == 49) { // 1
        rainbow();
    }
    if (e.keyCode == 50) { // 2
        invert();
    }
});