import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, box, starName, prob }) => {
    const Text = 'This people in the picture is\n'
    if (imageUrl !== '') {
        return (
            <div>
                <div className='fl w-50 mt4 center'>
                    <div className='absolute center mt2'>
                        <img alt='' id='inputimage' src={imageUrl} width='500px' height='auto' />
                        <div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>
                    </div>
                </div>
                <div className='fl w-50 mt5 tc'>
                    <div className='f3'>{Text}</div>
                    <div className='f2 mt4 b'>{starName}</div>
                    <div className='f3 mt4'>with a prob. of</div>
                    <div className='f2 mt4 i'>{prob}</div>
                </div>
            </div>
        )
    } else {
        return <div></div>
    }
}

export default FaceRecognition