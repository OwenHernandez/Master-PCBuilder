<template>
    <div class="register">
        <h1>Registro</h1>
        <form @submit="submitForm">
            <label for="username">Nombre de usuario:</label>
            <input type="text" id="username" v-model="username" required>
            
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" v-model="email" required>
            
            <label for="password">Contraseña:</label>
            <input type="password" id="password" v-model="password" required>
            
            <button type="submit">Registrarse</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            email: '',
            password: ''
        };
    },
    methods: {
        submitForm() {
            // Aquí puedes agregar la lógica para enviar los datos del formulario al servidor
            // y realizar el registro del usuario
            console.log('Formulario enviado');
        }
    }
};
</script>

<style lang="scss" scoped>
.register{
    display: flex;
    flex-direction: column;
    align-items: center;      
    justify-content: center;
    height: 100vh;
}
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f2f2f2;
    border-radius: 5px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 10px;
}

input {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>