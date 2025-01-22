<template>
  <div class="posts-app">

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
          <textarea
              v-else
              v-model="editedPost.body"
              class="edit-body"
              placeholder="Введите новый текст поста"
          ></textarea>

          <div class="post-actions">
            <button @click="showComments(post.id)" title="Комментарии">
              {{ activeComments === post.id ? 'Скрыть комментарии' : 'Показать комментарии' }}
            </button>

            <button v-if="editingPostId === post.id" @click="saveEditPost" title="Сохранить изменения">
              💾 Сохранить
            </button>
            <button v-if="editingPostId === post.id" @click="cancelEditPost" title="Отменить">
              ❌ Отменить
            </button>
            <button v-else @click="editPost(post.id)" title="Редактировать">
              ✏️
            </button>
            <button @click="deletePost(post.id)" title="Удалить">
              🗑️
            </button>
            <button
                @click="toggleFavorite(post.id)"
                :class="{ favorite: favorites.includes(post.id) }"
                title="В избранное"
            >
              ⭐
            </button>
          </div>

          <div v-if="activeComments === post.id" class="comments">
            <ul>
              <li class="title-comments" v-for="comment in comments.find((c) => c.postId === post.id)?.comments || []" :key="comment.id">
                <p><b>{{ comment.name }}</b> ({{ comment.email }})</p>
                <p>{{ comment.body }}</p>
              </li>
            </ul>
          </div>
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
import { ref, computed, onMounted, watch } from "vue";
import {fetchComments, fetchPosts, fetchUsers} from "@/api/postService.ts";
import { Post, Comment } from "@/types/postTypes";
import { usePostActions } from "@/composables/usePostActions";

const {
  posts, favorites, selectedPosts, editingPostId, editedPost, activeComments, perPage, modalVisible,
  modalTitle, modalMessage, cancelEditPost, deletePost, toggleFavorite, handleBulkAction,
  editPost, saveEditPost, updatePerPage, confirmModalAction, cancelModalAction, openModal,
} = usePostActions();

const users = ref<{ id: number; name: string }[]>([]);
const comments = ref<Comment[]>([]);
const currentPage = ref(1);
const perPageOptions = [10, 20, 50, 100, -1];
const postTitleFilter = ref('');

const updateFilteredPosts = () => {
  filteredPosts.value = posts.value.filter((post) =>
      post.title.toLowerCase().includes(postTitleFilter.value.toLowerCase())
  );
};

const filteredPosts = ref<Post[]>([]);

const displayedPosts = computed(() => {
  const postsToDisplay = postTitleFilter.value ? filteredPosts.value : posts.value;
  if (perPage.value === -1) return postsToDisplay;
  const start = (currentPage.value - 1) * perPage.value;
  return postsToDisplay.slice(start, start + perPage.value);
});

const fetchAllPosts = async () => {
  posts.value = await fetchPosts();
};

const fetchAllUsers = async () => {
  users.value = await fetchUsers();
};

const getUserName = (userId: number) => users.value.find((u) => u.id === userId)?.name || "Неизвестный автор";

const rows = computed(() => posts.value.length);


const fetchPostComments = async (postId: number) => {
  const existing = comments.value.find((c) => c.postId === postId);
  if (!existing) {
    const postComments = await fetchComments(postId);
    comments.value.push({ postId, comments: postComments });
  }
};

const showComments = async (postId: number) => {
  if (activeComments.value === postId) {
    activeComments.value = null;
  } else {
    await fetchPostComments(postId);
    activeComments.value = postId;
  }
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