const fs = require("fs");

fs.readFile("result/result.txt", function(err, buf) {
  const resultData = buf.toString().replace(/([0-9]*)(\t*)/g, "").split("\n");
  let ignore = resultData.includes('จินดารัตน์ ไชยขันธ์ ');
  console.log(ignore);
});

console.log("\x1b[47m\x1b[34m", "Hello World")
console.log("\x1b[0m");