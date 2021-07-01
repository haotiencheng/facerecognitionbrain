import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className='f3 tc'>
                {'This Magic Brain will recognize celebrity face in your picture. Give it a try!'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-80 center br2' type='text' placeholder='Paste URL' onChange={onInputChange} />
                    <button
                        className='grow w-20 d f4 link ph3 pv2 dib black bg-washed-green br2'
                        onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    )

}

export default ImageLinkForm