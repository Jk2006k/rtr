import { useState } from 'react'
import './App.css'

function App() {
  const [ingredients, setIngredients] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    setInputValue(ingredients[index]);
    setEditIndex(index);
  }

  const handleRemove = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    setInputValue('');
    setEditIndex(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    if (editIndex !== null) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[editIndex] = inputValue;
      setIngredients(updatedIngredients);
      setEditIndex(null);
    } else {
      setIngredients([...ingredients, inputValue]);
    }
    setInputValue('');
  }

  return (
    <div className="container">
      <h1>Recipe Ingredients Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input-field"
          placeholder="Enter ingredient"
        />
        <button type="submit" className="submit-button">
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </form>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient}
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
