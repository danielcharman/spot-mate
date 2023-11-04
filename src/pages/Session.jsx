import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Session() {
  let { workoutId } = useParams();

  const [exerciseList, setExerciseList] = useState([]);

  useEffect(() => {
    // Retrieve exerciseList from local storage when the component mounts
    const storedExerciseList = JSON.parse(localStorage.getItem('workouts'));
    if (storedExerciseList) {
      const storedWorkout = findExercisesForWorkout(storedExerciseList, workoutId);
      setExerciseList(storedWorkout.exercises);
    }
  }, []); // The empty dependency array ensures this runs only once

  const findExercisesForWorkout = (array, targetName) => {
    for (const [index, value] of array.entries()) {
      if(value.name === targetName) {
        if(!value.exercises) value.exercises = [];
        return value;
      }
    }
  }

  const calculateSetWeight = (currentSet, totalSets, weight, style) => {
    switch(style) {
      case 'peak':
        var currentPercentage = 0;
        if(currentSet === 1 || currentSet === totalSets) {
          currentPercentage = 50;
        }else if(currentSet === 2 || currentSet === totalSets - 1) {
          currentPercentage = 25;
        }

        var calculatedWeight = weight - ((weight * currentPercentage) / 100);
        return calculatedWeight.toFixed(1);
      break;
      case 'progressive':
        currentPercentage = (currentSet / totalSets) * 100;
        calculatedWeight = ((weight * currentPercentage) / 100);

        return calculatedWeight.toFixed(1);
      break;
      default:
        return (weight * 1).toFixed(1)
    }
  }

  const calculateSetReps = (currentSet, totalSets, reps, style) => {
    switch(style) {
      case 'peak':
        if(currentSet === 1 || currentSet === totalSets) {
          return reps + 7;
        }else if(currentSet === 2 || currentSet === totalSets - 1) {
          return reps + 2;
        }else{
          return reps;
        }
      break;
      case 'progressive':
      default:
        return reps
    }
  }

  function displayWorkout( exerciseList ) {
    return (
      <>

        {exerciseList.length > 0 ? (
          <>
            {exerciseList.map((exercise, index) => (
              <div key={index} style={{width: '100%', marginBottom: '1rem'}}>
                <h3 style={{marginBottom: '0.5rem'}}>
                  {exercise.name}
                  <small>
                    {exercise.rest}min rest | {exercise.style.replace(/\b\w/g, char => char.toUpperCase())} | Max {exercise.weight}kg
                    </small>
                </h3>
                <div className="table-responsive">
                  <table className="table" style={{textAlign: 'center', fontSize: '0.75rem'}}>
                    <thead>
                      <tr>
                        <th>Set</th>
                        {Array.from({ length: exercise.sets }, (value, index) => (
                          <th key={index}>Set {index + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Weight</th>
                        {Array.from({ length: exercise.sets }, (value, index) => {
                          const currentWeight = calculateSetWeight(parseInt(index + 1), parseInt(exercise.sets), exercise.weight, exercise.style);
                          return (
                            <td key={index}>
                              {(Math.floor(currentWeight) !== 0) ? currentWeight + 'kg' : 'BW'}
                            </td>
                          )
                        })}
                      </tr>
                      <tr>
                        <th>Reps</th>
                        {Array.from({ length: exercise.sets }, (value, index) => {
                          const currentReps = calculateSetReps(parseInt(index + 1), parseInt(exercise.sets), parseInt(exercise.reps), exercise.style);
                          return (
                            <td key={index}>
                              {currentReps}
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>You haven't added any exercises yet.</>
        )}

      </>
    );
  }

  return (
    <>
      <h1 className="pageTitle">{workoutId}</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {displayWorkout(exerciseList)}
      </div>
    </>
  )
}

export default Session
