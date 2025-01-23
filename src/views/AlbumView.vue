<template>
  <div class="album-view-wrapper" ref="albumWrapper" @click.self="hideAlbumView">
    <div class="album-view">
      <h2>Альбом: {{ albumTitle }}</h2>
      <div class="thumbnails">
        <div
            v-for="photo in photos"
            :key="photo.id"
            class="thumbnail"
            @click="openModal(photo)"
        >
          <img :src="photo.thumbnailUrl" :alt="photo.title" />
          <p>{{ photo.title }}</p>
        </div>
      </div>

      <BModal v-model="isModalVisible" hide-footer size="lg" title="Просмотр изображения">
        <div class="modal-content">
          <img v-if="selectedPhoto" :src="selectedPhoto.url" :alt="selectedPhoto.title" />
          <p>{{ selectedPhoto?.title }}</p>
        </div>
      </BModal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { fetchPostsPhoto } from "@/api/postService.ts";

const props = defineProps({
    albumId: {
        type: Number,
        required: true,
    },
    albumTitle: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["close"]);

const photos = ref([]);
const isModalVisible = ref(false);
const selectedPhoto = ref(null);
const albumWrapper = ref(null);

const fetchPhotos = async () => {
    try {
        photos.value = await fetchPostsPhoto("photos");
        photos.value = photos.value.filter((photo) => photo.albumId === props.albumId);
    } catch (error) {
        console.error("Ошибка при загрузке фотографий:", error);
    }
};

const openModal = (photo) => {
    selectedPhoto.value = photo;
    isModalVisible.value = true;
};

const hideAlbumView = () => {
    emit("close");
};

onMounted(fetchPhotos);
</script>

<style scoped>
.album-view-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 98;
}

.album-view {
    position: fixed;
    margin: 1rem 0;
    z-index: 99;
    width: 500px;
    height: auto;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
}

.hidden {
    display: none;
}

.thumbnails {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.thumbnail {
    cursor: pointer;
    text-align: center;
    max-width: 150px;
}

.thumbnail img {
    border-radius: 8px;
    max-width: 100%;
}

.modal-content img {
    max-width: 100%;
    border-radius: 8px;
}

.modal-content {
    text-align: center;
}
</style>