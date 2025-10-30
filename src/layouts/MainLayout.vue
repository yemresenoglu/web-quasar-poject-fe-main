<template>
  <!-- Test content removed -->
  <q-layout view="hHh lpR fFf">
    <Taskbar v-model="drawerOpen" :taskbar-settings="taskbarSettings" />
    <q-page-container id="main-content">
      <MainContent />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Dark, LocalStorage } from 'quasar'
import Taskbar from 'src/components/Taskbar.vue'
import MainContent from 'src/components/MainContent.vue'

const drawerOpen = ref(true) // Always open taskbar

// UI State
const notifications = ref([])
// const globalLoading = ref(false)
// const globalError = ref(null)
const darkMode = ref(LocalStorage.getItem('darkMode') || false)
const sompoMode = ref(LocalStorage.getItem('sompoMode') || false)

// const dialogs = ref({
//   confirm: false,
//   alert: false,
//   info: false
// })

// const dialogData = ref({
//   confirm: {
//     title: '',
//     message: '',
//     confirmText: 'Onayla',
//     cancelText: 'İptal',
//     onConfirm: null,
//     onCancel: null
//   },
//   alert: {
//     title: '',
//     message: '',
//     type: 'info'
//   },
//   info: {
//     title: '',
//     content: '',
//     actions: []
//   }
// })

// UI Functions
// const showNotification = (notification) => {
//   const id = Date.now()
//   const newNotification = {
//     id,
//     type: 'info',
//     position: 'top',
//     timeout: 5000,
//     ...notification
//   }
//   
//   notifications.value.push(newNotification)
//   
//   if (newNotification.timeout > 0) {
//     setTimeout(() => {
//       removeNotification(id)
//     }, newNotification.timeout)
//   }
//   
//   return id
// }

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// const clearNotifications = () => {
//   notifications.value = []
// }

// const toggleDarkMode = () => {
//   darkMode.value = !darkMode.value
//   LocalStorage.set('darkMode', darkMode.value)
//   Dark.set(darkMode.value)
// }

// const toggleSompoMode = () => {
//   sompoMode.value = !sompoMode.value
//   LocalStorage.set('sompoMode', sompoMode.value)
//   // TODO: sompoMode.value ? document.body.classList.add('sompo-mode') : document.body.classList.remove('sompo-mode')
//   // TODO: if (sompoMode.value) Dark.set(false) else Dark.set(darkMode.value)
// }

// Taskbar settings - fixed to left position
const taskbarSettings = computed(() => ({
  autoHide: true
}))

// Layout view simplified - using static view

// Watch for dark mode changes
watch(darkMode, (newValue) => {
  Dark.set(newValue)
}, { immediate: true })
</script>

<style lang="sass">
// Light mode background
#q-app
  background: #f8fafc
  transition: background 0.3s ease

// Dark mode background - #030514
body.body--dark #q-app
  background: #030514

// q-drawer ve q-footer için istisna (kendi background'larını kullansınlar)
#q-app > .q-layout
  background: transparent !important

.q-drawer,
.q-footer
  background: transparent !important

*
  -ms-overflow-style: none
  scrollbar-width: none

::-webkit-scrollbar
  display: none
</style>