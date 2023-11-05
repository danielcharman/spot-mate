import { FaPen, FaPlay, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function WorkoutList({ workoutList, onEdit, onDelete }) {
  workoutList.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      {workoutList.length > 0 ? (
        <table className="table">
        <tbody>
          {workoutList.map((workout, index) => (
            <tr key={index}>
              <td style={{textAlign: 'left'}}><b>{workout.name}</b></td>
              <td style={{width: '6rem'}}>
                <div className="btnGroup">
                  <Link to={'/workouts/' + workout.name + '/session'} className="btn btn-success">
                    <FaPlay className="btnIcon" /> Start
                  </Link>
                  <Link to={'/workouts/' + workout.name} className="btn btn-primary">
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
        </table>
      ) : (
        <Link to={'/settings'} className="btn btn-primary" style={{width: '100%'}}>
          Load Sample Program
        </Link>
      )}
    </>
  );
}

export default WorkoutList;
