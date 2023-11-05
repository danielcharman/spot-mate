import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList'
import { Link } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'

function Workout() {
  let { workoutId } = useParams();

  const [exerciseData, setExerciseData] = useState({
    name: '',
    sets: '6',
    reps: '8',
    rest: '2',
    style: 'standard',
    weight: '0',
  });

  const [exerciseList, setExerciseList] = useState([]);



  const getExerciseList = () => {
    // Retrieve exerciseList from local storage when the component mounts
    const storedExerciseList = JSON.parse(localStorage.getItem('workouts'));
    if (storedExerciseList) {
      const storedWorkout = findExercisesForWorkout(storedExerciseList, workoutId);
      if(storedWorkout && storedWorkout.exercises) {
        setExerciseList(storedWorkout.exercises);
      }
    }
  }

  useEffect(() => {
    getExerciseList()
  }, []); // The empty dependency array ensures this runs only once

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (editIndex !== null) {
      const exerciseToEdit = exerciseList[editIndex];
      setExerciseData({ ...exerciseToEdit });
    }
  }, [editIndex, exerciseList]);

  const findExercisesForWorkout = (array, targetName) => {
    for (const [index, value] of array.entries()) {
      if(value.name.trim() === targetName.trim()) {
        if(!value.exercises) value.exercises = [];
        return value;
      }
    }
  }

  const findAllWorkoutsExcept = (array, targetName) => {
    return array.filter(item => item.name !== targetName);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseData({
      ...exerciseData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var updatedList;

    if (editIndex !== null) {
      // Edit existing exercise
      updatedList = [...exerciseList];
      updatedList[editIndex] = exerciseData;
      setExerciseList(updatedList);
    } else {
      // Add new exercise
      updatedList = [...exerciseList, exerciseData];
      setExerciseList(updatedList);
    }

    storeWorkoutExerciseData(updatedList);

    setExerciseData({
      name: '',
      sets: '6',
      reps: '8',
      rest: '2',
      style: 'standard',
      weight: '0',
    });
    setEditIndex(null);
  };

  const storeWorkoutExerciseData = (exercises) => {
    const storedExerciseList = JSON.parse(localStorage.getItem('workouts'));
    if (storedExerciseList) {
      var workouts = findAllWorkoutsExcept(storedExerciseList, workoutId);
      var storedWorkout = findExercisesForWorkout(storedExerciseList, workoutId);
      storedWorkout.exercises = exercises;

      const updatedWorkouts = [...workouts, storedWorkout]
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = exerciseList.filter((_, i) => i !== index);
    setExerciseList(updatedList);
    storeWorkoutExerciseData(updatedList);
  };

  const handleReorder = (index, newIndex) => {
    const updatedList = switchArrayItemsByIndex(exerciseList, index, newIndex)
    setExerciseList(updatedList);
    storeWorkoutExerciseData(updatedList);getExerciseList()
  };

  const switchArrayItemsByIndex = (array, index1, index2) => {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
    return array;
  }

  return (
    <>
      <h1 className="pageTitle">{workoutId}</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Link to={'/workouts/' + workoutId + '/session'} className="btn btn-small" style={{margin: '0 0 2rem'}}>
          <FaPlay className="btnIcon" /> Start Workout
        </Link>
        <form className="form" onSubmit={handleSubmit}>
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
          <div className="formGroup" style={{flexBasis: '31%'}}>
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
          <div className="formGroup" style={{flexBasis: '31%'}}>
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
          <div className="formGroup" style={{flexBasis: '32%'}}>
            <input
              className="formControl"
              placeholder="Rest"
              type="number"
              name="rest"
              value={exerciseData.rest}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <div className="formGroup" style={{flexBasis: '48%'}}>
            <select
              className="formControl"
              placeholder="Style"
              size="1"
              name="style"
              value={exerciseData.style}
              onChange={handleInputChange}
              required={true}
            >
              <option value="standard">Standard</option>
              <option value="peak">Peak</option>
              <option value="progressive">Progressive</option>
            </select>
          </div>
          <div className="formGroup" style={{flexBasis: '48%'}}>
            <input
              className="formControl"
              placeholder="Weight"
              type="number"
              name="weight"
              value={exerciseData.weight}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{flexBasis: '100%'}}>
            {editIndex !== null ? 'Update' : 'Create'}  Exercise
          </button>
        </form>

        <ExerciseList exerciseList={exerciseList} onEdit={handleEdit} onDelete={handleDelete} onReorder={handleReorder} />

      </div>
    </>
  )
}

export default Workout
