import { FaPen, FaPlay, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function WorkoutList({ workoutList, onEdit, onDelete }) {
  workoutList.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <table className="table">
      {/* <thead>
        <tr>
          <th style={{textAlign: 'left'}}>Workout Name</th>
          <th style={{width: '7rem'}}></th>
        </tr>
      </thead> */}

      {workoutList.length > 0 ? (
        <tbody>
          {workoutList.map((workout, index) => (
            <tr key={index}>
              <td style={{textAlign: 'left'}}><b>{workout.name}</b></td>
              <td style={{width: '9rem'}}>
                <div className="btnGroup">
                  <Link to={'/workouts/' + workout.name + '/session'} className="btn btn-info">
                    <FaPlay className="btnIcon" />
                  </Link>
                  <Link to={'/workouts/' + workout.name} className="btn btn-success">
                    <FaPen className="btnIcon" />
                  </Link>
                  <button className="btn btn-danger" onClick={() => onDelete(index)}>
                    <FaTrash className="btnIcon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan="2">You haven't added any workouts yet.</td>
          </tr>
        </tbody>
      )}

    </table>
  );
}

export default WorkoutList;
