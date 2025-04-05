import fs from "fs";
import path from "path";
import { exit } from "process";

console.log("Starting LISP Interpreter");

const args = process.argv.slice(2);
const validExtensions = [".lisp", ".lsp"];
const lispFileName = args[0];

console.log("Interpretting", lispFileName);

function getFile(fileName) {
  return fs.readFileSync(fileName, "utf8");
}

function formatFile(fileStr) {
  return fileStr
    .replaceAll(")", " ) ")
    .replaceAll("(", " ( ")
    .replaceAll("+", " + ")
    .replaceAll("-", " - ")
    .replaceAll("*", " * ")
    .replaceAll("/", " / ")
    .replaceAll("\n", " ")
    .replaceAll(/ {1,}/g, " ")
    .trim();
}

function tokenize(str) {
  const arr = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] === " ") {
      continue;
    }
    let j = i;
    while (str[j] !== " " && j < str.length) j++;

    arr.push(str.slice(i, j));
    i = j + 1;
  }

  return arr;
}

function listify(tokens, list = [], i = 1) {
  switch (tokens[i]) {
    case "(":
      const [newList, nextIndex] = listify(tokens, [], i + 1);
      list.push(newList);
      return listify(tokens, list, nextIndex);
    case ")":
      return [list, i + 1];
    default:
      list.push(tokens[i]);
      return listify(tokens, list, i + 1);
  }
}

const api = {
  "+": (...args) => args.reduce((acc, curr) => curr + acc, 0),
  "-": (...args) => args.reduce((acc, curr) => curr - acc, 0),
  "*": (...args) => args.reduce((acc, curr) => curr * acc, 1),
  "/": (...args) => args.reduce((acc, curr) => curr / acc, 1),
  "<": (a, b) => a < b,
  ">": (a, b) => a > b,
  "==": (a, b) => a === b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  "!=": (a, b) => a != b,
  print: console.debug,
};

function evaluate(expression, scope) {
  if (!isNaN(expression)) {
    return Number(expression);
  }

  if (typeof expression === "string") {
    if (expression in scope) return scope[expression];
    throw new Error(`${expression} is not valid`);
  }

  const keyword = expression[0];
  if (keyword === "declare") {
    const [, name, value] = expression;
    scope[name] = evaluate(value, scope);
    return evaluate(expression.slice(3), scope);
  }

  if (keyword === "lambda") {
    const [, params, body] = expression;
    return (...args) => {
      const local = { ...scope };
      params.forEach((p, i) => (local[p] = args[i]));
      return evaluate(body, local);
    };
  }

  if (keyword === "if") {
    const [, test, consequent, alternate] = expression;
    const result = evaluate(test, scope);
    return evaluate(result ? consequent : alternate, scope);
  }

  const fn = evaluate(keyword, scope);
  const args = expression.slice(1).map((arg) => evaluate(arg, scope));

  return fn(...args);
}

function run(fileName) {
  try {
    if (!isValidFile(lispFileName))
      throw new Error(`${lispFileName} is not a valid .lisp file`);

    const file = getFile(fileName);
    const formatted = formatFile(file);
    const tokens = tokenize(formatted);
    const [list] = listify(tokens);

    evaluate(list, api);
  } catch (e) {
    console.error(`FATAL ERROR: ${e}`);
    exit();
  }

  console.log("Exiting Interpreter");
}

function isValidFile(filePath) {
  const isExisting = fs.existsSync(filePath);
  const isLisp = validExtensions.includes(path.extname(filePath));

  return isExisting && isLisp;
}

run(lispFileName);
