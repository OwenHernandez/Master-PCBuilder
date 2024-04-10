<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card
          class="elevation-2"
          color="surface-variant"
          dark
          max-width="400"
          rounded="lg"
        >
          <v-card-title class="headline">Register</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                v-model="email"
                type="email"
              />
              <v-text-field
                label="Password"
                v-model="password"
                type="password"
              />
              <v-btn
                block
                color="primary"
                @click="register"
              >
                Register
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const register = () => {
  // Aquí puedes implementar la lógica de registro.
  // Por ejemplo, puedes hacer una solicitud HTTP a tu API para registrar al usuario.
  console.log(`Registering user with email: ${email.value} and password: ${password.value}`);
};
</script>

<style scoped>

</style>
