<template>
  <div id="Header" class="Header">
    <div class="title">
      <router-link
          v-for="link in links"
          :key="link.name"
          :to="link.route"
          class="link"
          :class="{ active: $route.name === link.name }">
        {{ link.label }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
const links = [
    { name: 'Posts', route: '/', label: 'Посты' },
    { name: 'Photo', route: '/photo', label: 'Фото' },
    { name: 'Tasks', route: '/task', label: 'Задачи' },
];
</script>

<style>
.Header {
    position: sticky;
    top: 0;
    z-index: 15;
    width: 100%;
    height: 32px;
    background: black;
    border-bottom: solid 1px black;
}

.title {
    display: flex;
    gap: 12px;
    align-self: center;
    padding-left: 12px;
}

/* Стили для обычных ссылок */
.link {
    color: white;
    text-decoration: none;
}

/* Стили для активных ссылок */
.link.active {
    color: green;
}
</style>
