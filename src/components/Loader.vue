<template>
  <div class="loader"></div>
</template>

<script>
export default {
    name: "Loader"
}
</script>

<style scoped>
.loader {
    border: 4px solid #70422a;
    border-top: 4px solid #d57c11;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>