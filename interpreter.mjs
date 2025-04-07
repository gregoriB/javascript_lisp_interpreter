import fs from "fs";
import path from "path";
import { exit } from "process";

const args = process.argv.slice(2);
const validExtensions = [".lisp", ".lsp", ".scm"];
const lispFileName = args[0];
const isResiliant = args[1] === "--no-crash";

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
  let isInString = false;
  const arr = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] === '"') {
      isInString = !isInString;
    }

    if (str[i] === " " && !isInString) {
      continue;
    }

    let j = i;
    inner: while (j < str.length) {
      j++;
      if (str[j] === '"') {
        isInString = !isInString;
      }
      if (str[j] === " ") {
        if (!isInString) {
          break inner;
        }
      }
    }

    arr.push(str.slice(i, j));
    i = j + 1;
  }

  return arr;
}

function listify(tokens, list = [], i = 0) {
  if (i >= tokens.length) {
    return [list, i];
  }

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

function listifyAll(tokens) {
  let lists = [];
  let i = 0;

  while (i < tokens.length) {
    const [list, nextIndex] = listify(tokens, [], i);
    lists.push(list);
    i = nextIndex;
  }

  return lists[0];
}

const env = {
  true: true,
  false: false,
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
  list: (...args) => args,
  at: (arr, i) => arr[i],
  assert: (a, b, message = "does not equal") => {
    if (a === b) return;
    throw new Error(`Assertion failed: ${a} ${message} ${b}`);
  },
  fail: (message = "") => {
    throw new Error(`Intentional Fail: ${message}`);
  },
  print: console.log,
};

function evaluate(expression, scope) {
  if (!isNaN(expression)) {
    return Number(expression);
  }

  if (typeof expression === "string") {
    if (expression[0] === '"') return expression;
    if (expression in scope) return scope[expression];
    throw new Error(`${expression} is not valid`);
  }

  if (!expression?.length) {
    return;
  }

  let keyword = expression[0];

  if (typeof keyword !== "string") {
    for (let item of expression) evaluate(item, scope);

    return;
  }

  if (keyword[0] === '"') {
    return keyword;
  }

  if (keyword === "true" || keyword === "false") {
    return scope[keyword];
  }

  if (keyword === "define") {
    const [, name, value] = expression;
    if (name in scope)
      throw new Error(
        `Cannot redefine a variable using define: "${name}".  Use redefine instead`,
      );

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
    const lists = listifyAll(tokens);
    lists.forEach((list) => evaluate(list, env));
  } catch (e) {
    console.error(`INTERPRETER ERROR: ${e}`);
    if (!isResiliant) throw e;
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
