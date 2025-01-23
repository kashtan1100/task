<template>
  <div class="posts-control">
    <label class="header-title" for="perPageSelect">Количество задач на странице:</label>
    <select id="perPageSelect" v-model.number="perPage" @change="updatePerPage">
      <option v-for="option in perPageOptions" :key="option" :value="option">
        {{ option === -1 ? 'Все' : option }}
      </option>
    </select>
  </div>
  <ul>
    <li v-for="task in paginatedTasks" :key="task.id">
      <input type="checkbox" v-model="task.completed" />
      <span :class="{ completed: task.completed }">{{ task.title }}</span>
    </li>
  </ul>

  <div class="pagination-container">
    <BPagination
        v-if="perPage !== -1"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchTodos } from "@/api/postService.ts";
const perPage = ref(parseInt(localStorage.getItem("todoPage") || "10", 10));
const currentPage = ref(1);
const tasks = ref([]); // Список задач
const perPageOptions = [10, 20, 50, 100, -1];

const loadTasks = async () => {
    try {
        tasks.value = await fetchTodos();
    } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
    }
};

const sortedTasks = computed(() => {
    return tasks.value.slice().sort((a, b) => a.completed - b.completed);
});

const rows = computed(() => sortedTasks.value.length);

const paginatedTasks = computed(() => {
    if (perPage.value === -1) {
        return sortedTasks.value; // Все задачи на одной странице
    }
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return sortedTasks.value.slice(start, end);
});

const updatePerPage = () => {
    localStorage.setItem("todoPage", perPage.value.toString());
    currentPage.value = 1; // Сброс на первую страницу при изменении количества задач
};

// Загрузка задач при монтировании компонента
onMounted(loadTasks);
</script>

<style lang="scss">
.completed {
  text-decoration: line-through;
  color: gray;
}
</style>