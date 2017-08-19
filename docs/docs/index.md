# MathX

MathX is a library that represents a mathematical equation as a graph of dependencies. It uses the Mobx library to make properties observable.

## Getting Started

##### Adding an equation

```
  const graph = MathX.newCalculation();
  const a = graph.addEquation({
    symbol: 'a',
    formula: '= 10'
  });
```

##### Adding an equation that references the value of another equation

```
  const b = graph.addEquation({
    symbol: 'b',
    formula: '= a + 10'
  });
```
since the given formula references the symbol `a` the equation is dependent on the value of `a` and will update whenever the value of `a` changes


##### Add a boolean cell

```
  const note = remath.addCell({
    symbol: 'switch',
    value: '= true'
  });
```

##### Add a pick list

```
  const fruit = remath.addPickList({
    symbol: 'fruit',
    options: ['apple', 'banana', 'grape']
    value: 'apple'
  });
```
