import {useState} from 'react';
import './App.css';

function App() {
    // State
    const [msg, setMsg] = useState(null);

    // Methods
    const fetchFromDate = async date => {
        let isoDate = new Date(date).toISOString().replace('.000', '');

        try {
            const fetchRuns = await fetch(
                `https://test-backend.i.datapred.com/without-auth/flows/1/runs?production_date=${isoDate}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                },
            );
            if (fetchRuns.ok) {
                console.log('Run find');
                setMsg(null);
            } else {
                setMsg('No run available for this date');
            }
        } catch (error) {
            console.log({error});
        }
    };
    return (
        <div className="App">
            <div className="App-header">
                <div>Choose a date:</div>
                <input type="date" onChange={e => fetchFromDate(e.currentTarget.value)} />
                {msg && <div>{msg}</div>}
            </div>
        </div>
    );
}

export default App;
