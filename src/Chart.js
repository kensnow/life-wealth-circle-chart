import React, { Component } from 'react'
import * as d3 from 'd3'
import data from './data/data.json'
import { rejects } from 'assert';

export default class Chart extends Component {
    constructor(){
        super()
        this.state = {
            data:[],
            margin: {
                top:40,
                bottom: 100,
                left: 80,
                right: 70
            },
            width:800,
            height: 500,
            countryColors:['#aa381e','#fd6a02','#b2df8a','#146eb4']
        }
    }

    componentDidMount = () => {
        this.setState({
            data:data,
            width: 800 - this.state.margin.left - this.state.margin.right,
            height: 600 - this.state.margin.top - this.state.margin.bottom
        },() => this.createChart(this.state.data))
        
    }

    createChart = (data) => {
        //set up chart env variables
        const node = this.node
        const width = this.state.width
        const height = this.state.height
        const margin = this.state.margin
        let yearIndex = 0
  

        const currentData = (index) => 

            data[index].countries.filter(el => {
                return el.income && el.life_exp && el.population && el
            })//test line of code
        //set up canvas & group elements
        const canvas = d3.select(node)
        
        const g = canvas.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.right})`)

        const tg = canvas.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.right})`)
        //set up x and y scales with domain and range
        const x = d3.scaleLog()
            .domain([d3.min(data, d => d3.min(d.countries, d2 => d2.income)), d3.max(data, d => d3.max(d.countries, d2 => d2.income))])
            .range([0, width])
            .base(2)

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0])

        const circleRadius = d3.scalePow().exponent(.5)
            .domain([0, d3.max(data, d => d3.max(d.countries, d2 => d2.population))])
            .range([2, 45])

        const continentColor = d3.scaleOrdinal()
            .domain(['asia', 'africa', 'europe', 'americas'])
            .range(this.state.countryColors)

        //set up axes
        const xAxisCall = d3.axisBottom(x)
            .tickValues([400,4000,40000])
            .tickFormat(d3.format('$'))

        const yAxisCall = d3.axisLeft(y)
            .ticks(10)

        const xAxisGroup = g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxisCall)
            .selectAll('text')
                .attr('y', '10')
                .attr('x', '-5')
                .attr('font-size', '14px')
                .attr('text-anchor', 'middle')

        const yAxisGroup = g.append('g')
            .attr('class', 'y-axis')
            .call(yAxisCall)
            .selectAll('text')
                .attr('font-size', '14px')

        //axis labels
        //x label
        g.append('text')
            .attr('class', 'x-axis label')
            .attr('x', width/2)
            .attr('y', height + 50)
            .attr('font-size', '30px')
            .attr('text-anchor', 'middle')
            .text('GDP Per Capita ($)')
        
        //y label
        g.append('text')
            .attr('class', 'y-axis label')
            .attr('x', - (height / 2))
            .attr('y', -45)
            .attr('font-size', '30px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Life Expectancy (Years)')

        //time label setup
        let timeLabel = g.append("text")
            .attr("y", height -10)
            .attr("x", width - 40)
            .attr("font-size", "40px")
            .attr("opacity", "0.4")
            .attr("text-anchor", "middle")
            .text("1800");

        //legend
        tg.append("text")
            .attr("y", 10)
            .attr("x", width - 40)
            .attr("font-size", "20px")
            .attr("opacity", "0.4")
            .text("Asia");
        tg.append("text")
            .attr("y", 30)
            .attr("x", width - 40)
            .attr("font-size", "20px")
            .attr("opacity", "0.4")
            .text("Africa");
        tg.append("text")
            .attr("y", 50)
            .attr("x", width - 40)
            .attr("font-size", "20px")
            .attr("opacity", "0.4")
            .text("Europe");
        tg.append("text")
            .attr("y", 70)
            .attr("x", width - 40)
            .attr("font-size", "20px")
            .attr("opacity", "0.4")
            .text("Americas");

        //legend circles
        tg.append("circle")
            .attr("cy", 4)
            .attr("cx", width - 50)
            .attr('r', 8)
            .attr("fill", this.state.countryColors[0]);
        tg.append("circle")
            .attr("cy", 24)
            .attr("cx", width - 50)
            .attr('r', 8)
            .attr("fill", this.state.countryColors[1]);
        tg.append("circle")
            .attr("cy", 44)
            .attr("cx", width - 50)
            .attr('r', 8)
            .attr("fill", this.state.countryColors[2]);
        tg.append("circle")
            .attr("cy", 64)
            .attr("cx", width - 50)
            .attr('r', 8)
            .attr("fill", this.state.countryColors[3]);
        //bundle chart object for interval function
        const chartObj = {
            g,
            x,
            y,
            circleRadius,
            continentColor,
            margin,
            width,
            height,
            timeLabel        
        }
        //interval
        d3.interval(() => {
            yearIndex < data.length - 1 ? yearIndex++ : (yearIndex = 0)
            let year = data[yearIndex].year
            this.updateChart(currentData(yearIndex), chartObj, yearIndex)
        }, 300)
        this.updateChart(currentData(yearIndex), chartObj, yearIndex)
       
    }

    updateChart = (curDat, chartObj, yearIndex) => {
        const {g, x, y, circleRadius, continentColor,timeLabel} = chartObj

        const node = this.node

        const t = d3.transition().ease(d3.easeLinear).duration(300)

                //year
        this.setState({
            year:data[yearIndex].year
        })
        
        //set up circles and attrs
        //data Join
        const circles = g.selectAll('circle')
            .data(curDat, d => d.country)

        //exit
        circles.exit()
            .attr('class', 'exit')
            .remove()
        //update & enter

        circles.enter()
            .append('circle')
            .attr('class', 'enter')
            .attr('fill', d => continentColor(d.continent))
            .merge(circles)
            .transition(t)
                .attr('cx', d => x(d.income))
                .attr('cy', d => y(d.life_exp))
                .attr('r', d => circleRadius(d.population))
                
        timeLabel.text(+(yearIndex + 1800))    


    }
    render() {
        return (
            <svg className='chart' ref={node => this.node = node} width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}>
            </svg>
        )
    }
}
