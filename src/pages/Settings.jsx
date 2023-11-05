import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
// import { usePapaParse } from 'react-papaparse';
import {toast} from 'react-toastify'

function Settings() {
  // const { jsonToCSV } = usePapaParse();

  const fileInputRef = useRef(null);
  const exportJsonRef = useRef(null);

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

  const flattenData = (data) => {
    const flatData = [];

    function processItem(item, path = '') {
      for (const key in item) {
        const newPath = path + (path ? '.' : '') + key;

        if (typeof item[key] === 'object' && item[key] !== null) {
          // Recurse into nested objects and arrays
          processItem(item[key], newPath);
        } else {
          // Add primitive values to the flat data
          flatData.push({
            path: newPath,
            value: item[key],
          });
        }
      }
    }

    data.forEach((item, index) => {
      processItem(item, String(index));
    });

    return flatData;
  }

  const unflattenData = (csvData) => {
    var jsonData = [];

    for (const row of csvData) {
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const splitKeys = key.split('.');

          if(splitKeys.length === 4) {
            if(typeof jsonData[splitKeys[0]] === 'undefined') {
              jsonData[splitKeys[0]] = {};
            }

            if(typeof jsonData[splitKeys[0]][splitKeys[1]] === 'undefined') {
              jsonData[splitKeys[0]][splitKeys[1]] = [];
            }

            if(typeof jsonData[splitKeys[0]][splitKeys[1]][splitKeys[2]] === 'undefined') {
              jsonData[splitKeys[0]][splitKeys[1]][splitKeys[2]] = {};
            }

            jsonData[splitKeys[0]][splitKeys[1]][splitKeys[2]][splitKeys[3]] = row[key];
          }else{
            if(typeof jsonData[splitKeys[0]] === 'undefined') {
              jsonData[splitKeys[0]] = {};
            }

            jsonData[splitKeys[0]][splitKeys[1]] = row[key];
          }
        }
      }
    }
    return jsonData
  }

  // Function to copy the textarea content to the clipboard
  const copyToClipboard = () => {
    if (exportJsonRef.current) {
      // Select the text in the textarea
      exportJsonRef.current.select();
      // Copy the selected text to the clipboard
      document.execCommand('copy');
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

    toast('Imported JSON successfully!', { theme: 'dark' });
  };

  const handleExportCSV = (e) => {
    e.preventDefault();

    const jsonData = exportData;
    const flatData = flattenData(jsonData);

    // Collect all unique paths to use as CSV headers
    const headers = [...new Set(flatData.map((item) => item.path))];

    // Create an array of arrays representing the CSV data
    const csvData = [headers];

    const rowData = headers.map((header) => {
      const value = flatData.find((data) => data.path === header && data.value !== undefined);
      return value ? value.value : '';
    });

    csvData.push(rowData);

    const csvResult = Papa.unparse(csvData);

      //build download
    const blob = new Blob([csvResult], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    toast('Exported CSV successfully!', { theme: 'dark' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true, // Assuming the first row contains headers
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        localStorage.setItem('workouts', JSON.stringify(unflattenData(result.data), null, 2));
        setImportData('');
        getExportData();

        toast('Imported CSV successfully!', { theme: 'dark' });

        fileInputRef.current.value = '';
      },
      error: function(err, file, inputElem, reason)
      {
        toast.error('Imported failed!', { theme: 'dark' });
      },
      header: true, // If the first row is a header row
    });

  };

  const handleDefaultImport = (e) => {
    e.preventDefault();

    fetch('/sample/export.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('workouts', JSON.stringify(data, null, 2));
      setImportData('');
      getExportData();

      toast('Imported defaults successfully!', { theme: 'dark' });
    })
    .catch(error => {
      this.setState({ error });
    });
  };

  return (
    <>
      <h1 className="pageTitle">Settings</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <form className="form" onSubmit={handleSubmit} style={{flexDirection: 'column'}}>

          <h3 style={{margin: 0}}>Export JSON</h3>
          <p>Copy and store your program in a safe place.</p>
          <div className="formGroup">
            <textarea
              className="formControl"
              name="export"
              ref={exportJsonRef}
              value={JSON.stringify(exportData)}
              required={true}
              // readOnly={true}
              style={{height: '15vh', fontFamily: 'monospace'}}
            ></textarea>
          </div>
          <button className="btn btn-primary" type="button" onClick={copyToClipboard} style={{flexBasis: '100%'}}>
            Copy to Clipboard
          </button>

          <hr/>

          <h3 style={{margin: '0'}}>Export CSV</h3>
          <p>Download a CSV of your current workout.</p>
          <button className="btn btn-primary" type="button" onClick={handleExportCSV} style={{flexBasis: '100%'}}>
            Export CSV
          </button>

          <hr/>

          <h3 style={{margin: '0'}}>Import JSON</h3>
          <p>Paste in suitably formated JSON to import.</p>
          <div className="formGroup">
            <textarea
              className="formControl"
              placeholder="Paste JSON"
              name="import"
              value={importData.import}
              onChange={handleInputChange}
              required={true}
              style={{height: '15vh', fontFamily: 'monospace'}}
            ></textarea>
          </div>

          <button className="btn btn-danger" type="submit" style={{flexBasis: '100%'}}>
            Import Json
          </button>

          <hr/>

          <h3 style={{margin: '0'}}>Import CSV</h3>
          <p>Select a suitably formated CSV file to import.</p>
          <div className="formGroup">
            <input
              name="import-csv"
              className="formControl"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          <hr/>

          <h3 style={{margin: '0'}}>Load Sample Workout</h3>
          <p>Don't know how to get started? Load the default program and adjust it to suit your needs.</p>
          <a onClick={handleDefaultImport} className="btn btn-danger" style={{flexBasis: '100%'}}>
            Load Sample Workouts
          </a>
        </form>
      </div>
    </>
  )
}

export default Settings
