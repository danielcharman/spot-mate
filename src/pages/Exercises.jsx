import { useState, useEffect } from 'react';
import ExerciseList from '../components/ExerciseList'

function Exercises() {
  const [exerciseData, setExerciseData] = useState({
    name: '',
    sets: '',
    reps: '',
    rest: '',
  });

  const [exerciseList, setExerciseList] = useState(
    JSON.parse(localStorage.getItem('exerciseList')) || []
  );

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (editIndex !== null) {
      const exerciseToEdit = exerciseList[editIndex];
      setExerciseData({ ...exerciseToEdit });
    }
  }, [editIndex, exerciseList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseData({
      ...exerciseData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Edit existing exercise
      const updatedList = [...exerciseList];
      updatedList[editIndex] = exerciseData;
      setExerciseList(updatedList);
    } else {
      // Add new exercise
      setExerciseList([...exerciseList, exerciseData]);
    }
    localStorage.setItem('exerciseList', JSON.stringify(exerciseList));
    setExerciseData({
      name: '',
      sets: 4,
      reps: 8,
      rest: 2,
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = exerciseList.filter((_, i) => i !== index);
    setExerciseList(updatedList);
    localStorage.setItem('exerciseList', JSON.stringify(updatedList));
  };

  return (
    <>
      <h1 className="pageTitle">Exercises</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

        <form className="form" onSubmit={handleSubmit} style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
          <div className="formGroup">
            <input
              className="formControl"
              placeholder="Exercise Name"
              type="text"
              name="name"
              value={exerciseData.name}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <div className="formGroup">
            <input
              className="formControl"
              placeholder="Sets"
              type="number"
              name="sets"
              value={exerciseData.sets}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <div className="formGroup">
            <input
              className="formControl"
              placeholder="Reps"
              type="number"
              name="reps"
              value={exerciseData.reps}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <div className="formGroup">
            <input
              className="formControl"
              placeholder="Rest (Mins)"
              type="number"
              name="rest"
              value={exerciseData.rest}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <button className="btn btn-success" type="submit">{editIndex !== null ? 'Update' : 'Create Exercise'}</button>
        </form>

        <ExerciseList exerciseList={exerciseList} onEdit={handleEdit} onDelete={handleDelete} />

      </div>
    </>
  )
}

export default Exercises
