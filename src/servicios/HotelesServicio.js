import Api from '@/servicios/Api'

export default {

	getDatos(accion){
		return Api().get(accion);
	},

	getDatosId(id,accion){
		return Api().get(`${accion}/${id}`);
	},	
	
	postRegistrar(data,accion){
		return Api().post(accion,data);
	},

	deleteEliminar(id,accion){
		return Api().delete(`${accion}/${id}`);
	}

}