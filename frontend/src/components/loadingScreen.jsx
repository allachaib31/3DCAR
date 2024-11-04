import React from 'react'
import Loading from './loading'

function LoadingScreen({ loading, component }) {
    return (
        <>
            {
                loading ? <div className='w-full flex justify-center items-center'> <Loading />
                </div> : component
            }
        </>
    )
}

export default LoadingScreen