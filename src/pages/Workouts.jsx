import { useState, useEffect } from 'react';
import WorkoutList from '../components/WorkoutList'

function Workouts() {
  //define form data
  const [workoutData, setWorkoutData] = useState({
    name: '',
    exercises: [],
  });

  //define list data
  const [workoutList, setWorkoutList] = useState([]);

  useEffect(() => {
    // Retrieve workoutList from local storage when the component mounts
    const storedWorkoutList = JSON.parse(localStorage.getItem('workouts'));
    if (storedWorkoutList) {
      setWorkoutList(storedWorkoutList);
    }
  }, []); // The empty dependency array ensures this runs only once

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    //is edit - prefill form content
    if (editIndex !== null) {
      const workoutToEdit = workoutList[editIndex];
      setWorkoutData({ ...workoutToEdit });
    }
  }, [editIndex, workoutList]);

  const handleInputChange = (e) => {
    //update state with form values
    const { name, value } = e.target;
    setWorkoutData({
      ...workoutData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var updatedList;

    //is edit mode?
    if (editIndex !== null) {
      // Edit existing workout
      updatedList = [...workoutList];
      updatedList[editIndex] = workoutData;
      setWorkoutList(updatedList);
    } else {
      // Add new workout
      updatedList = [...workoutList, workoutData];
      setWorkoutList(updatedList);
    }

    localStorage.setItem('workouts', JSON.stringify(updatedList));

    //clear current form
    setWorkoutData({
      name: '',
      exercises: [],
    });

    //leave edit mode
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = workoutList.filter((_, i) => i !== index);
    setWorkoutList(updatedList);
    localStorage.setItem('workouts', JSON.stringify(updatedList));
  };

  return (
    <>
      <h1 className="pageTitle">Workouts</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

        <form className="form" onSubmit={handleSubmit} style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
          <div className="formGroup">
            <input
              className="formControl"
              placeholder="Workout Name"
              type="text"
              name="name"
              value={workoutData.name}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{flexBasis: '100%'}}>
            Create Workout
          </button>
        </form>

        <WorkoutList workoutList={workoutList} onEdit={handleEdit} onDelete={handleDelete} />

      </div>
    </>
  )
}

export default Workouts
