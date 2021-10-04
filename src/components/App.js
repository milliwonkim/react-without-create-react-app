import React, { Suspense, lazy, useState } from 'react';
import * as _ from 'lodash';
import One from './One';

function App() {
    const examA = _.add('a');
    const [comp, setComp] = useState(false);
    console.log(examA);
    const TwoComponent = comp && lazy(() => import('./Two'));

    const handleClick = () => {
        setComp(!comp);
    };

    return (
        <Suspense fallback={<p>loading...</p>}>
            <div style={{ backgroundColor: 'red' }}>
                <h1>No CRA React Project!!</h1>
                <div style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleClick}>
                    Click For Two Component
                </div>
                <One />
                {comp && <TwoComponent />}
            </div>
        </Suspense>
    );
}

export default App;
