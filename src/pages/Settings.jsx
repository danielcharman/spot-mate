import { useState, useEffect } from 'react';

function Settings() {

  const [importData, setImportData] = useState('');
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    getExportData();
  }, []); // The empty dependency array ensures this runs only once

  const getExportData = (e) => {
    // Retrieve exerciseList from local storage when the component mounts
    const storedWorkouts = JSON.parse(localStorage.getItem('workouts'));
    if (storedWorkouts) {
      setExportData(storedWorkouts);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setImportData(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('workouts', importData);
    setImportData('');
    getExportData();
  };

  return (
    <>
      <h1 className="pageTitle">Settings</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <form className="form" onSubmit={handleSubmit}>
          <h3 style={{margin: 0}}>Export</h3>
          <div className="formGroup">
            <textarea
              className="formControl"
              name="export"
              value={JSON.stringify(exportData)}
              required={true}
              readOnly={true}
              style={{height: '25vh', fontFamily: 'monospace'}}
            ></textarea>
          </div>
          <h3 style={{margin: 0}}>Import</h3>
          <div className="formGroup">
            <textarea
              className="formControl"
              placeholder="Paste JSON"
              name="import"
              value={importData.import}
              onChange={handleInputChange}
              required={true}
              style={{height: '25vh', fontFamily: 'monospace'}}
            ></textarea>
          </div>
          <button className="btn btn-success" type="submit" style={{flexBasis: '100%'}}>
            Import
          </button>
          <a href="/sample/export.json" target="_blank" className="btn" style={{flexBasis: '100%'}}>
            View Default
          </a>
        </form>
      </div>
    </>
  )
}

export default Settings
