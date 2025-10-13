import React from 'react'

function IngredientList({ ingredients, handleEdit, handleRemove }) {
  return (
    <ul className='ingredient-list'>
        {ingredients.map((ingredient, index) => (
            <li key={index} className='ingredient-item'>
                <span>{ingredient}</span>
                <div>
                    <button onClick={() => handleEdit(index)} className='edit-button'>Edit</button>
                    <button onClick={() => handleRemove(index)} className='remove-button'>Remove</button>
                </div>
           
            
            </li>
        ))}
    </ul>
    )
}
export default IngredientList
  

