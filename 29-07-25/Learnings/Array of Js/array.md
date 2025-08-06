1.Array Elements Can be Objects:

    JavaScript variables can be objects. Arrays are special kinds of objects.

    Because of this, you can have variables of different types in the same Array.

    You can have objects in an Array. You can have functions in an Array. You can have arrays in an Array:

             myArray[0] = Date.now;
             myArray[1] = myFunction;
             myArray[2] = myCars;

Array Properties and Methods:

       The real strength of JavaScript arrays are the built-in array properties and methods:

              cars.length   // Returns the number of elements
              cars.sort()   // Sorts the array
Array methods are covered in the next chapters

       The length Property
       The length property of an array returns the length of an array (the number of array elements).

Ex:
const fruits = ["Banana", "Orange", "Apple", "Mango"];
let length = fruits.length;


Accessing the First Array Element

Ex:
  const fruits = ["Banana", "Orange", "Apple", "Mango"];
  let fruit = fruits[0];

  Accessing the Last Array Element

Ex:
     const fruits = ["Banana", "Orange", "Apple", "Mango"];
     let fruit = fruits[fruits.length - 1];


     Looping Array Elements

         One way to loop through an array, is using a for loop:

Ex:
    const fruits = ["Banana", "Orange", "Apple", "Mango"];
    let fLen = fruits.length;

    let text = "<ul>";
    for (let i = 0; i < fLen; i++) {
    text += "<li>" + fruits[i] + "</li>";
    }
    text += "</ul>";




2.Converting an Array to a String

    The JavaScript method toString() converts an array to a string of (comma separated) array values.

Ex:

   const fruits = ["Banana", "Orange", "Apple", "Mango"];
   document.getElementById("demo").innerHTML = fruits.toString();
    