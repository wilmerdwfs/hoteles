export default {

	validarExistenciasRegistradas(nombreClase,existenciaComparar){
        let nombresClases = document.querySelectorAll('.'+nombreClase);
        for (let i = 0; i < nombresClases.length; i++) {
          if (nombresClases[i].innerText.toUpperCase() == existenciaComparar.toUpperCase()) {
            return true;
          }
        }
    }

}