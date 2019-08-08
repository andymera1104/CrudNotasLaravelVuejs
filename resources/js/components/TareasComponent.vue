<template>
    <div>
        <!-- PARA EDITAR -->
        <form @submit.prevent="editarNota(nota)" v-if="editarActivo">
        <h3>Editar nota</h3>
            <input type="text" class="form-control mb-2" placeholder="Nombre de la nota" v-model="nota.nombre">
            <input type="text" class="form-control mb-2" placeholder="Descripción de la nota" v-model="nota.descripcion">
            
            <button class="btn btn-success" type="submit">Guardar</button>
            <button class="btn btn-danger" type="submit" @click="cancelarEdicion">Cancelar</button>
        </form>
        <!-- PARA AGREGAR  -->
        
         <form @submit.prevent="agregar" v-else>
             <h3>Añadir Nueva Nota</h3>
                    <input type="text" placeholder="Nombre" class="form-control mb-2" v-model="nota.nombre">
                    <input type="text" placeholder="Descripcion" class="form-control mb-2" v-model="nota.descripcion">
                    <button class="btn btn-info" type="submit">Agregar</button>
        </form>
        <hr class="mt-3">
        <h3>Listado de Notas</h3>
        <ul class="list-group my-2">
            
            <li class="list-group-item" v-for="(item,index) in notas" :key="index">
                <span class="badge badge-primary float-right">
                    {{item.updated_at}}
                </span>
                <p>{{item.nombre}}</p>
                <p>{{item.descripcion}}</p>
                <!-- PARA EL BOTON EDITAR -->
                 <button class="btn btn-warning btn-sm" @click="editarFormulario(item)">Editar</button>
                <!-- PARA EL BOTON ELIMINAR -->
                 <button class="btn btn-danger btn-sm"  @click="eliminarNota(item, index)">Eliminar</button>
          
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return{ 
        notas:[],
        nota:{
            nombre:'',
            descripcion:''
            },
        editarActivo: false
        }
    },
    //metodo propio de vue
    created(){
        axios.get('/notas')
            .then(res=>{
               this.notas=res.data; 
            })
    },

    methods:
    {
        agregar(){
            //creamos una constante 
            const params= {
                nombre:this.nota.nombre,
                descripcion:this.nota.descripcion}
            //para que cuando se grabe se limpie los inputs
            this.nota.nombre='',
            this.nota.descripcion=''

            axios.post('/notas',params)
                //para poder visualizar a nuestro pagina vue
                .then(res => {
                    //agregamos la nota dentro de notas:[]
                    this.notas.push(res.data)
                })
        },


        editarFormulario(item){
            //condicion para el v-if para que cargue o no el formulario de edicion
            this.editarActivo = true;
            //llenamos la informacion del array
            this.nota.nombre = item.nombre;
            this.nota.descripcion= item.descripcion;

            this.nota.id= item.id;
        },

        editarNota(nota){
            //construimos una constante
            const params = {nombre: nota.nombre,descripcion:nota.descripcion};
            
            axios.put(`/notas/${nota.id}`,params)
                .then(res=>{
                    this.editarActivo=false;
                    const index =this.notas.findIndex(item=>item.id ===nota.id);
                    this.notas[index]= res.data;

                    this.nota={nombre:'',descripcion:''}
                    
                     axios.get('/notas')
                        .then(res=>{
                        this.notas=res.data; 
                    })

                })
        },

        cancelarEdicion(){
            this.editarActivo=false;
            this.nota={nombre:'',descripcion:''}
        },

        eliminarNota(item,index){
            axios.delete(`/notas/${item.id}`)
                .then(()=>{
                    this.notas.splice(index,1);
                })
        }
    }
}
</script>
