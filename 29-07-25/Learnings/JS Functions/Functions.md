what is the functions in js?
-->Its reusable block of codes designed to perform specific tasks.they allow you to organize ,reuse and modelrize the code.It can take inputs,perform actions and return outputs.
EX: 
function sum(x, y) { 
    return x + y; 
}
console.log(sum(6, 9));     // output: 15

Syntax:
  * Begin with the keyword function keyword -->function()
  * A user defined function name 
  * A list of parameters enclosed within parentheses and separated by commas
  * list of statements composing the body of the function enclosed within curly braces {}.
  * Using the return statements 
  * Using the function parameters
   
  Calling Functions: 
       
        // Function Definition
       function welcomeMsg(name) {
       return ("Hello " + name + " welcome to GeeksforGeeks");
       }
       let nameVal = "User";
       // calling the function
       console.log(welcomeMsg(nameVal));

 Function Expression:

        It is similar to a function declaration without the function name.

        Ex:
            const mul = function (x, y) {
             return x * y;
             };
            console.log(mul(4, 5));

 Arrow functions:
        Ex:
           const a = ["Hydrogen", "Helium", "Lithium", "Beryllium"];

const a2 = a.map(function (s) {
    return s.length;
});

console.log("Normal way ", a2);

const a3 = a.map((s) => s.length);

console.log("Using Arrow Function ", a3);           
  



Callback Functions:
    
Ex:
  
function num(n, callback) {
    return callback(n);
}

const double = (n) => n * 2;

console.log(num(5, double));
     

