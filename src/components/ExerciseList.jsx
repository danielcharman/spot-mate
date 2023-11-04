import { FaPen, FaTrash } from 'react-icons/fa'

function ExerciseList({ exerciseList, onEdit, onDelete }) {
  return (
    <table className="table">
      {/* <thead>
        <tr>
          <th style={{textAlign: 'left'}}>Exercise Name</th>
          <th style={{width: '7rem'}}></th>
        </tr>
      </thead> */}

      {exerciseList.length > 0 ? (
        <tbody>
          {exerciseList.map((exercise, index) => (
            <tr key={index}>
              <td style={{textAlign: 'left'}}>
                <b>{exercise.name}</b><br/>
                <small>{exercise.sets}/{exercise.reps}/{exercise.rest}/{exercise.style}/{exercise.weight}</small>
              </td>
              <td style={{width: '7rem'}}>
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
            <td colSpan="2">You haven't added any exercises yet.</td>
          </tr>
        </tbody>
      )}

    </table>
  );
}

export default ExerciseList;
