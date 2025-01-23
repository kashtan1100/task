<template>
  <div class="filters">

    <div class="posts-control">
      <label class="header-title">Фильтр по имени пользователя:</label>
      <BDropdown text="Выберите автора" auto-close="outside">
        <template #default>
          <div v-for="user in users" :key="user.id" class="dropdown-item">
            <BFormCheckbox
                :value="user.id"
                @change="$emit('update-selected-users', user.id)"
            >
              {{ user.name }}
            </BFormCheckbox>
          </div>
        </template>
      </BDropdown>
    </div>

    <div class="posts-control">
      <label class="header-title">
        <BFormCheckbox @change="$emit('update-filter-favorites', $event.target.checked)">
          Только избранные
        </BFormCheckbox>
      </label>
    </div>

    <div class="posts-control">
      <label class="header-title" for="sortField">Сортировать по:</label>
      <select id="sortField" @change="$emit('update-sort-field', $event.target.value)">
        <option value="id">ID</option>
        <option value="title">Название</option>
        <option value="userName">Имя автора</option>
        <option value="favorite">Избранное</option>
      </select>
    </div>

    <div class="posts-control">
      <label class="header-title" for="sortDirection">Направление сортировки:</label>
      <select id="sortDirection" @change="$emit('update-sort-direction', $event.target.value)">
        <option value="asc">По возрастанию</option>
        <option value="desc">По убыванию</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
    perPageOptions: Array,
    users: Array,
});
defineEmits([
    'update-per-page',
    'update-selected-users',
    'update-filter-favorites',
    'update-sort-field',
    'update-sort-direction',
]);
</script>

<style lang="scss">

</style>