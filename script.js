// Importing music 
const intromusic=new Audio("./introSong.mp3")
const gameover=new Audio("./gameOver.mp3")
const midWeapon=new Audio("./heavyWeapon.mp3")
const hugeWeapon=new Audio("./hugeWeapon.mp3")
const killEnemy=new Audio("./killEnemy.mp3")
const shooting=new Audio("./shoooting.mp3")
// intromusic.play()



canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
let difficulty = 1;
form = document.querySelector("form")
scoreboard = document.querySelector(".scoreboard")
const light_weapon_damage=10
const heavy_weapon_damage=30
const huge_weapon_damage=50
let score=0;

//------------------------------click event of input field-------------------------------------
document.querySelector("input").addEventListener("click", (e) => {
    intromusic.pause()
    e.preventDefault();
    form.style.display = "none";
    scoreboard.style.display = "block";
    animation();
    const uservalue = document.querySelector("#difficulty").value;
    if (uservalue == 'easy') {
        setInterval(spawnenemy, 2500);
        // difficulty=1.1;

    }
    if (uservalue == 'medium') {
        setInterval(spawnenemy, 2000);
        difficulty = 1.4;

    }
    if (uservalue == 'hard') {
        setInterval(spawnenemy, 1000);
        difficulty = 2;

    }
    if (uservalue == 'Insane') {
        setInterval(spawnenemy, 600);
        difficulty = 2.5

    }

})
document.querySelector(".mygame").appendChild(canvas);
const context = canvas.getContext('2d');
playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}
//---------------------------------------endscreen--------------------------------------------------
const gameoverLoader = () => {
    // Creating endscreen div and play again button and high score element
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");
    if(score>localStorage.getItem("high_score")){
        localStorage.setItem("high_score",score);
    }
    highScore.innerHTML=`High Score:${localStorage.getItem("high_score")}`;

    // adding text to playagain button
    gameOverBtn.innerText = "Play Again";

    gameOverBanner.appendChild(highScore);
    gameOverBanner.appendChild(gameOverBtn);

    // Making reload on clicking playAgain button
    gameOverBtn.onclick = () => {
        window.location.reload();

        
        
    };

    gameOverBanner.classList.add("gameover");

    document.querySelector("body").appendChild(gameOverBanner);
};

//--------------------------player class---------------------------------
class Player {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, (Math.PI / 180) * 360, (Math.PI / 180) * 0, false);
        context.fillStyle = this.color;

        context.fill();
    }

}
//--------------------------------Weapon class-------------------------------------------------
class Weapon {
    constructor(x, y, r, color, velocity,damage) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.velocity = velocity;
        this.damage=damage
    }
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, (Math.PI / 180) * 360, (Math.PI / 180) * 0, false);
        context.fillStyle = this.color;

        context.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x * 6;
        this.y += this.velocity.y * 6;
    }


}
//--------------------------------Huge weapon  class-------------------------------------------------
class HugeWeapon {
    constructor(x, y,damage) {
        this.x = x;
        this.y = y;
        this.color="white" 
        this.damage=damage
    }
    draw() {
        context.beginPath();
        context.fillRect(this.x,this.y,200,canvas.height)
        context.fillStyle = this.color;

        context.fill();
    }
    update() {
        this.draw();
        this.x += 10;
        // this.y +=10;
    }


}
//---------------------------------------Enemy class--------------------------------------
class Enemy {
    constructor(x, y, r, color, velocity) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        context.beginPath();
        if(this.r<0){
            this.r=0;
        }
        context.arc(this.x, this.y, this.r, (Math.PI / 180) * 360, (Math.PI / 180) * 0, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x * 1.4;
        this.y += this.velocity.y * 1.4;
    }


}
//---------------------------------------particle class--------------------------------------
class Particle {
    constructor(x, y, r, color, velocity) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.velocity = velocity;
        this.alpha=1;
    }
    draw() {
        context.save()
        context.beginPath();
        context.globalAlpha=this.alpha;
        
        context.arc(this.x, this.y, this.r, (Math.PI / 180) * 360, (Math.PI / 180) * 0, false);
        context.fillStyle = this.color;

        context.fill();
        context.restore();
    }
    update() {
        this.draw();
        this.x += this.velocity.x * 1.4;
        this.y += this.velocity.y * 1.4;
        this.alpha-=0.01
    }


}

//------------------------------- main logic--------------------------------------

const p1 = new Player(playerPosition.x, playerPosition.y, 10, "white");
//----------------animation function-------------------------
let animationId;
function animation() {
    animationId=requestAnimationFrame(animation)
    context.fillStyle="rgba(49,49,49,0.2)";
    context.fillRect(0, 0, canvas.width, canvas.height);
        p1.draw();
        //-----------------------generating huge weapon---------------------------
        hugeWeapons.forEach((hugeweapon,hugeWeaponIndex)=>{
            if(hugeweapon.x>canvas.width){
                hugeWeapons.splice(hugeWeaponIndex,1)
            }
            else{

                hugeweapon.update();
            }

        })
        //----------------------------generating particles------------------------------------
        particles.forEach((particle,particleIndex)=>{
            if(particle.alpha<=0){
                particles.splice(particleIndex,1)
            }
            else{

                particle.update()
            }
        })
    weapons.forEach((weapon,weaponIndex) => {
        weapon.update();
        if(weapon.x-weapon.r<1 ||weapon.y-weapon.r<1 || weapon.x-weapon.r>canvas.width || weapon.y-weapon.r>canvas.height){
            weapons.splice(weaponIndex,1)
        }
    })

    //---------------------------Generating enemy--------------------------------
    enemies.forEach((enemy,enemyIndex) => {
            enemy.update();
            const distance_player_enemy = Math.hypot(p1.x - enemy.x, p1.y - enemy.y);
            if (distance_player_enemy - p1.r - enemy.r < 1) {
                //game over 
            cancelAnimationFrame(animationId) 
            gameover.play()
            gameoverLoader()               
            }
            hugeWeapons.forEach((hugeWeapon)=>{
                //finding distance betwwen huge weapon and enemy
                const distance_hugeweapon_enemy=hugeWeapon.x-enemy.x;
                if(distance_hugeweapon_enemy<=200 && distance_hugeweapon_enemy>=-200){
                    score=score+4;
                    scoreboard.innerHTML=`Score:${score}`  
                    setTimeout(() => {enemies.splice(enemyIndex, 1)}, 0);
                }
                
            })
            weapons.forEach((weapon, weaponIndex) => {

                const distance_weapon_enemy = Math.hypot(weapon.x - enemy.x, weapon.y - enemy.y);
                if (distance_weapon_enemy - weapon.r - enemy.r < 1) {
                 
                    //reducing size of enemy on hit 
                    if(enemy.r>weapon.damage+5){
                       gsap.to(enemy,{
                        r:enemy.r-weapon.damage,
                       });
                       setTimeout(() => {      
                                
                           weapons.splice(weaponIndex,1)
                       }, 0);
                    }
                    else{
                        for (let i = 0; i < 20;i++) {
                            particles.push(new Particle(weapon.x,weapon.y,2,enemy.color,{x:Math.random()-0.5,y:Math.random()-0.5}))                    
                        }
                        score=score+4;
                        scoreboard.innerHTML=`Score:${score}`     
                        setTimeout(() => {
                            killEnemy.play()   
                            enemies.splice(enemyIndex, 1)
                            weapons.splice(weaponIndex,1)
                        }, 0);

                    }
                }
            })
        }
    )

}
const weapons = []
const enemies = []
const particles=[]
const hugeWeapons=[]
//---------------------------spawn enemy function--------------------------------------
const spawnenemy = () => {
    const enemySize = Math.round(Math.random() * 40) + 5
    const enemyColor = `hsl(${Math.floor(Math.random()*360)},100%,50%)`

    let random;
    if (Math.random() < 0.5) {
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height
        }
    }
    else {
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
        }

    }
    const myangle = Math.atan2(canvas.height / 2 - random.y, canvas.width / 2 - random.x)
    const velocity = {
        x: Math.cos(myangle) * difficulty,
        y: Math.sin(myangle) * difficulty,
    }

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}

//------------------------------click event listener------------------------
canvas.addEventListener('click', (e) => {
    shooting.play();
    const myangle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(myangle),
        y: Math.sin(myangle),
    }

    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 4, "white", velocity,light_weapon_damage))

})

//------------------right click weapon----------------------------

//2 points are required for mid weapon
// addEventListener.("")
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if(score>=2){
        midWeapon.play()
        score=score-2;
        scoreboard.innerHTML=`Score:${score}`     

    const myangle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(myangle),
        y: Math.sin(myangle),
    }

    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 26, "white", velocity,heavy_weapon_damage))
    }
})

//------------------Mega weapon----------------------------

//5 points are required for mega weapon
   addEventListener("keypress",((e)=>{
       if(e.code=='Space'){
        if(score>=10){
            hugeWeapon.play()
            score=score-10;
            scoreboard.innerHTML=`Score:${score}`     
            const myangle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
            const velocity = {
                x: Math.cos(myangle),
                y: Math.sin(myangle),
            }
        
            hugeWeapons.push(new HugeWeapon(0,0,huge_weapon_damage))
        
        }
            
        }
        
    }))
    // //----------------------cheat code----------------------
    addEventListener('keypress',(e)=>{
       if(e.code=='KeyZ'){
        score=score+100;
        scoreboard.innerHTML=`Score:${score}`      
       }           
        }
    )
    addEventListener('contextmenu',(e)=>{
        e.preventDefault();
    })
    addEventListener("resize",()=>{
        window.location.reload();
        // canvas.height=innerHeight;
        // canvas.width=innerWidth
    })
    
    


