import './App.css';
import React, {useState, useEffect} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import axios from "axios";

function App(){
	
	const [data, setData]= useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [select, setSelect]= useState('ever');
	const [message, setMessage] = useState('Coletando os dados...');

	useEffect(() => {
		console.log('useEffect - Consultando a API pela 1ª vez');
		axios.get('https://luis-back-node.herokuapp.com/dados_da_estacao')
			.then(function (response){
				let items = response.data;
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
			
				setData(data);
				setIsLoaded(true);
				})
			
			.catch(function (error){
				console.log(error);
			})

			.finally(function(){
				console.log('Consulta para a API finalizada');
			});
	}, []);

	useEffect(() => {
		console.log('useEffect - Mudou o Select');
		setIsLoaded(false);

		switch (select) {
			case 'ever':
			default:
				setMessage('Acessando todos os dados disponíveis.');
				break;
			case '1_year':
				setMessage('Acessando todos os dados do último ano');
				break;
			case 'six_mouths':
				setMessage('Acessando todos os dados dos últimos 6 meses');
                break;
            case 'Three_months':                
                setMessage('Acessando todos os dados dos último 3 meses');
                break;
            case 'Month':
                setMessage('Acessando todos os dados dos último mês');
                break;
            case 'weekly':
                setMessage('Acessando todos os dados da última semana');
                break;
            case 'daily':                
                setMessage('Acessando todos os dados de hoje');
                break;
		}

		setTimeout(
			function () {
				setIsLoaded(true);
			}, 3000
		);
	}, [select]);

    return (
        <div style={{ padding: '30px' }} className="App">

            <select value={select} onChange={event => setSelect(event.target.value)}>
                <option value="daily">Dia</option>
                <option value="weekly">Semana</option>
                <option value="Month">Mês</option>
                <option value="Three_months">3 Meses</option>
                <option value="six_months">6 Meses</option>
                <option value="1_year">1 ano</option>
                <option value="ever">Sempre</option>
            </select>


            <div style={{ width: '100%', height: 600, display: 'flex', alignItems: 'center' }}>
                {isLoaded ?
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <Line
                                type='monotone'
                                dataKey='precipitacao'
                                stroke='#8884d8'
                                activeDot={{ r: 8 }}
                            />
                            <CartesianGrid strokeDasharray='3 3' />
                            <Tooltip />
                            <YAxis />
                            <XAxis dataKey='data' />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>

                    :
                    <div style={{ margin: '0px auto', textAlign: 'center' }}>
                        <h3>Carregando</h3>
                        <p>{message}</p>
                    </div>

                }
            </div>

            <p><strong>Valor do Select: </strong> {JSON.stringify(select)}</p>

        </div>
    );
}

export default App;