console.log("Hello World");

const now=new Date();
console.log("Current Date and Time");
const date1=new Date('2025-08-12T13:00:00Z');
const date2=new Date('2025-08-13T13:00:00Z');
const differenceInMilliseconds=date2-date1;
console.log(differenceInMilliseconds);


function secondsUntilDiwali() {
  const now = new Date();
const diwaliDate = new Date(2025, 9, 21); 
const diffMs = diwaliDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return 0;
  }
  const seconds = Math.floor(diffMs / 1000);
  return seconds;
}
const secondsRemaining = secondsUntilDiwali();
console.log(`Seconds until Diwali 2025: ${secondsRemaining}`);




