import axios from 'axios'

export default() => {
	return axios.create({
		baseURL:'http://localhost/api/public/api/',
		headers:{
			'Accept': 'aplication/json',
			'Content-Type': 'aplication/json'
		}
	})
}