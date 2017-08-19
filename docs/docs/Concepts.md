# Concepts

This page contains info about important concepts in MathX.

## The Calculation Graph

MathX models a mathematical calculation as a graph with it's edges indicating dependencies. Consider the simple calculation below.
 
```
a = 3
b = 4
c = sqrt(a^2 + b^2) = 5
```

Here we could say that `c` depends on both `a` and `b`. And that `a` and `b` provide for `c`. When the value of either `a` or `b` changes the value of `c` changes.

In MathX each line from the sample equation would be represented as a Cell. Cell's have symbols and formulas. So we would have...

```
CellA = {
    symbol: 'a',
    formula: '3'
};

CellB = {
    symbol: 'b',
    formula: '4'
};

CellC = {
    symbol: 'c',
    formula: 'sqrt(a^2 + b^2)'
};
```

## Observables and Mobx

MathX uses the Mobx library to make certain properties observable. This makes it easy to create very responsive interfaces. 

TODO: need to expand on this