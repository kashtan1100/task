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
  </div>
</template>

<script setup lang="ts">
import {usePostActions} from "@/composables/usePostActions.ts";
import {onMounted, ref, watch} from "vue";
import {fetchPostsPhoto, fetchUsers} from "@/api/postService.ts";
import PostActionsAndComments from "@/components/ActionsAndComment.vue";

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
</style>