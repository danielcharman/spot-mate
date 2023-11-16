import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { FaPen } from 'react-icons/fa'
import {toast} from 'react-toastify'

function Session() {
  let { workoutId } = useParams();

  // const [audioFiles, setaudioFiles] = useState({
  //   start: '/audio/start.mp3',
  //   timer: '/audio/lift.mp3',
  //   rest: '/audio/rest.mp3',
  //   complete: '/audio/complete.mp3',
  // });

  const [exerciseList, setExerciseList] = useState([]);

  const [currentWorkoutExercises, setCurrentWorkoutExercises] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // const [audioElement] = useState(new Audio());

  useEffect(() => {
    // Add the 'touchstart' event listener
    // window.addEventListener('touchstart', forceSafariPlayAudio, false);

    const storedExerciseList = JSON.parse(localStorage.getItem('workouts'));
    if (storedExerciseList) {
      const storedWorkout = findExercisesForWorkout(storedExerciseList, workoutId);
      setExerciseList(storedWorkout.exercises);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      // window.removeEventListener('touchstart', forceSafariPlayAudio, false);
    };
  }, []);

  // function forceSafariPlayAudio() {
  //   //hacky way of auto playing audio
  //   setTimeout(function() {
  //     for (const [key, value] of Object.entries(audioFiles)) {
  //       audioElement.src = value;
  //       audioElement.play()
  //       audioElement.pause()
  //       audioElement.currentTime = 0
  //     }
  //   }, 500)

  //   window.removeEventListener('touchstart', forceSafariPlayAudio, false);
  // }

  useEffect(() => {
    if (exerciseList) {
      createWorkoutPlan(exerciseList);
    }
  }, [exerciseList]);

  useEffect(() => {
    if(currentWorkoutExercises.length > 0) {
      setSeconds(currentWorkoutExercises[currentWorkoutIndex].rest);
    }
  }, [ currentWorkoutExercises]);

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
      // playSound('timer');

      if(seconds === 0) {
        setIsRunning(false);
        setCurrentWorkoutIndex(currentWorkoutIndex+1);
        setSeconds(currentWorkoutExercises[currentWorkoutIndex].rest);
        // playSound('complete');
        toast('Rest complete. Get lifting!', { theme: 'dark', autoClose: 3000 });

        handleNextExercise()
      }
    }
  }, [seconds]);

  // const playSound = (name) => {
  //   audioElement.src = audioFiles[name];
  //   audioElement.load();
  //   audioElement.play();
  // };

  const handleToggleStart = () => {
    if (!isRunning) {
    //   handlePause()
    //   toast('Workout paused...', { theme: 'dark', autoClose: 1000 });
    // }else{
      setIsStarting(true);
      setIsStarting(false);
      handleStart()
      toast('Starting rest. Get ready for the next set!', { theme: 'dark', autoClose: 1000 });
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    // playSound('rest');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handlePreviousExercise = () => {
    setIsRunning(false);
    setCurrentWorkoutIndex(currentWorkoutIndex-1);
    setSeconds(currentWorkoutExercises[currentWorkoutIndex].rest);
  };

  const handleNextExercise = () => {
    setIsRunning(false);
    setCurrentWorkoutIndex(currentWorkoutIndex+1);
    setSeconds(currentWorkoutExercises[currentWorkoutIndex].rest);
  };

  const createWorkoutPlan = (exercises) => {
    const workout = [];
    for (const item of exercises) {
      for (let index = 0; index < item.sets; index++) {
        const currentWeight = calculateSetWeight(parseInt(index + 1), parseInt(item.sets), item.weight, item.style);
        const currentReps = calculateSetReps(parseInt(index + 1), parseInt(item.sets), parseInt(item.reps), item.style);
        const exercise = {
          name: item.name,
          set: index + 1 ,
          reps: currentReps,
          weight: (Math.floor(currentWeight) !== 0) ? currentWeight + 'kg' : 'BW',
          rest: Math.ceil(parseInt(item.rest) * 60)
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
    var currentItem = '';
    return (
      <>
        {exerciseList.length > 0 ? (
          <>
            <div className="div-table">
              {exerciseList.map((exercise, index) => {
                if(currentItem !== exercise.name) {
                  currentItem = exercise.name;
                  return (
                    <div key={index} >
                      <div className="div-table-row">
                        <div className="div-table-thead">{exercise.name}</div>
                      </div>
                      <div className="div-table-row">
                        <div className="div-table-th">Set</div>
                        <div className="div-table-th">Reps</div>
                        <div className="div-table-th">Weight</div>
                        <div className="div-table-th">Rest</div>
                      </div>
                      <div className="div-table-row">
                        <div className="div-table-td">{exercise.set}</div>
                        <div className="div-table-td">{exercise.reps}</div>
                        <div className="div-table-td">{exercise.weight}</div>
                        <div className="div-table-td">{exercise.rest}s</div>
                      </div>
                    </div>
                  )
                }else{
                  return (
                    <div key={index} className="div-table-row">
                      <div className="div-table-td">{exercise.set}</div>
                      <div className="div-table-td">{exercise.reps}</div>
                      <div className="div-table-td">{exercise.weight}</div>
                      <div className="div-table-td">{exercise.rest}s</div>
                    </div>
                  )
                }
              })}
            </div>
          </>
        ) : (
          <>You haven't added any exercises yet.</>
        )}

      </>
    );
  }

  function displayControls() {
    if(currentWorkoutExercises.length > 0) {
      var statusClass = '';
      if(isRunning) {
        statusClass =  'resting'
      }

      var statusLabel = '';
      switch(statusClass) {
        case 'resting':
          statusLabel = 'Now Rest';
        break;
        default:
          statusLabel = 'Start Rest';
      }

      return (
        <>
          <div onClick={handleToggleStart} className={
            'session-counter ' + statusClass
          }>
            <div>
              <span>{seconds}</span>
              <span>{statusLabel}</span>
            </div>
          </div>
          {/* <div className='session-controls'>
          <button className={'btn ' + ((isRunning) ? 'btn-danger' : 'btn-success') + ((isStarting) ? ' btn-disabled' : '')} onClick={handleToggleStart} disabled={(isStarting) ? true : false}>{(isRunning) ? 'Pause' : 'Start'} Rest</button>
          </div> */}
          <div className='session-controls'>
            {(currentWorkoutIndex > 0) && (
              <button className={'btn ' + ((isStarting) ? ' btn-disabled' : '')} onClick={handlePreviousExercise} disabled={(isStarting) ? true : false}>Prev</button>
            )}
            {(currentWorkoutIndex < currentWorkoutExercises.length - 1) && (
              <button className={'btn ' + ((isStarting) ? ' btn-disabled' : '')} onClick={handleNextExercise} disabled={(isStarting) ? true : false}>Next</button>
            )}
          </div>
        </>
      );
    }
  }

  function displayExercise(index, current) {
    if(currentWorkoutExercises.length > 0) {
      const currentExercise = currentWorkoutExercises[index];
      return (
        <div className={'session-wrapper ' + ((current) ? 'current' : '')}>
          <div className='session-exercise-name'>
            <span>{(current) ? 'Current' : 'Next'} Exercise</span>
            <span>{currentExercise.name}</span>
          </div>
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
              <span>Rest</span>
              <span>{currentExercise.rest}s</span>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <h1 className="pageTitle" style={{marginBottom: 0, display: 'flex', justifyContent: 'center'}}>
        {workoutId}
        <Link to={'/workouts/' + workoutId} className="btn btn-small" style={{marginLeft: '1rem'}}>
          <FaPen className="btnIcon" />
        </Link>
      </h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {displayExercise(currentWorkoutIndex, true)}
        {displayControls()}
        {displayExercise(currentWorkoutIndex+1, false)}
        <hr/>
        <h2 style={{margin: '0'}}>Full Workout</h2>
        {displayWorkout(currentWorkoutExercises)}
      </div>
    </>
  )
}

export default Session
