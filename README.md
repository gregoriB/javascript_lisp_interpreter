# LISP interpreter written in JavaScript

## Description

This is being developed just for fun. I would likely use an existing robust Scheme-like LISP if I ever wanted to do any serious LISPing. This will probably be rewritten in C anyway.

## Usage

### Normal

`npm run start` runs all LISP files in the `src/` directory.

`npm run interpret <path>` interprets a single file, eg `npm run src/main.lisp`

Supported file formats include: `.lisp`, `.lsp`, and `.scm`

### Tests

Run `npm run test`
Tests go in `tests/`

### Optional Flags

`--no-crash`: Prevents the entire application from crashing when the interpreter encounters an error. Useful when you want to ignore test failures

## Things which I would like to add

- Code comments
- Useful errors (eg. row and column of offending code in the script)
- More List functionality
- Support for more complex data types than lists

## Things I will probably never add

- Mutability
- Loops
- Modules

## Optimization

Very little thought has been put into optimizations, and no benchmarks exist at this time
