import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { FaPen } from 'react-icons/fa'

function Session() {
  let { workoutId } = useParams();

  const [exerciseList, setExerciseList] = useState([]);

  const [currentWorkoutExercises, setCurrentWorkoutExercises] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [audioElement] = useState(new Audio());

  useEffect(() => {
    // Retrieve exerciseList from local storage when the component mounts
    const storedExerciseList = JSON.parse(localStorage.getItem('workouts'));
    if (storedExerciseList) {
      const storedWorkout = findExercisesForWorkout(storedExerciseList, workoutId);
      setExerciseList(storedWorkout.exercises);
    }

  }, []); // The empty dependency array ensures this runs only once

  useEffect(() => {
    if (exerciseList) {
      createWorkoutPlan(exerciseList);
    }
  }, [exerciseList]); // The empty dependency array ensures this runs only once

  useEffect(() => {
    if(currentWorkoutExercises.length > 0) {
      // console.log(currentWorkoutExercises[currentWorkoutIndex].duration);
      setSeconds(currentWorkoutExercises[currentWorkoutIndex].duration + currentWorkoutExercises[currentWorkoutIndex].rest);
    }
  }, [ currentWorkoutExercises]); // The empty dependency array ensures this runs only once

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      if(seconds == currentWorkoutExercises[currentWorkoutIndex].rest) {
        playRestingSound();
      }else if(seconds > currentWorkoutExercises[currentWorkoutIndex].rest) {
        playLiftingSound();
      }

      if(seconds === 0) {
        setIsRunning(false);
        console.log('next');
        setCurrentWorkoutIndex(currentWorkoutIndex+1);
        setSeconds(currentWorkoutExercises[currentWorkoutIndex].duration + currentWorkoutExercises[currentWorkoutIndex].rest);
        playCompleteSound();
      }
    }
  }, [seconds]);

  // useEffect(() => {

  //   return () => {
  //     audioElement.removeEventListener('ended', handleAudioEnd);
  //   };
  // }, [audioElement]);

  const playLiftingSound = () => {
    audioElement.src = '/audio/lift.mp3';

    audioElement.addEventListener('canplay', () => {
      audioElement.play();
    });
  };

  const playRestingSound = () => {
    audioElement.src = '/audio/rest.mp3';

    audioElement.addEventListener('canplay', () => {
      audioElement.play();
    });
  };

  const playCompleteSound = () => {
    audioElement.src = '/audio/complete.mp3';

    audioElement.addEventListener('canplay', () => {
      audioElement.play();
    });
  };

  const handleToggleStart = () => {
    if (isRunning) {
      setIsRunning(false);
    }else{
      setIsRunning(true);
      playLiftingSound();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handlePreviousExercise = () => {
    setIsRunning(false);
    console.log('handleNextExercise');
    setCurrentWorkoutIndex(currentWorkoutIndex-1);
    setSeconds(currentWorkoutExercises[currentWorkoutIndex].duration + currentWorkoutExercises[currentWorkoutIndex].rest);
  };

  const handleNextExercise = () => {
    setIsRunning(false);
    console.log('handleNextExercise');
    setCurrentWorkoutIndex(currentWorkoutIndex+1);
    setSeconds(currentWorkoutExercises[currentWorkoutIndex].duration + currentWorkoutExercises[currentWorkoutIndex].rest);
  };

  const createWorkoutPlan = (exercises) => {
    const workout = [];
    for (const item of exercises) {
      for (let index = 0; index < item.sets-1; index++) {
        const currentWeight = calculateSetWeight(parseInt(index + 1), parseInt(item.sets), item.weight, item.style);
        const currentReps = calculateSetReps(parseInt(index + 1), parseInt(item.sets), parseInt(item.reps), item.style);
        const exercise = {
          name: item.name,
          set: index + 1 ,
          reps: currentReps,
          weight: (Math.floor(currentWeight) !== 0) ? currentWeight + 'kg' : 'BW',
          duration: 5, //Math.ceil(currentReps * 2.5),
          rest: 5, //Math.ceil(parseInt(item.rest) * 60)
        }
        workout.push(exercise);
      }
    }
    setCurrentWorkoutExercises(workout);
  }

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
              <div key={index} style={{width: '100%', marginTop: '1rem'}}>
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

  function displayCurrentExercise() {
    if(currentWorkoutExercises.length > 0) {
      const currentExercise = currentWorkoutExercises[currentWorkoutIndex];
      // console.log('steve', currentExercise);

      var statusClass = '';
      if(isRunning) {
        statusClass = (seconds <= currentWorkoutExercises[currentWorkoutIndex].rest) ? 'resting' : 'lifting'
      }

      var statusLabel = '';
      switch(statusClass) {
        case 'lifting':
          statusLabel = 'Lift';
        break;
        case 'resting':
          statusLabel = 'Now Rest';
        break;
        default:
          statusLabel = 'Waiting to Start';
      }

      return (
        <div className="session-wrapper">
          <div className={
            'session-counter ' + statusClass
          }>
            <div>
              <span>{seconds}</span>
              <span>{statusLabel}</span>
            </div>
          </div>
          <div className='session-exercise-name'>{currentExercise.name}</div>

          <div className='session-attributes'>
            <div className='session-attribute'>
              <span>Set</span>
              <span>{currentExercise.set}</span>
            </div>
            <div className='session-attribute'>
              <span>Reps</span>
              <span>{currentExercise.reps}</span>
            </div>
            <div className='session-attribute'>
              <span>Weight</span>
              <span>{currentExercise.weight}</span>
            </div>
            <div className='session-attribute'>
              <span>Lift</span>
              <span>{currentExercise.duration}s</span>
            </div>
            <div className='session-attribute'>
              <span>Rest</span>
              <span>{currentExercise.rest}s</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleToggleStart}>{(isRunning) ? 'Pause' : 'Start'}</button>

          <div className='session-controls'>
            {(currentWorkoutIndex > 0) && (
              <button className="btn" onClick={handlePreviousExercise}>Prev</button>
            )}

            {(currentWorkoutIndex < currentWorkoutExercises.length - 1) && (
              <button className="btn" onClick={handleNextExercise}>Next</button>
            )}
          </div>

        </div>
      );
    }
  }

  return (
    <>
      <h1 className="pageTitle">{workoutId}</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Link to={'/workouts/' + workoutId} className="btn btn-small" style={{margin: '0 0 2rem'}}>
          <FaPen className="btnIcon" /> Edit Workout
        </Link>

        {displayCurrentExercise()}

        <hr/>

        <h2 style={{margin: '0'}}>Full Workout</h2>
        {displayWorkout(exerciseList)}
      </div>
    </>
  )
}

export default Session
