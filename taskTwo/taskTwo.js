const originalLog = console.log;
const logDiv = document.getElementById("log");

console.log = function(...args) {
    originalLog.apply(console, args);
    const message = args.map((args) => {
        if(typeof args === 'object'){
            if(args instanceof Set){
                return "{"+Array.from(args)+"}";
            }
            else{
                return "{"+Object.entries(args).map(([key, value]) => `${key}: ${value}`).join(', ')+"}";
            }
        }
        return args;
    }).join(' ');
    logDiv.innerHTML += message + '<br>';
};

class Vehicle {
    constructor(wheels, speed) {
        this.wheels = wheels;
        this.speed = speed;
    }
}

class Bike extends Vehicle {
    static count = 0;

    constructor() {
        super(2, 'fast enough');
        Bike.count++;
    }

    static countCalls() {
        // Bike.count++;
        return Bike.count;
    }
}

const bike = new Bike();
const bike2 = new Bike();
console.log(Bike.countCalls());
