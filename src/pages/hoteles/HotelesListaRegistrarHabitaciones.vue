<template>
  <div class="scroll">
    <form
      @submit="checkFormHabitaciones">
      <h1>Asignar habitaciones</h1>

      <table class="table table-striped">
        <tbody>
          <tr>
            <td>
              <h6>Hotel : {{proNombreHotel}}</h6>
            </td>
            <td>
              <h6>Habitaciones permitidas: {{proNumeroHabitaciones}}</h6>
            </td>
         </tr>
        </tbody>
      </table>
      <hr/>
      <div class="row">
        <div class="col-md-12">
          <label for="name">Cantidad:</label>
          <input
            v-model="inputNumberCantidadHabitaciones"
            type="number"
            class="form-control"
          >
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="col-md-12">
          <label for="name">Tipo de habitación:</label>
          <select
            @change="acomodacion"
            v-model="inputSelectTipoHabitacion"
            class="form-control"
            ref="refInputSelectTipoHabitacion"
          >
            <option value="1">Estándar</option>
            <option value="2">Junior</option>
            <option value="3">Suite</option>
          </select>
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="col-md-12">
          <label for="name">Acomodacción:</label>
          <select
            v-model="inputSelectAcomodacion"
            class="form-control"
            ref="refInputSelectAcomodacion"
          >
            <option 
              v-for="datAcomo in datosAcomodacion" 
              :value="datAcomo.value"
              v-bind:key="datAcomo.value"
            >
              {{datAcomo.texto}}
            </option>
          </select>
        </div>
      </div>
      <div v-if="errorFormulario.length">
        <b>Por favor, corrija el errores siguientes :</b>
        <ul style="padding-left:30px"  class="alert alert-danger">
          <li v-for="datError in errorFormulario" v-bind:key="datError">
            <strong>{{datError}}</strong>
          </li>
        </ul>
      </div>
      <p v-if="msg" class="alert alert-success">
        <strong>{{msg}}</strong>
      </p>
      <hr/>
      <div class="pie-form">
        <input type="submit" class="boton" value="Enviar">
      </div>
    </form>
    <hr/>
    <h4>{{titulo}}</h4>
    <table id="myTable">
      <tr class="header">
        <th >Cantidad</th>
        <th >Tipo</th>
        <th >Acomodación</th>
        <th>Eliminar</th>
      </tr>
      <tr v-for="dato in datosHabitaciones" v-bind:key="dato.id">
        <td class="classCantidadHabitacion">{{dato.cantidad}}</td>
        <td class="classTipoHabitacion">{{dato.tipo}}</td>
        <td class="classAcomodacion">{{dato.acomodacion}}</td>
        <td>
          <a  @click="eliminarHabitaciones(dato.id)">
            <img style="width:30px" 
              :src="iconEliminar" 
              alt="Icono de interfaz para eliminar">
          </a>
        </td>
      </tr>
    </table>
  </div>
</template> 

<script>
  import HotelesSevicio from '../../servicios/HotelesServicio.js'
  import ValidacionesCamposServicio from '../../servicios/ValidacionesCamposServicio'

  export default {
    props: {
      proId: Number,
      proNumeroHabitaciones: Number,
      proNombreHotel: String,
    },
    data() {
      return {
        titulo : 'Lista de habitaciones',
        msg: '',
        errorFormulario: [],
        inputNumberNumeroHabitaciones:0,
        //formulario items
        datosAcomodacion: [],
        datosHabitaciones: [],
        numeroHabitaciones:0,
        compararCantidadHabitacion:0,
        iconEliminar: require('@/assets/img/icon-eliminar.png')
      }
    },
    methods:{
      acomodacion:function(){
        
        if (this.inputSelectTipoHabitacion==1) {
          this.datosAcomodacion = [
            {value:1,texto:'Sencilla'},
            {value:2,texto:'Doble'},
          ];
        }

        if (this.inputSelectTipoHabitacion==2) {
          this.datosAcomodacion = [
            {value:3,texto:'Triple'},
            {value:4,texto:'Cuatruple'},
          ]
        }

        if (this.inputSelectTipoHabitacion==3) {
          this.datosAcomodacion = [
            {value:1,texto:'Sencilla'},
            {value:2,texto:'Doble'},
            {value:3,texto:'Triple'},
          ]
        }
      },
      checkFormHabitaciones: function (e) {

        this.errorFormulario = [];
        
        this.msg = '';

        if (!this.inputNumberCantidadHabitaciones) {
          this.errorFormulario.push('La cantidad de habitaciones es obligatoria');
        }

        if (!this.inputSelectTipoHabitacion) {
          this.errorFormulario.push('El campo tipo habitación es obligatorio');
        }

        if (!this.inputSelectAcomodacion) {
          this.errorFormulario.push('El campo acomodaación es obligatorio');
        }

        const formData = new FormData();

        formData.append("idHotel", this.proId);
        formData.append("cantidad", this.inputNumberCantidadHabitaciones);
        formData.append("tipo", this.inputSelectTipoHabitacion);
        formData.append("acomodacion", this.inputSelectAcomodacion);

        this.compararCantidadHabitacion = 0;

        document.querySelectorAll('.classCantidadHabitacion').forEach((item) => {
             
          this.compararCantidadHabitacion+= parseInt(item.innerText);
           
        });

        this.compararCantidadHabitacion+=this.inputNumberCantidadHabitaciones;
    
        if (this.proNumeroHabitaciones<this.compararCantidadHabitacion) {
          this.errorFormulario.push('Estas pasando el numero de habitaciones establecidas del hotel que es : '+this.proNumeroHabitaciones+' y en total habría :'+this.compararCantidadHabitacion);
        }

        let existeTipoHabitacion = ValidacionesCamposServicio.validarExistenciasRegistradas('classTipoHabitacion',this.$refs.refInputSelectTipoHabitacion.selectedOptions[0].text);

        if (existeTipoHabitacion) {
          this.errorFormulario.push('El nombre del hotel ya tiene el tipo de habitación');
        }

        let existeAcomodacion = ValidacionesCamposServicio.validarExistenciasRegistradas('classAcomodacion',this.$refs.refInputSelectTipoHabitacion.selectedOptions[0].text);

        if (existeAcomodacion) {
          this.errorFormulario.push('El nombre del hotel ya tiene la acomodación');
        }
        
        if (this.errorFormulario!='' ) {
          e.preventDefault();
          return 0;
        }
      
        HotelesSevicio.postRegistrar(formData,'hoteleshabitaciones/registrar').then(response =>{
          this.inputNumberCantidadHabitaciones = '';
          this.inputSelectTipoHabitacion = '';
          this.inputSelectAcomodacion = '';
          this.msg   = response.data.message;
          this.datosHabitaciones = response.data.datos;
        });
        e.preventDefault();
      },
      eliminarHabitaciones(id){
        HotelesSevicio.deleteEliminar(id,'hoteleshabitaciones/eliminar').then(response => {
                    this.msg   = response.data.message;
                    this.datosHabitaciones = this.datosHabitaciones.filter((dato) => dato.id !== id);
                  });
      },
    },
    mounted(){//trayendo el los datos exitentes agregados
      HotelesSevicio.getDatosId(this.proId,'hoteleshabitaciones').then(response => {
        this.datosHabitaciones = response.data;
      });
    }
  }
</script>
