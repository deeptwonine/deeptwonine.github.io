let hasArrivedAtBridge = false;
let bridgeCenterOffset = 0; 

function snapBridgeToGrid() {
    const topCap = document.getElementById('bridge-top');
    const middle = document.getElementById('bridge-middle');
    const cardsContainer = document.getElementById('bridge-right');
    const spacer = document.getElementById('bridge-spacer');
    const bridgeFull = document.getElementById('bridge-center');
    const character = document.getElementById('character');
    const house = document.getElementById('house');

    const isBridgeHidden = window.getComputedStyle(bridgeFull).display === "none";

    let tileSize = topCap.getBoundingClientRect().height;
    if (isBridgeHidden) tileSize = 32;
    if (tileSize === 0) return; // safety check incase layout yet to be drawn

    cardsContainer.style.marginTop = '';
    const cssMargin = parseFloat(window.getComputedStyle(cardsContainer).marginTop) || 0;

    // to measure initial cards size only
    middle.style.height = '0px'; 
    spacer.style.height = '0px';

    const cardsHeight = cardsContainer.scrollHeight;
    let neededMiddle = cardsHeight;
    const wholeTiles = Math.ceil(neededMiddle / tileSize) + 1; 
    const middleHeight = wholeTiles * tileSize;

    middle.style.height = `${middleHeight}px`;
    const totalBridgeHeight = middleHeight - 3.5*tileSize;
    spacer.style.height = `${totalBridgeHeight}px`;
    cardsContainer.style.marginTop = `${cssMargin + (2.2 * tileSize)}px`;

    if (hasArrivedAtBridge && character) {
        character.style.transform = 'none';

        const meRect = me.getBoundingClientRect();
        const charRect = character.getBoundingClientRect();     
        const charCenter = charRect.left + meRect.width / 2;

        let bridgeCenter;
        if (isBridgeHidden) {
            bridgeCenter = house.getBoundingClientRect().left / 2;
        } else {
            const bridgeRect = topCap.getBoundingClientRect();
            bridgeCenter = bridgeRect.left + bridgeRect.width / 2;
        }
        
        const newX = bridgeCenter - charCenter;
        character.style.transform = `translateY(10%) translateX(${newX}px)`;
    }
}

// run the math when the page loads, and recalculate instantly if window is resized
window.addEventListener('load', snapBridgeToGrid);
window.addEventListener('resize', snapBridgeToGrid);

// door opening stuff
function openDoor() {
    const door = document.getElementById('door');
    door.style.animationName = 'door';
}

window.addEventListener('load', openDoor);

// character animation stuff
function walkOut() {
    const me = document.getElementById('me');
    const character = document.getElementById('character');
    me.style.animation = 'walk_out 300ms 0.5s steps(1) 1 forwards, appear 300ms 0.5s linear 1 forwards';
    character.style.animation = 'move_forward 300ms 0.5s linear 1';
}

function turnFrontLeft() {
    const me = document.getElementById('me');
    me.style.animation = 'turn_front_left 100ms 200ms steps(1, jump-end) 1 forwards';
}

function walkLeft() {
    const me = document.getElementById('me');
    const bridge = document.getElementById('bridge-top');
    const bridgeFull = document.getElementById('bridge-center');
    const character = document.getElementById('character');
    const house = document.getElementById('house');
    
    me.style.animation = 'walk_left 100ms steps(1) infinite';
    let currentX = 0;
    
    function checkCenter() {
        const meRect = me.getBoundingClientRect();        
        const meCenter = meRect.left + meRect.width / 2;

        const isBridgeHidden = window.getComputedStyle(bridgeFull).display === "none";

        let bridgeCenter;
        if (isBridgeHidden) {
            bridgeCenter = house.getBoundingClientRect().left / 2;
        } else {
            const bridgeRect = bridge.getBoundingClientRect();
            bridgeCenter = bridgeRect.left + bridgeRect.width / 2;
        }
        
        if (meCenter > bridgeCenter) {
            currentX -= 1; 
            character.style.transform = `translateY(10%) translateX(${currentX*1.5}%)`;
            
            requestAnimationFrame(checkCenter);
        } else {
            me.style.animation = 'none';
            me.style.objectPosition = '24% 0%';

            const walkFinishedEvent = new CustomEvent('walkleftend');
            me.dispatchEvent(walkFinishedEvent);
        }
    }
    requestAnimationFrame(checkCenter);
}

function turnLeftFront() {
    const me = document.getElementById('me');
    me.style.animation = 'turn_left_front 100ms 100ms steps(1, jump-end) 1 forwards';
}

function sayHi() {
    const me = document.getElementById('me');
    const speech = document.getElementById('speech');

    me.style.objectPosition = '0% 0%';
    me.style.animation = 'wave_hi 500ms 100ms steps(1, jump-end) 1 forwards';
    speech.style.animation = 'speech_appear 500ms 100ms steps(1, jump-end) 1 forwards';
}

function idle() {
    const me = document.getElementById('me');
    me.style.animation = 'idle 1200ms 100ms steps(1, jump-end) infinite forwards';
}

function showMyPic() {
    const mypic = document.getElementById('mypic');
    mypic.style.animation = 'show 400ms 200ms linear 1 forwards';
}

function typeText() {
    const hi_text = document.getElementById('hi_text');
    hi_text.style.animation = 'show 400ms 200ms linear 1 forwards'
}

const door = document.getElementById('door');
const me = document.getElementById('me');
const speech = document.getElementById('speech');

// coordinate animations in succession
door?.addEventListener('animationend', walkOut);
me?.addEventListener('animationend', (event) => {
    if (event.animationName === 'walk_out' || event.animationName === 'appear') {
        if (me.style.animationName !== 'turn_front_left') {
            me.style.opacity = '100%';
            character.style.transform = "translateY(10%)"
            turnFrontLeft();
        }
    } else if (me.style.animationName === 'turn_front_left') {
        setTimeout(() => {
            walkLeft();
        }, 150);
    } else if (me.style.animationName === 'turn_left_front') {
        sayHi();
    } else if (me.style.animationName === 'wave_hi') {
        idle();
    }
});

speech?.addEventListener('animationend', () => {
    if (speech.style.animationName === 'speech_appear'){
        showMyPic();
        typeText();
    }
})

me?.addEventListener('walkleftend', () => {
    hasArrivedAtBridge = true;
    turnLeftFront();
});

function toggleMenu() {
    const nav = document.querySelector("nav");
    nav.classList.toggle("active");
}

function toggleTV() {
    const power = document.getElementById("tv_power");
    const tv_cover = document.getElementById("tv_cover");
    const tv_show = document.getElementById("tv_show");
    power.classList.toggle("on");

    if (power.classList.contains("on")) {
        tv_cover.style.animation = 'tv_on 300ms steps(1, jump-end) 1 forwards';
        tv_show.play();
    } else {
        tv_cover.style.animation = 'tv_off 300ms steps(1, jump-end) 1 forwards';
        tv_show.pause();
    }
}

const power = document.getElementById("tv_power");
const cover = document.getElementById("tv_cover");
const tv_show = document.getElementById("tv_show");

tv_show?.addEventListener('ended', () => {
    if (power.classList.contains("on")) {
        toggleTV();
    }
})

function changeChannel() {
    const power = document.getElementById("tv_power");
    const channel = document.getElementById("tv_channel");
    const tv_show = document.getElementById("tv_show");
    const tv_src = document.querySelector("#tv_show > source");

    let nextVideo = "static.mp4";
    let isLooping = false;

    if (channel.classList.contains("two")) {
        channel.classList.remove("two");
        channel.classList.add("three");
        nextVideo = "channel3.mp4";
        isLooping = false;
    } else if (channel.classList.contains("three")) {
        channel.classList.remove("three");
        channel.classList.add("four");
        nextVideo = "static.mp4";
        isLooping = true;
    } else if (channel.classList.contains("four")) {
        channel.classList.remove("four");
        channel.classList.add("five");
        nextVideo = "channel5.mp4";
        isLooping = false;
    } else if (channel.classList.contains("five")) {
        channel.classList.remove("five");
        channel.classList.add("six");
        nextVideo = "static.mp4";
        isLooping = true;
    } else if (channel.classList.contains("six")) {
        channel.classList.remove("six");
        channel.classList.add("seven");
        nextVideo = "channel7.mp4";
        isLooping = false;
    } else if (channel.classList.contains("seven")) {
        channel.classList.remove("seven");
        channel.classList.add("eight");
        nextVideo = "static.mp4";
        isLooping = true;
    } else if (channel.classList.contains("eight")) {
        channel.classList.remove("eight");
        nextVideo = "channel1.mp4"
        isLooping = false;
    } else {
        channel.classList.add("two");
        nextVideo = "static.mp4";
        isLooping = true;
    }

    tv_src.src = nextVideo;
    tv_show.loop = isLooping;
    tv_show.load();

    if (power.classList.contains("on")) {
        tv_show.play();
    } else {
        tv_show.pause();
    }
}