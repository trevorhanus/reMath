# Calculation

## Constructor

`constructor(): Calculation`  
Returns a new Calculation instance

## Properties

`cells: Cell[]`  
Returns a list of all the cells in the model.

## Methods

`newEquation(props: EquationProps): Cell`  
Creates a new cell and adds it to the model.

`cellsContaining(query: string): Cell[]`  
Returns a list of all the cells whose symbols contain the given query.

(future) `newPicklist(props: PicklistProps): Picklist`  
Creates a new picklist and adds it to the model.

(future) `newBoolean(props: BooleanProps): Boolean`  
Creates a new boolean node and adds it to the model.

`removeCellById(id: string): Cell`  
Removes the cell from the graph and returns it.

`symbolExists(symbol: string): Boolean`  
Returns true if the symbol exists in the model

`idExists(id: string): boolean`  
Returns true if a cell with the id exists

`findById(id: string): Cell`  
Returns the cell that has the given id, `null` if there is no cell with that id.

`findBySymbol(symbol: string): Cell`  
Returns the cell that has the given symbol, `null` if none exists
