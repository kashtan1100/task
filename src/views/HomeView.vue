<script setup lang="ts">
import Header from "@/views/Header.vue";
</script>

<template>
  <div class="HomeView">

    <Header/>

    <router-view class='page-outer' id='the-page' />
  </div>
</template>

<style>
.HomeView {
    width: 100%;
    /*height: 100vh;*/
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    justify-content: flex-start;
    max-width: 100vw;
    overflow: hidden;
    position: relative;
}
</style>