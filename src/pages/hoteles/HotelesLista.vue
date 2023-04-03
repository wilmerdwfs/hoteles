<template>
  <h1>{{titulo}}</h1>

  <HotelesListaRegistrar @datos="recibidoDatos" />
  <hr/>
  <p v-if="msg" class="alert alert-success">
    <strong>{{msg}}</strong>
  </p>

  <input type="text" 
       id="myInput"  
       @keyup="getFiltrarTabla()" 
       v-bind:placeholder="inputPlaceholder">
  <div class="scroll">
    <table id="myTable">
      <tr class="header">
        <th >Nit</th>
        <th >Nombre</th>
        <th >Dirección</th>
        <th>Ciudad</th>
        <th >Numero de habitaciones</th>
        <th >Reservaciones</th>
        <th >Acciones</th>
      </tr>
      <tr v-for="dato in datos" v-bind:key="dato.id">
        <td>{{dato.nit}}</td>
        <td class="classNombreHotel">{{dato.nombre}}</td>
        <td>{{dato.direccion}}</td>
        <td>{{dato.nombreCiudad}}</td>
        <td>{{dato.numeroHabitaciones}}</td>
        <td>
          <a  @click="mostarModalHabitaciones(dato.id,dato.numeroHabitaciones,dato.nombre)" 
            @showModal="recibidoShowModal">
            <img style="width:30px" 
              :src="iconCita" 
              alt="Icono de interfaz para agregar habitaciones">
          </a>
        </td>
        <td>
          <a  @click="eliminarHotel(dato.id)">
            <img style="width:30px" 
              :src="iconEliminar" 
              alt="Icono de interfaz para eliminar">
          </a>
        </td>
      </tr>
  </table>
</div>
  <ModalAcciones :show="showModalHabitaciones" @close="showModalHabitaciones = false">
    <HotelesListaRegistrarHabitaciones 
      :proId="idC" 
      :proNumeroHabitaciones="numeroHabitaciones" 
      :proNombreHotel="nombreHotel"/>
  </ModalAcciones>

</template>

<script>
import HotelesSevicio from '../../servicios/HotelesServicio.js'
import HotelesListaRegistrar from './HotelesListaRegistrar'
import HotelesListaRegistrarHabitaciones from './HotelesListaRegistrarHabitaciones'
import ModalAcciones from '../../components/UI/ModalAcciones'
import ValidacionesCamposServicio from '../../servicios/ValidacionesCamposServicio'

export default {
  props: {
    proId: Number,
    proNumeroHabitaciones: Number,
    proNombreHotel:String,
  },
  components: {
    HotelesListaRegistrar,
    HotelesListaRegistrarHabitaciones,
    ModalAcciones,
  },
  data() {
    return {
      titulo : 'Lista de hoteles',
      idC: 0,
      msg: '',
      errorFormulario: [],
      datos: [],//array de datos de la vista principal
      inputPlaceholder: "Ingrese su texto aquí",
      showModal: false,
      showModalHabitaciones: false,
      inputNumberNumeroHabitaciones:0,//variable del formulario
      datosAcomodacion: [],//cargando la lista select acomodacion
      datosHabitaciones: [],
      numeroHabitaciones:0,
      iconCita: require('@/assets/img/icon-cita.png'),
      iconEliminar: require('@/assets/img/icon-eliminar.png')
    }
  },
  methods : {
    mostarModalHabitaciones(idC,numeroHabitaciones,nombreHotel ){
      this.showModalHabitaciones = true;
      this.nombreHotel = nombreHotel;
      this.idC = idC;//id de la cabeza carturandolo para luego consultar la tabla padre y traer las habitaciones
      this.numeroHabitaciones = numeroHabitaciones;
    },
    recibidoShowModal(showModal){
       this.showModal = showModal;
    },
    getFiltrarTabla(){
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
          tr[i].style.display = "none";
          }
        }       
      }
    },
    checkForm: function (e) {//metodo para guardar el hotel

      this.errorFormulario = [];

      this.msg = '';

      if (!this.inputTextNit) {
        this.errorFormulario.push('El nit es obligatorio.');
      }
      
      if (!this.inputTextNombre) {
        this.errorFormulario.push('El nombre es obligatorio.');
      }

      if (!this.inputSelectCiudad) {
        this.errorFormulario.push('La ciudad es obligatoria');
      }

      if (!this.inputTextDireccion) {
        this.errorFormulario.push('La dirección es obligatoria');
      }

      if (!this.inputNumberNumeroHabitaciones) {
        this.errorFormulario.push('El numero de habitaciones es obligatorio');
      }
      
      const formData = new FormData();

      formData.append("nit", this.inputTextNit);
      formData.append("nombre", this.inputTextNombre);
      formData.append("idCiudad", this.inputSelectCiudad);
      formData.append("direccion", this.inputTextDireccion);
      formData.append("numeroHabitaciones", this.inputNumberNumeroHabitaciones);
      
      const existeNombre = ValidacionesCamposServicio.validarExistenciasRegistradas('classNombreHotel',this.inputTextNombre);

      if (existeNombre ) {
        this.errorFormulario.push('Este nombre del hotel ya existe');
      }
      
      if (this.errorFormulario.length!=0) {
        e.preventDefault();
        return 0;
      }

      HotelesSevicio.postRegistrar(formData,'hoteles/registrar')
        .then(response => {
          this.msg   = response.data.msg;
          this.datos = response.data.datos;
        });
    },
    eliminarHotel(id){
      HotelesSevicio.deleteEliminar(id,'hoteles/eliminar').then(response => {
                    this.msg   = response.data.message;
                    this.datos = this.datos.filter((dato) => dato.id !== id);
                  });
    },
  },
  mounted(){
    HotelesSevicio.getDatos('hoteles').then(response => {
                    this.datos = response.data;
                   });
  },
}


</script>

<style>
* {
  box-sizing: border-box;
}

#myInput {
  background-position: 10px 10px;
  background-repeat: no-repeat;
  width: 100%;
  font-size: 16px;
  padding: 12px 20px 12px 40px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
}

#myTable {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ddd;
  font-size: 18px;
}

#myTable th, #myTable td {
  text-align: left;
  padding: 12px;
}

#myTable tr {
  border-bottom: 1px solid #ddd;
}

#myTable tr.header, #myTable tr:hover {
  background-color: #f1f1f1;
}

.pie-form {
  background-color: #f1f1f1;
  display:flex;
  justify-content:flex-end;
}

.scroll {
  overflow: scroll;
  height:600px;
}

</style>

