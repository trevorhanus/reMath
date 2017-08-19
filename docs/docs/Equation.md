# Equation

Represents an equation in the calculation.

Eg: `a = 10` and `b = a + 20` would both be represented as equations.

## Inherits

**Symbol** -> Equation

## Constructor

`constructor(graph: MathX, id?: string)`  
Returns a newly created cell. The `id` parameter is optional and is required when creating a new cell from props, since `id` is final and cannot be changed.

## Properties

`value: number`  
Returns the current value of the equation.

`formula: string`   
Returns the formula as a string.

`displayValue: string`  
Returns the value as a string. Applies any formatting rules such as currency, percentage, etc. Returns an error code when the equation contains an error.

(future) `latexFormula: string`  
Would return the formula in latex as a string.

## Methods

`setFormula(formula: string): void`  
Updates the formula. This updates all the cells dependencies in the graph based on the new formula.

## Inherited Properties and Methods

See Symbol.