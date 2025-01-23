<template>
  <div class="posts-app">

    <div class="posts-control">
      <button @click="openNewPostModal">Добавить новый пост</button>
    </div>

    <!-- Модальное окно для добавления поста -->
    <BModal v-model="newPostModalVisible" title="Добавить новый пост">
      <div>
        <label for="newPostTitle">Название поста:</label>
        <input
            id="newPostTitle"
            v-model="newPost.title"
            type="text"
            placeholder="Введите название поста"
        />
      </div>
      <div>
        <label for="newPostBody">Текст поста:</label>
        <textarea
            id="newPostBody"
            v-model="newPost.body"
            placeholder="Введите текст поста"
        ></textarea>
      </div>
      <div>
        <label for="newPostAuthor">Автор поста:</label>
        <select id="newPostAuthor" v-model="newPost.userId">
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      <template #footer>
        <button @click="addNewPost">Сохранить</button>
        <button @click="closeNewPostModal">Отменить</button>
      </template>
    </BModal>


    <div class="posts-control">
      <label class="header-title" for="postTitleFilter">Фильтр по названию поста:</label>
      <input
          id="postTitleFilter"
          v-model="postTitleFilter"
          @input="updateFilteredPosts"
          type="text"
          placeholder="Введите часть названия поста"
      />
    </div>

    <div class="posts-control">
      <label class="header-title" for="perPageSelect">Количество постов на странице:</label>
      <select id="perPageSelect" v-model.number="perPage" @change="updatePerPage">
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option === -1 ? 'Все' : option }}
        </option>
      </select>
    </div>

    <Filter
        :perPageOptions="perPageOptions"
        :users="users"
        @update-per-page="updatePerPage"
        @update-selected-users="updateSelectedUsers"
        @update-filter-favorites="updateFilterFavorites"
        @update-sort-field="updateSortField"
        @update-sort-direction="updateSortDirection"
    />

    <ul class="posts-list">
      <template v-for="post in displayedPosts" :key="post.id">
        <li
            :class="['post-item', { 'favorite-post': favorites.includes(post.id) }]"
        >
          <input
              type="checkbox"
              :value="post.id"
              v-model="selectedPosts"
              class="select-post"
          />
          <div class="bulk-actions" v-if="selectedPosts.includes(post.id)">
            <button @click="openModal('delete')">Удалить выбранные</button>
            <button @click="openModal('favorite')">Добавить в избранное</button>
          </div>

          <BModal v-model="modalVisible" :title="modalTitle">
            <p>{{ modalMessage }}</p>
            <template #footer>
              <button @click="confirmModalAction">Подтвердить</button>
              <button @click="cancelModalAction">Отменить</button>
            </template>
          </BModal>


          <div class="post-header">
            <h3>{{ post.title }}</h3>
            <p class="post-user">Автор: {{ getUserName(post.userId) }}</p>
          </div>
          <p v-if="editingPostId !== post.id" class="post-body">{{ post.body }}</p>
<!--          <textarea-->
<!--              v-else-->
<!--              v-model="editedPost.body"-->
<!--              class="edit-body"-->
<!--              placeholder="Введите новый текст поста"-->
<!--          ></textarea>-->

          <PostActionsAndComments
              :post="post"
              :active-comments="activeComments"
              :editing-post-id="editingPostId"
              :favorites="favorites"
              :post-comments="comments.find((c) => c.postId === post.id)?.comments || []"
              :edited-body="editedPost?.body"
              @update-edited-body="(value) => editedPost.body = value"
              @toggle-comments="showComments"
              @save-edit="saveEditPost"
              @cancel-edit="cancelEditPost"
              @edit-post="editPost"
              @delete-post="deletePost"
              @toggle-favorite="toggleFavorite"
          />
        </li>
      </template>
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

    <div class="bulk-actions" v-if="selectedPosts.length > 0">
      <button @click="handleBulkAction('delete')">Удалить выбранные</button>
      <button @click="handleBulkAction('favorite')">Добавить в избранное</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import {fetchPostsPhoto, fetchUsers} from "@/api/postService.ts";
import { Post, Comment } from "@/types/postTypes";
import { usePostActions } from "@/composables/usePostActions";
import PostActionsAndComments from "@/components/ActionsAndComment.vue";

let {
  posts, favorites, selectedPosts, editingPostId, editedPost, activeComments, perPage, modalVisible,
  modalTitle, modalMessage, cancelEditPost, deletePost, toggleFavorite, handleBulkAction,
  editPost, saveEditPost, updatePerPage, confirmModalAction, cancelModalAction, openModal,
  showComments, rows, comments, postTitleFilter, displayedPosts,
  selectedUsers, filterFavorites, updateFilteredPosts, sortField, sortDirection,
} = usePostActions();

const currentPage = ref(1);
const perPageOptions = [10, 20, 50, 100, -1];
const users = ref<{ id: number; name: string }[]>([]);

const updateSelectedUsers = (userId) => {
  if (selectedUsers.value.includes(userId)) {
    selectedUsers.value = selectedUsers.value.filter((id) => id !== userId);
  } else {
    selectedUsers.value.push(userId);
  }
  updateFilteredPosts();
};

const updateFilterFavorites = (value) => {
  filterFavorites.value = value;
  updateFilteredPosts();
};

const updateSortField = (value) => {
  sortField.value = value;
  updateFilteredPosts();
};

const updateSortDirection = (value) => {
  sortDirection.value = value;
  updateFilteredPosts();
};

const fetchAllPosts = async () => {
  posts.value = await fetchPostsPhoto<Post>("posts");
};

const fetchAllUsers = async () => {
  users.value = await fetchUsers();
};

const getUserName = (userId: number) => {
  const user = users.value.find((u) => u.id === userId);
  if (!user) {
    console.warn(`Пользователь с ID ${userId} не найден`);
  }
  return user?.name || "Неизвестный автор";
};

// Переменные для нового поста
const newPostModalVisible = ref(false);
const newPost = ref({
  title: "",
  body: "",
  userId: null,
});

// Открыть модальное окно для добавления поста
const openNewPostModal = () => {
  newPostModalVisible.value = true;
  newPost.value = { title: "", body: "", userId: null };
};

// Закрыть модальное окно
const closeNewPostModal = () => {
  newPostModalVisible.value = false;
};

// Добавить новый пост
const addNewPost = () => {
  if (!newPost.value.title || !newPost.value.body || !newPost.value.userId) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  const newId = Math.max(...posts.value.map((p) => p.id), 0) + 1; // Генерация нового ID
  posts.value.push({
    id: newId,
    ...newPost.value,
  });

  updateFilteredPosts(); // Обновить список постов
  closeNewPostModal(); // Закрыть модальное окно
};

onMounted(() => {
  fetchAllPosts();
  fetchAllUsers();
  watch(posts, updateFilteredPosts);
});

watch(perPage, updatePerPage);
</script>

<style lang="scss">
.modal-header {
  color: black;
}
.modal-body {
  color: black;
}
.posts-app {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  border-radius: 10px;

  .header-title {
    color: black;
  }

  .posts-list {
    padding: 0;
    list-style: none;

    .post-item {
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
      background: #fff;
      display: flex;
      flex-direction: column;

      .post-header {
        margin-bottom: 10px;

        h3 {
          margin: 0;
          color: #333;
        }

        .post-user {
          font-size: 14px;
          color: #666;
        }
      }

      .post-body {
        margin-bottom: 10px;
        color: #555;
      }

      .post-actions {
        display: flex;
        gap: 10px;

        button {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;

          &.favorite {
            color: gold;
          }

          &:hover {
            color: #007bff;
          }
        }
      }

      .comments {
        .title-comments {
          color: black;
        }
      }

      .select-post {
        margin-right: 10px;
      }
    }
  }

  .favorite-post {
    background-color: gold !important;
  }

  .bulk-actions {
    margin-top: 20px;
  }
}
</style>