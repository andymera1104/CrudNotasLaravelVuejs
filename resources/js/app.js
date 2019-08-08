require('./bootstrap');

window.Vue = require('vue');

//registra los componentes
Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('notas', require('./components/TareasComponent.vue').default);

const app = new Vue({
    el: '#app',
});
