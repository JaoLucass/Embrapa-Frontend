import './App.css';
import React, {Component, useState, useEffect} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import axios from "axios";

class App extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			items: [],
			isLoaded: false,
		}
		this.state ={value: ''}

		this.handleChange = this.handleChange.bind(this);
		//this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event){
		this.setState({value: event.target.value});
	}
	
	handleSubmit(event) {
		
	  }

	componentDidMount(){
		fetch('https://luis-back-node.herokuapp.com/dados_da_estacao')
			.then(res => res.json())
			.then(json => {
				this.setState({
					isLoaded: true,
					items: json,
				})
			});
	}
	
	render(){
		
		var { isLoaded, items } = this.state;
		
		if(!isLoaded){
			return <div>Loading...</div>;
		}
		
		else{
						
			console.log(items);
			var strTemp = '';
			var vector = [];
			var L = 0;
			var C = 0;
			while (L < 4){
				while (C < 19) {
					strTemp += items[L].createdAt[C];
					C+=1;
				}
				vector[L]=strTemp;
				strTemp = '';
				C=0;
				L++;
			}
	
			const data = [
				{data: vector[0], precipitacao: 0},
				{data: vector[1], precipitacao: 20},
				{data: vector[2], precipitacao: items[2].precipitacao},
				{data: vector[3], precipitacao: items[3].precipitacao},
				{data: '2020-02-13T16:32:23', precipitacao: 100},
				{data: '2020-02-13T17:35:51', precipitacao: 40},
				{data: '2020-02-13T18:23:09', precipitacao: 70},
			];
			
				return (
					<div className="App">
					
						<select value={this.state.value} onChange={this.handleChange}>
							<option value="daily">Dia</option>
							<option value="weekly">Semana</option>
							<option value="Month">Mês</option>
							<option value="Three_months">3 Meses</option>
							<option value="six_months">6 Meses</option>
							<option value="1_year">1 ano</option>
						</select>				
				
						<LineChart
							width={1800}
							height={600}
							data={data}
							margin={{top: 5, right: 30, left: 20, bottom: 5}}
							>
							<Line
								type='monotone'
								dataKey='precipitacao'
								stroke='#8884d8'
								activeDot={{r: 8}}
								/>
							<CartesianGrid strokeDasharray='3 3'/>
							<Tooltip/>
							<YAxis/>
							<XAxis dataKey='data'/>
							<Legend />
						</LineChart>
						
					</div>
				);
			
		
		}
	}
}

export default App;
