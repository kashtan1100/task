<template>
  <div>
    <div class="posts-control">
      <label class="header-title" for="perPageSelect">Количество задач на странице:</label>
      <select id="perPageSelect" v-model.number="perPage" @change="updatePerPage">
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option === -1 ? 'Все' : option }}
        </option>
      </select>
    </div>

    <div class="filter-sort">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск задач"
          class="search-input"
      />
      <select v-model="statusFilter">
        <option value="all">Все</option>
        <option value="incomplete">Невыполненные</option>
        <option value="complete">Выполненные</option>
      </select>
      <select v-model="sortOption">
        <option value="asc">По возрастанию</option>
        <option value="desc">По убыванию</option>
      </select>
    </div>

    <div class="add-task">
      <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Введите название задачи"
      />
      <button @click="addTask">Добавить задачу</button>
    </div>

    <div class="tasks-columns">
      <div class="column">
        <h3>Невыполненные задачи</h3>
        <ul>
          <li v-for="task in paginatedIncompleteTasks" :key="task.id">
            <input type="checkbox" v-model="task.selected" />
            <input
                v-if="task.editing"
                v-model="task.title"
                @blur="finishEditing(task)"
                @keyup.enter="finishEditing(task)"
            />
            <span v-else>{{ task.title }}</span>
            <button @click="editTask(task)">Редактировать</button>
            <input type="checkbox" v-model="task.completed" />
          </li>
        </ul>
      </div>
      <div class="column">
        <h3>Выполненные задачи</h3>
        <ul>
          <li v-for="task in paginatedCompleteTasks" :key="task.id">
            <input type="checkbox" v-model="task.selected" />
            <input
                v-if="task.editing"
                v-model="task.title"
                @blur="finishEditing(task)"
                @keyup.enter="finishEditing(task)"
            />
            <span v-else class="completed">{{ task.title }}</span>
            <button @click="editTask(task)">Редактировать</button>
            <input type="checkbox" v-model="task.completed" />
          </li>
        </ul>
      </div>
    </div>

    <button @click="deleteSelectedTasks">Удалить выбранные задачи</button>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchTodos } from "@/api/postService.ts";

const perPage = ref(parseInt(localStorage.getItem("todoPage") || "10", 10));
const currentPage = ref(1);
const tasks = ref([]);
const perPageOptions = [10, 20, 50, 100, -1];
const searchQuery = ref("");
const statusFilter = ref("all");
const sortOption = ref("asc");
const newTaskTitle = ref("");

const loadTasks = async () => {
    try {
        tasks.value = await fetchTodos();
        tasks.value.forEach(task => {
            task.selected = false;
            task.editing = false;
        });
    } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
    }
};

const filteredTasks = computed(() => {
    let filtered = tasks.value.filter(task =>
        task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (statusFilter.value === "incomplete") {
        filtered = filtered.filter(task => !task.completed);
    } else if (statusFilter.value === "complete") {
        filtered = filtered.filter(task => task.completed);
    }
    return filtered.sort((a, b) => {
        const compare = a.title.localeCompare(b.title);
        return sortOption.value === "asc" ? compare : -compare;
    });
});

const incompleteTasks = computed(() =>
    filteredTasks.value.filter(task => !task.completed)
);
const completeTasks = computed(() =>
    filteredTasks.value.filter(task => task.completed)
);

const rows = computed(() => filteredTasks.value.length);

const paginatedIncompleteTasks = computed(() => {
    if (perPage.value === -1) {
        return incompleteTasks.value;
    }
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return incompleteTasks.value.slice(start, end);
});

const paginatedCompleteTasks = computed(() => {
    if (perPage.value === -1) {
        return completeTasks.value;
    }
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return completeTasks.value.slice(start, end);
});

const updatePerPage = () => {
    localStorage.setItem("todoPage", perPage.value.toString());
    currentPage.value = 1;
};

const addTask = () => {
    if (newTaskTitle.value.trim()) {
        tasks.value.push({
            id: Date.now(),
            title: newTaskTitle.value,
            completed: false,
            selected: false,
            editing: false,
        });
        newTaskTitle.value = "";
    }
};

const editTask = task => {
    task.editing = true;
};

const finishEditing = task => {
    task.editing = false;
};

const deleteSelectedTasks = () => {
    tasks.value = tasks.value.filter(task => !task.selected);
};

onMounted(loadTasks);
</script>

<style lang="scss">
.completed {
  text-decoration: line-through;
  color: gray;
}
.search-input {
  margin-right: 10px;
}
.add-task {
  margin: 20px 0;
}
</style>