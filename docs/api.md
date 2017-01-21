### Add a cell

```
  const remath = new Remath();
  const a = remath.addCell({
    symbol: 'a',
    value: '= 10'
  });
```

### Add a cell that references another cell

```
  const b = remath.addCell({
    symbol: 'b',
    value: '= a + 10'
  });
  b.setValue('this is now a text cell');
  b.setValue('=a + 10');
```

### Add a text cell

```
  const note = remath.addCell({
    value: 'this is a note'
  });
```

### Add a boolean cell

```
  const note = remath.addCell({
    symbol: 'switch',
    value: '= true'
  });
```

### Add a pick list

```
  const fruit = remath.addPickList({
    symbol: 'fruit',
    options: ['apple', 'banana', 'grape']
    value: 'apple'
  });
```
