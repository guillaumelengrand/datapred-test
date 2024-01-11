import {useState} from 'react';
import './App.css';
import {formatDate} from './lib/utils';

function App() {
    // State
    const [msg, setMsg] = useState(null);
    const [runTrends, setRunTrends] = useState(null);

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
                            let trends = await fetchTrends.json();
                            console.log({trends});
                            setRunTrends(trends.results);
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
                                    <tr>
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
