import {useState} from 'react';
import './App.css';

function App() {
    // State
    const [msg, setMsg] = useState(null);

    // Methods
    const fetchFromDate = async date => {
        let jsDate = new Date(date).toISOString().replace('.000', '');

        try {
            const fetchRuns = await fetch(
                `https://test-backend.i.datapred.com/without-auth/flows/1/runs?production_date=${jsDate}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                },
            );

            if (fetchRuns.ok) {
                let runs = await fetchRuns.json();

                let run = runs.results[0];
                if (run.complete) {
                    setMsg(null);

                    let fetchOutputs = await fetch(
                        `https://test-backend.i.datapred.com/without-auth/flows/1/runs/${run.id}/outputs`,
                        {
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            method: 'GET',
                        },
                    );
                    if (fetchOutputs.ok) {
                        let outputs = await fetchOutputs.json();
                        let output = outputs.results[0];
                        console.log({outputs});
                        let fetchTrents = await fetch(
                            `https://test-backend.i.datapred.com/without-auth/flows/1/runs/${run.id}/outputs/${output.id}/trends`,
                            {
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                method: 'GET',
                            },
                        );
                        if (fetchTrents.ok) {
                            let trents = await fetchTrents.json();
                            console.log({trents});
                        }
                    }
                } else {
                    setMsg('No complete run for this date');
                }
            } else {
                setMsg('No run available for this date');
            }
        } catch (error) {
            console.log(error);
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
