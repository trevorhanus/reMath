# Error Container

Superclass that allows an object to carry errors.

## Direct Subclasses

ErrorContainer -> Lockable

## Indirect Subclasses

Node, Cell

## Constructor

`constructor(): ErrorContainer`

## Properties

`hasError: boolean`  
Returns true if the object has any errors

`errors: IError[]`  
Returns all errors, returns empty array if there are none.

## Internal Methods

`__addError(error: IError): void`  
Adds an error to the object.

`__clearError(type: ErrorType): void`  
Removes the error of the given type from the object.
