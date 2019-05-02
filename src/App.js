import React from 'react'
import Chart from './Chart'
import styles from './styles/styles.css'
function App() {
    return (
        <div className='app-container'>
            <h1 className = 'title'>200 Countries Over 200 Years</h1>
            <h3 className = 'sub title'>Average life expectancy and country wealth over time</h3>
            <Chart />
            <section className='description'>
                <p>This chart is a simple but powerful representation of two centuries of data spanning 200 countries.  The overall objective is to show correlation of life expectancy and country wealth over time, however it reveals much more about history, human struggle, and societal progress.</p>

                <p>Each circle represents a country, and is colored based on its continent grouping.  The circle area represents population size of the specific country.  GDP is plotted on a logarithmic scale on the x axis, and life expectancy is plotted linearly on the y axis.</p>
                <p>The original idea for this chart is based on Hans Rosling's work and lecture <a href="https://www.youtube.com/watch?v=jbkSRLYSojo&t=2s">200 Countries, 200 Years, 4 Minutes</a></p>
            </section>

            
        </div>
    )
}

export default App
