<template>
  <!--  TODO половина верстки повторяется эт плохо!!!-->

  <div class="FotoComp">

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
          <!--        <input-->
          <!--            type="checkbox"-->
          <!--            :value="post.id"-->
          <!--            v-model="selectedPosts"-->
          <!--            class="select-post"-->
          <!--        />-->
          <!--        <div class="bulk-actions" v-if="selectedPosts.includes(post.id)">-->
          <!--          <button @click="openModal('delete')">Удалить выбранные</button>-->
          <!--          <button @click="openModal('favorite')">Добавить в избранное</button>-->
          <!--        </div>-->

          <!--        <BModal v-model="modalVisible" :title="modalTitle">-->
          <!--          <p>{{ modalMessage }}</p>-->
          <!--          <template #footer>-->
          <!--            <button @click="confirmModalAction">Подтвердить</button>-->
          <!--            <button @click="cancelModalAction">Отменить</button>-->
          <!--          </template>-->
          <!--        </BModal>-->


          <div class="post-header">
            <h3>{{ post.title }}</h3>
            <p class="post-user">Автор оказывается в запросе нет вывожу URL: {{ post.url }}</p>
          </div>
          <p v-if="editingPostId !== post.id" class="post-body">{{ post.body }}</p>
          <!--        <textarea-->
          <!--            v-else-->
          <!--            v-model="editedPost.body"-->
          <!--            class="edit-body"-->
          <!--            placeholder="Введите новый текст поста"-->
          <!--        ></textarea>-->

          <!--        <div class="post-actions">-->
          <!--          <button @click="showComments(post.id)" title="Комментарии">-->
          <!--            {{ activeComments === post.id ? 'Скрыть комментарии' : 'Показать комментарии' }}-->
          <!--          </button>-->

          <!--          <button v-if="editingPostId === post.id" @click="saveEditPost" title="Сохранить изменения">-->
          <!--            💾 Сохранить-->
          <!--          </button>-->
          <!--          <button v-if="editingPostId === post.id" @click="cancelEditPost" title="Отменить">-->
          <!--            ❌ Отменить-->
          <!--          </button>-->
          <!--          <button v-else @click="editPost(post.id)" title="Редактировать">-->
          <!--            ✏️-->
          <!--          </button>-->
          <!--          <button @click="deletePost(post.id)" title="Удалить">-->
          <!--            🗑️-->
          <!--          </button>-->
          <!--          <button-->
          <!--              @click="toggleFavorite(post.id)"-->
          <!--              :class="{ favorite: favorites.includes(post.id) }"-->
          <!--              title="В избранное"-->
          <!--          >-->
          <!--            ⭐-->
          <!--          </button>-->
          <!--        </div>-->

          <!--        <div v-if="activeComments === post.id" class="comments">-->
          <!--          <ul>-->
          <!--            <li class="title-comments" v-for="comment in comments.find((c) => c.postId === post.id)?.comments || []" :key="comment.id">-->
          <!--              <p><b>{{ comment.name }}</b> ({{ comment.email }})</p>-->
          <!--              <p>{{ comment.body }}</p>-->
          <!--            </li>-->
          <!--          </ul>-->
          <!--        </div>-->
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePostActions} from "@/composables/usePostActions.ts";
import {onMounted, ref, watch} from "vue";
import {fetchPostsPhoto, fetchUsers} from "@/api/postService.ts";

let {
  posts, favorites, selectedPosts, editingPostId, editedPost, activeComments, perPage, modalVisible,
  modalTitle, modalMessage, cancelEditPost, deletePost, toggleFavorite, handleBulkAction,
  editPost, saveEditPost, updatePerPage, confirmModalAction, cancelModalAction, openModal,
  showComments, displayedPosts, updateFilteredPosts, rows, comments, postTitleFilter,
  selectedUsers, filterFavorites, sortField, sortDirection,
} = usePostActions();

const users = ref<{ id: number; name: string }[]>([]);
const perPageOptions = [10, 20, 50, 100, -1];

const fetchAllPhoto = async () => {
  posts.value = await fetchPostsPhoto("photos");
};

const fetchAllUsers = async () => {
  users.value = await fetchUsers();
};
onMounted(() => {
  fetchAllPhoto();
  fetchAllUsers();
  watch(posts, updateFilteredPosts);
});
</script>

<style lang="scss">
.FotoComp {
  width: 100%;
  height: auto;
}
</style>