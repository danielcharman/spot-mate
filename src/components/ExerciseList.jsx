import { FaPen, FaTrash } from 'react-icons/fa'

function ExerciseList({ exerciseList, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th style={{textAlign: 'left'}}>Exercise Name</th>
          <th style={{width: '8rem'}}>Sets</th>
          <th style={{width: '8rem'}}>Reps</th>
          <th style={{width: '8rem'}}>Rest (Mins)</th>
          <th style={{width: '11rem'}}></th>
        </tr>
      </thead>

      {exerciseList.length > 0 ? (
        <tbody>
          {exerciseList.map((exercise, index) => (
            <tr key={index}>
              <td style={{textAlign: 'left'}}>{exercise.name}</td>
              <td>{exercise.sets}</td>
              <td>{exercise.reps}</td>
              <td>{exercise.rest}</td>
              <td>
                <div className="btnGroup">
                  <button className="btn btn-success" onClick={() => onEdit(index)}>
                    <FaPen className="btnIcon" />
                  </button>
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
            <td colSpan="5">You haven't added any exercises yet.</td>
          </tr>
        </tbody>
      )}

    </table>
  );
}

export default ExerciseList;
