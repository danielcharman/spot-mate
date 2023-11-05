import { FaPen, FaTrash, FaAngleUp, FaAngleDown } from 'react-icons/fa'

function ExerciseList({ exerciseList, onEdit, onDelete, onReorder }) {
  // exerciseList.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <table className="table" style={{marginTop: '1rem'}}>
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
                {exercise.name}
                {/* <small>{exercise.sets} sets | {exercise.reps} reps | {exercise.rest}mins | {exercise.style} | {(exercise.weight !== 0) ? exercise.weight + 'kg' : 'BW'}</small> */}
              </td>
              <td style={{width: '8rem'}}>
                <div className="btnGroup">
                  {(index > 0) ?
                      (
                      <button className="btn">
                        <FaAngleUp className="btnIcon" onClick={() => onReorder(index, index-1)} />
                      </button>
                      )
                    : ''
                  }
                  {(index < exerciseList.length - 1) ?
                      (
                      <button className="btn">
                        <FaAngleDown className="btnIcon" onClick={() => onReorder(index, index+1)} />
                      </button>
                      )
                    : ''
                  }
                  <button className="btn btn-primary" onClick={() => onEdit(index)}>
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
