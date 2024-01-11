import {useState} from 'react';
import './App.css';
import {formatDate} from './lib/utils';

function App() {
    // State
    const [msg, setMsg] = useState(null);
    const [runTrends, setRunTrends] = useState(null);

    // Methods
    const fetchFromDate = async date => {
        let isoDate = `${new Date(date).toISOString().split('.')[0]}Z`;

        try {
            /** Fetch runs at the selected Date */
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
                let run = (await fetchRuns.json()).results[0];
                if (run.complete) {
                    setMsg(null);

                    /** If a run is find and complete retrieve the outputs' run */
                    const fetchOutputs = await fetch(
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
                        /** An output is found, fetch for the trends */
                        let output = (await fetchOutputs.json()).results[0];
                        let fetchTrends = await fetch(
                            `https://test-backend.i.datapred.com/without-auth/flows/1/runs/${run.id}/outputs/${output.id}/trends`,
                            {
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                method: 'GET',
                            },
                        );
                        if (fetchTrends.ok) {
                            /** Trends are found and set to the state */
                            let trends = await fetchTrends.json();
                            setRunTrends(trends.results);
                        } else {
                            /** Trends are not found */
                            setMsg('No complete run for this date');
                        }
                    }
                } else {
                    /** A run is found but not complete */
                    setMsg('No complete run for this date');
                }
            } else {
                /** No run found  */
                setMsg('No run available for this date');
            }
        } catch (error) {
            console.log(error);
            setMsg('An error has occurred when loading data');
        }
    };
    return (
        <div className="App">
            <div className="App-header">
                <div className="form">
                    <label htmlFor="datepicker">Choose a date:</label>
                    <input id="datepicker" type="date" onChange={e => fetchFromDate(e.currentTarget.value)} />
                </div>
                {msg && <div>{msg}</div>}

                {runTrends && !msg && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Horizon Date</th>
                                    <th>Horizon Name</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {runTrends.map(trend => (
                                    <tr key={trend.id}>
                                        <td>{formatDate(trend.horizon_date)}</td>
                                        <td>{trend.horizon_name}</td>
                                        <td>{trend.trend}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
