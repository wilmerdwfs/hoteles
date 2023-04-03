<template>
  <BotonRegistrar etiqueta="Registrar" @showModal="recibidoShowModal"/>
  <ModalAcciones :show="showModal" @close="showModal = false">
    <form
      @submit="checkForm"
      method="post"
    >
      <h1>Agregar hoteles</h1>
      <hr/>
      <div class="row">
        <div class="col-md-6">
          <label for="name">Nit:</label>
          <input
            v-model="inputTextNit"
            type="text"
            class="form-control"
          >
        </div>
        <div class="col-md-6">
          <label for="inputTextNombre">Nombre:</label>
          <input
            v-model="inputTextNombre"
            type="text"
            class="form-control"
          >
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="col-md-6">
          <label for="name">Ciudad:</label>
          <select
            v-model="inputSelectCiudad"
            name="movie"
            class="form-control"
          >
            <option value="1">Bogota</option>
            <option value="2">Barranquilla</option>
            <option value="3">Cartagena</option>
            <option value="3">Cali</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="name">Dirección:</label>
          <input
            v-model="inputTextDireccion"
            type="text"
            class="form-control"
          >
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="col-md-4">
          <label>Numero de habitaciones:</label>
          <input
            v-model="inputNumberNumeroHabitaciones"
            type="number"
            class="form-control"
          >
        </div>
      </div>
      <br>
      <div v-if="errorFormulario.length">
        <b>Por favor, corrija el errores siguientes :</b>
        <ul style="padding-left:30px"  class="alert alert-danger">
          <li v-for="datError in errorFormulario" v-bind:key="datError">
            <strong>{{datError}}</strong>
          </li>
        </ul>
      </div>
      <p v-if="msg" class="alert alert-success">
        {{msg}}
      </p>
      <hr/>
      <div class="pie-form">
        <input
          type="submit"
          value="Enviar"
          class="boton"
        >
      </div>
    </form>
  </ModalAcciones>
</template> 

<script>
  import BotonRegistrar from '../../components/UI/BotonRegistrar'
  import ModalAcciones from '../../components/UI/ModalAcciones'
  import HotelesSevicio from '../../servicios/HotelesServicio'
  import ValidacionesCamposServicio from '../../servicios/ValidacionesCamposServicio'

  export default {
    components: {
      BotonRegistrar, 
      ModalAcciones,
    },
    data() {
      return {
        titulo : 'Lista de hoteles',
        msg: '',
        errorFormulario: [],
        showModal: false,
        //declaraciones para comunicacion con el formulario
        inputTextNit:'',
        inputTextNombre:'',
        inputSelectCiudad:0,
        inputTextDireccion:'',
        inputNumberNumeroHabitaciones:'',
        //fin
      }
    },
    methods:{
      recibidoShowModal(showModal) {//funcion con la comunicacion para el componente padre
        this.showModal = showModal;
      },
      recibidoDatos(datos){//funcion con la comunicacion para el componente padre
        this.$emit('datos', datos);
      },
      checkForm: function (e) {
        this.errorFormulario = [];
       
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

        e.preventDefault();
     
        const existeRegistro = ValidacionesCamposServicio.validarExistenciasRegistradas('classNombreHotel',this.inputTextNombre);

        if (existeRegistro) {
          this.errorFormulario.push('Este nombre del hotel ya existe');
        }
     
        if (this.errorFormulario.length!=0) {
          e.preventDefault();
          return 0;
        }

        HotelesSevicio.postRegistrar(formData,'hoteles/registrar')
          .then(response => {
            this.msg   = response.data.message;
            //emitiendo los datos al componente padre HotelesLista
            this.recibidoDatos(response.data.datos);
          });
        },
      }
    }
</script>
