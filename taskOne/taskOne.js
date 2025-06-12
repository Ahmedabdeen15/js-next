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
// arg => typeof arg === 'object' ? JSON.stringify(arg) : arg
const food = ["Burger","Pizza", "Donuts",
     "Pizza", "Koshary" , "Donuts" , "Seafood" , "Burger"];

// create set from array and remove duplicates
const uniqueFood = new Set(food);
console.log(uniqueFood);

//remove add pasta from set
uniqueFood.add("pasta");
console.log(uniqueFood);

//remove burger from set
uniqueFood.delete("Burger");
console.log(uniqueFood);

// Function to clear set if it has more than 2 items
function clearIfLarge(set) {
    if (set.size > 2) {
        set.clear();
        console.log("Set was cleared");
    } else {
        console.log("Set was not cleared");
    }
    console.log("Current set:", set);
}

// Test the function
clearIfLarge(uniqueFood);


console.log("Current time is:", new Date());
console.log({ a: 1, b: 2 });