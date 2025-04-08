import readline from "readline";
import fs from "fs";

const message = process.argv[2] || "Enter input: ";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(message, (value) => {
  console.log(value);
  rl.close();
});
