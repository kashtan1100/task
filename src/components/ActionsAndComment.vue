<template>
  <div>
    <p v-if="editingPostId !== post.id" class="post-body"></p>
    <textarea
        v-else
        :value="editedBody"
        @input="$emit('update-edited-body', $event.target.value)"
        class="edit-body w-100"
        placeholder="Введите новый текст поста"
    ></textarea>

  <div class="post-actions">
    <button @click="$emit('toggle-comments', post.id)" title="Комментарии">
      {{ activeComments === post.id ? 'Скрыть комментарии' : 'Показать комментарии' }}
    </button>

    <button
        v-if="editingPostId === post.id"
        @click="$emit('save-edit')"
        title="Сохранить изменения"
    >
      💾 Сохранить
    </button>
    <button
        v-if="editingPostId === post.id"
        @click="$emit('cancel-edit')"
        title="Отменить"
    >
      ❌ Отменить
    </button>
    <button
        v-else
        @click="$emit('edit-post', post.id)"
        title="Редактировать"
    >
      ✏️
    </button>
    <button @click="$emit('delete-post', post.id)" title="Удалить">
      🗑️
    </button>
    <button
        @click="$emit('toggle-favorite', post.id)"
        :class="{ favorite: favorites.includes(post.id) }"
        title="В избранное"
    >
      ⭐
    </button>
  </div>

  <div v-if="activeComments === post.id" class="comments">
    <ul>
      <li
          class="title-comments"
          v-for="comment in postComments"
          :key="comment.id"
      >
        <p><b>{{ comment.name }}</b> ({{ comment.email }})</p>
        <p>{{ comment.body }}</p>
      </li>
    </ul>
  </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

defineProps({
    post: { type: Object, required: false },
    activeComments: { type: Number, required: false },
    editingPostId: { type: Number, required: false },
    favorites: { type: Array, required: false },
    postComments: { type: Array, required: false },
    editedBody: { type: String, required: false },
});

defineEmits([
    'toggle-comments',
    'save-edit',
    'cancel-edit',
    'edit-post',
    'delete-post',
    'toggle-favorite',
    'update-edited-body',
]);
</script>

<style scoped>
.favorite {
    color: gold;
}
</style>